# main.py

import random
from flask import Blueprint,request,jsonify
from project.auth import token_required
import subprocess
import sys
import json
sys.path.insert(1,'./utility/net-dis')
sys.path.insert(1,'./utility/net-config')
from discovery import scan_net
from net_config import save_ip_net_config
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

@main.route('/profile',methods=["GET"])
@token_required
def my_profile(current_user):
    response_body = {
        "name": current_user.name, 
        "surname": current_user.surname, 
        "mobile_number": current_user.mobile_number, 
        "email": current_user.email 
    }

    return response_body,200

def random_color():
    return "#"+''.join([random.choice('ABCDEF0123456789') for i in range(6)])


def create_network_json(res_info):
    network_graph = {"nodes": [],"edges": []}
    all_nodes = {}
    ids = 1

    all_nodes["manager"] = ids
    network_graph['nodes'].append({
        "id" : ids,
        "label" : "manager",
        "color": random_color()
        })
    ids += 1
    for node in res_info.keys():
        if node not in all_nodes.keys(): 
            all_nodes[node] = ids
            network_graph['nodes'].append({
                "id" : ids,
                "label" : node,
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



@main.route('/net-discovery',methods=['POST'])
@token_required
def net_dis_post(current_user):
    # get subnet
    form = request.json
    subnet = form.get("ip")
    name = form.get("name")
    save = form.get("save")
    print("subnet")
    print(subnet)
    print(name)
    print(save)
    print("name")
    if save:
        net = Network.query.filter_by(name=name).first() # if this returns a user, then the email already exists in database
        if net: # if a net is found, user must try again  
            return jsonify({'message' : 'Network already exists. Please try again.'}), 401

    # run net-dis utility
    res_info = scan_net(subnet)
    if len(res_info) == 0:
        ## invalid IP network
        return {"message":"invalid IP network"},200
    
    # add infos to network table
    
    # info: {subnet:res_info}
    # name: name
    ############################################## res_info.keys(): have snmp agent
    network_graph = create_network_json(res_info)
    if save:
        # create new net with the form data.
        new_net = Network(name=name,subnet=subnet,agents=json.dumps({'agents':list(res_info.keys())}),info=json.dumps(network_graph, indent = 4))

        # add the new net to the database
        db.session.add(new_net)
        db.session.commit()

    # return net graph image or json to render in js
    return jsonify({'message' : network_graph}), 200



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
    ips = Network.query.filter_by(name=subnet).first()    
    agents = json.loads(ips.agents)    
    response_body = {'ips':agents['agents']}
    return response_body,200


@main.route('/get-ip-info',methods=["GET"])
@token_required
def get_ip_info(current_user):
    args = request.args
    ip = args.get("ip")
    subnet = args.get("subnet")
    response_body = {'ips':'a'}
    # ips = Network.query.filter_by(name=subnet).first()    
    # agents = json.loads(ips.agents)    
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
    config_json['params'] = json.loads(form.get("params"))['params']
    save_ip_net_config(config_json)
    # print("////////////////////")
    # print(json.dumps(config_json, indent=4))
    # print("////////////////////")
    return jsonify({'message' : "Saved Successfully."}), 200
