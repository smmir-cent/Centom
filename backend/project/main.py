# main.py

from flask import Blueprint,request,Markup
from project.auth import token_required
import subprocess

main = Blueprint('main', __name__)

@main.route('/quick-scan', methods=['POST'])
@token_required
def quick_scan_post(current_user):
    form = request.json
    ip = form.get("ip")
    options = form.get("options")
    print("#################")
    print(ip)
    print(options)
    print("#################")
    # get = []
    # walk = []
    oids = {'get':[],'walk':[]}
    for item in options:
        oids[item['mode']].append(item['oid'])

    print(oids)

    for item in oids.keys():
        mode = '-'+ item
        args = ['../build/centom_engine',mode]
        args.extend([ip])
        args.extend( oids[item])
        # print("****************")
        # print(args)
        result = subprocess.run(args, stdout=subprocess.PIPE)
        print(result.stdout.decode('utf-8'))
        result = result.stdout.decode('utf-8')
        result += '\n\n\n'
        result = Markup(result.replace('\n', '<br>'))
    # return render_template('quick-scan.html',result=result)

    print(result)



    return {},200
    # print(args)
    # print("*********************************")



##############################################


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