# main.py

from flask import Blueprint, render_template,request
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/test')
def test():
    return render_template('test.html')


@main.route('/profile')
@login_required
def profile():
    return render_template('profile.html', name=current_user.name, surname=current_user.surname, mobile_number=current_user.mobile_number, email=current_user.email)

@main.route('/test', methods=['POST'])
def testScan():
    print(request.form["ip"])
    selected = request.form.getlist('c_check')
    print(selected)
    any_selected = bool(selected)
    print(any_selected)
    ## todo run snmp based on form's inputs
    
    return render_template('index.html')

