# main.py

from flask import Blueprint, render_template,request,Markup
from flask_login import login_required, current_user
import subprocess

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/quick-scan')
def quick_scan():
    return render_template('quick-scan.html',result="NONE")


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, surname=current_user.surname, mobile_number=current_user.mobile_number, email=current_user.email)

@main.route('/quick-scan', methods=['POST'])
def quick_scan_post():
    ip = request.form["ip"]
    print(request.form["ip"])
    selected = request.form.getlist('c_check')
    args = ['../build/centom_engine','-get']
    args.extend([ip])
    args.extend(selected)
    print(args)
    print("*********************************")
    result = subprocess.run(args, stdout=subprocess.PIPE)
    print(result.stdout.decode('utf-8'))
    result = result.stdout.decode('utf-8')
    result = Markup(result.replace('\n', '<br>'))
    return render_template('quick-scan.html',result=result)

