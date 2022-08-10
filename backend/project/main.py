# main.py

from flask import Blueprint,request,jsonify
from project.auth import token_required
import subprocess
import sys
import json
sys.path.insert(1,'../utility/net-dis')
from discovery import scan_net
from project.models import Network
from project import db

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



@main.route('/net-discovery',methods=["GET"])
@token_required
def net_dis(current_user):
    pass 
    # get subnet
    # run net-dis utility
    # return net graph image or json to render in js

@main.route('/net-discovery',methods=["POST"])
@token_required
def net_dis_post(current_user):
    # get subnet
    form = request.json
    subnet = form.get("subnet")
    name = form.get("name")
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

    # create new net with the form data.
    info = {subnet:res_info}
    new_net = Network(name=name,info=json.dumps(info, indent = 4))

    # add the new net to the database
    db.session.add(new_net)
    db.session.commit()

    # return net graph image or json to render in js
    return jsonify({'message' : info}), 200

