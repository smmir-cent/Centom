# main.py

from flask import Blueprint,request
from project.auth import token_required
import subprocess

main = Blueprint('main', __name__)

@main.route('/quick-scan', methods=['POST'])
@token_required
def quick_scan_post(current_user):
    form = request.json
    ip = form.get("ip")
    options = form.get("options")
    # print("#################")
    # print(ip)
    # print(options)
    # print("#################")

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
        # result = Markup(result.replace('\n', '<br/>'))

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