# main.py

import random
from flask import Blueprint,request,jsonify,Response
from project.auth import token_required
import subprocess
import sys
import ast
import json
sys.path.insert(1,'./utility/net-dis')
sys.path.insert(1,'./utility/net-config')
sys.path.insert(1,'./utility/monitoring')

from discovery import scan_net
from monitor import monitoring
from notify import notifying
from net_config import save_ip_net_config,get_ip_net_config
from project.models import Network
from project import db
import copy

main = Blueprint('main', __name__)

@main.route('/quick-scan', methods=['POST'])
@token_required
def quick_scan_post(current_user):
    form = request.json
    ip = form.get("ip")
    options = form.get("options")

    oids = {'get':[],'walk':[]}
    for item in options:
        oids[item['mode']].append(item['oid'])

    print(oids)
    result = ""
    for item in oids.keys():
        mode = '-'+ item
        args = ['../build/centom_engine',mode]
        args.extend([ip])
        args.extend( oids[item])

        engine_result = subprocess.run(args, stdout=subprocess.PIPE)
        print(engine_result.stdout.decode('utf-8'))
        result += engine_result.stdout.decode('utf-8')
        result += "\n\n"

    print(result)
    return {"result":result},200


def random_color():
    return "#"+''.join([random.choice('ABCDEF0123456789') for i in range(6)])


def create_network_json(res_info,targets):
    network_graph = {"nodes": [],"edges": []}
    all_nodes = {}
    ids = 1

    all_nodes["manager"] = ids
    network_graph['nodes'].append({
        "id" : ids,
        "label" : "manager",
        "title" : "Manager",
        "color": random_color()
        })
    ids += 1
    for node in res_info.keys():
        if node not in all_nodes.keys(): 
            all_nodes[node] = ids
            network_graph['nodes'].append({
                "id" : ids,
                "label" : node,
                "title" : str(targets[node]),
                "color": random_color()
            })
            ids += 1

    for path in res_info.values():
        for node in path:
            if node not in all_nodes.keys(): 
                all_nodes[node] = ids
                network_graph['nodes'].append({
                    "id" : ids,
                    "label" : node,
                    "title" : 'None',
                    "color": random_color()
                })
                ids += 1


    for dest in res_info.keys():
        network_graph['edges'].append({
           "from": all_nodes['manager'],
           "to": all_nodes[dest]
           })        
        lst = copy.deepcopy(res_info[dest])
        lst.pop(0)
        print("------------------------")
        print(res_info[dest])
        print(lst)
        print("------------------------")

        for (source, destination) in zip(res_info[dest],lst):
            print(source, destination)
            network_graph['edges'].append({
                "from": all_nodes[source],
                "to": all_nodes[destination]
                })
    return network_graph



@main.route('/net-discovery',methods=['POST','GET'])
@token_required
def net_dis_post(current_user):
    if request.method == 'POST':
        # get subnet
        form = request.json
        network = form.get("network")
        name = form.get("name")
        ip = form.get("ip")
        mask = form.get("mask")
        agents = form.get("agents")
        subnet = ip + '/' + mask

        print("subnet")
        print(json.dumps(network, indent=4))
        print(name)
        print(ip)
        print(mask)
        print(agents)
        print(subnet)
        print("name")

        net = Network.query.filter_by(name=name).first() # if this returns a user, then the email already exists in database
        if net: # if a net is found, user must try again  
            return jsonify({'message' : 'Network already exists. Please try again.'}), 401
        # create new net with the form data.
        new_net = Network(name=name,subnet=subnet,agents=json.dumps({'agents':ast.literal_eval(agents)}),info=json.dumps(network, indent = 4))

        # add the new net to the database
        db.session.add(new_net)
        db.session.commit()
        return {"message":"Saved successfully"},200

    if request.method == 'GET':
        args = request.args
        ip = args.get('ip')
        mask = args.get('mask')
        subnet = ip + '/' + mask
        # run net-dis utility
        res_info,targets = scan_net(subnet)
        print("res_info")
        print(res_info)
        if len(res_info) == 0:
            ## invalid IP network
            return {"message":"invalid IP network"},200
    

        # info: {subnet:res_info}
        # name: name
        ############################################## res_info.keys(): have snmp agent
        network_graph = create_network_json(res_info,targets)
        print(json.dumps(network_graph, indent=4))
        # return net graph image or json to render in js
        return jsonify({'message' : network_graph,'agents':str(list(res_info.keys()))}), 200



@main.route('/get-networks',methods=["GET"])
@token_required
def get_networks(current_user):
    networks = Network.query.all()
    response_body = {'networks':[]}
    
    for network in networks:
        # print('###################')
        # print(network.name)
        # print(network.subnet)
        # print('###################')
        response_body["networks"].append({
            'name':network.name,
            'subnet':network.subnet
        })
    
    return response_body,200




@main.route('/get-ips',methods=["GET"])
@token_required
def get_ips(current_user):
    args = request.args
    subnet = args.get("subnet")
    types = args.get("type")
    ips = Network.query.filter_by(name=subnet).first()    
    ## todo for network config search
    agents = json.loads(ips.agents)
    net_info = json.loads(ips.info)
    req_ips = []
    for node in net_info['nodes']:
        if (types in node['title'] or types== "All") and (node["label"] in agents['agents']) :
            print(str(node))
            req_ips.append(node["label"])
    response_body = {'ips':req_ips}
    return response_body,200


@main.route('/net-config',methods=['POST'])
@token_required
def net_config_post(current_user):
    # get subnet
    form = request.json
    config_json = {}
    config_json['ip'] = form.get("ip")
    config_json['network'] = form.get("network")
    config_json['username'] = form.get("username")
    config_json['password'] = form.get("password")
    config_json['engineId'] = form.get("engineId")
    config_json['oid_name'] = form.get("oid_name")
    config_json['oid_location'] = form.get("oid_location")
    config_json['oid_description'] = form.get("oid_description")
    config_json['params'] = json.loads(form.get("params"))

    im_oids = open('../assets/im_oids.json')
    data = json.load(im_oids)

    for param in config_json['params']:
        param['oid'] = data['params'][param['params_name']]['oid']

    for def_param in data['def_params'].keys():
        config_json['params'].append({
            "params_name":def_param,
            "oid": data['def_params'][def_param]['oid'],
            "rate":data['def_params'][def_param]['rate']
        })
    im_oids.close()


    save_ip_net_config(config_json)
    print("////////////////////")
    print(json.dumps(config_json, indent=4))
    print("////////////////////")
    return jsonify({'message' : "Saved Successfully."}), 200







@main.route('/fetch-config',methods=['POST'])
@token_required
def get_net_config(current_user):
    # get subnet
    form = request.json
    ip = form.get("ip")
    network = form.get("network")
    config_json = get_ip_net_config(ip,network)   
    config_json.pop('params',None)
    return jsonify({'message' : config_json}), 200


import time
from datetime import datetime
@main.route('/stream')
def stream():
    print("stream")

    def get_data():
        print("get_data")
        while True:
            print('*')
            #gotcha
            time.sleep(1)
            yield f'data: {datetime.now().second} \n\n'
    response = Response(get_data(), mimetype='text/event-stream')
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response,200


@main.route('/monitoring',methods=['OPTIONS','GET'])
# @token_required
def monitor():
    print("monitor")
    print("monitor")
    print("monitor")
    args = request.args
    print(args)
    ip = args.get("ip")
    network = args.get("network")
    name = args.get("name")
    location = args.get("location")
    description = args.get("description")
    # ip = "192.168.220.129"
    # network = "simple network"
    # name = "sysName.0"
    # location = "sysLocation.0"
    # description = "sysDescr.0"
    print("ip,network,name,location,description")
    print(ip,network,name,location,description)
    print("ip,network,name,location,description")
    response = Response(monitoring(ip,network,name,location,description), mimetype="text/event-stream")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods' ,'*')
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Credentials' ,'true')
    response.headers.add('Access-Control-Allow-Private-Network' ,'true')
    return response,200



@main.route('/get-params',methods=["GET"])
@token_required
def get_params(current_user):
    im_oids = open('../assets/im_oids.json')
    data = json.load(im_oids)
    oid_params = list(data['params'].keys())
    print(oid_params)
    response_body = {'params':oid_params}
    im_oids.close()
    return response_body,200



@main.route('/notification',methods=['GET'])
# @token_required
def notify_trap():
    print("notify_trap")
    print("notify_trap")
    print("notify_trap")
    args = request.args
    print(args)
    # ip = args.get("ip")
    # network = args.get("network")
    # name = args.get("name")
    # location = args.get("location")
    # description = args.get("description")


    # print("ip,network,name,location,description")
    # print(ip,network,name,location,description)
    # print("ip,network,name,location,description")

    response = Response(notifying(), mimetype="text/event-stream")
    response.headers["Cache-Control"] = "no-cache"
    response.headers["X-Accel-Buffering"] = "no"
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods' ,'*')
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Credentials' ,'true')
    response.headers.add('Access-Control-Allow-Private-Network' ,'true')
    return response,200    

@main.before_request   
def after_request_callback():   
    path = request.path   
    args = ["fuser" ,"-k" ,"162/udp"]
    engine_result = subprocess.run(args, stdout=subprocess.PIPE)
    print(engine_result.stdout.decode('utf-8'))


    # if path == '/notification':
    #     pass
  
    