# auth.py

from flask import Blueprint,current_app, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from project.models import User
from project import db
from flask_jwt_extended import unset_jwt_cookies
from functools import wraps
from datetime import datetime, timedelta
import jwt
auth = Blueprint('auth', __name__)

##############################################

# @auth.after_request
# def refresh_expiring_jwts(response):
#     try:
#         exp_timestamp = get_jwt()["exp"]
#         now = datetime.now(timezone.utc)
#         target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
#         if target_timestamp > exp_timestamp:
#             access_token = create_access_token(identity=get_jwt_identity())
#             data = response.get_json()
#             if type(data) is dict:
#                 data["access_token"] = access_token 
#                 response.data = json.dumps(data)
#         return response
#     except (RuntimeError, KeyError):
#         # Case where there is not a valid JWT. Just return the original respone
#         return response



@auth.route("/logout",methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    print(response)
    return response


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization']
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
        try:
            # decoding the payload to fetch the stored details
            decoded_data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'], options={"verify_signature": False})
            current_user = User.query\
                .filter_by(email = decoded_data['email'])\
                .first()
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401    
            # returns the current logged in users contex to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated    




@auth.route('/login', methods=['POST'])
def login_post():
    auth = request.json
    remember = True if auth.get('remember') else False
    print(auth.get('email'))
    print(auth.get('password'))

    if not auth or not auth.get('email') or not auth.get('password'):
        # returns 401 if any email or / and password is missing
        return jsonify({'message' : 'email or/and password is missing'}) , 401

    email = auth.get('email')
    password = auth.get('password')

    print(email)
    print(password)
    print(remember)

    user = User.query.filter_by(email=email).first()

    if not user:
        # returns 401 if user does not exist
        return jsonify({'message' : 'user does not exist'}),401


    if check_password_hash(user.password, password):
        # generates the JWT Token
        ## todo: json config
        print("input email : "+ user.email)
        token = jwt.encode({
            "email": user.email,
            'exp' : datetime.utcnow() + timedelta(minutes = 30)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'access_token' : token}), 201
    return jsonify({'message' : 'Could not verify'}),403


@auth.route('/register', methods=['POST'])
def signup_post():
    auth = request.json

    email = auth.get('email')
    name = auth.get('name')
    surname = auth.get('surname')
    mobile_number = auth.get('mobile_number')
    password = auth.get('password')

    print("recieved form")
    print(email)
    print(name)
    print(surname)
    print(mobile_number)
    print(password)
    print("/recieved form")






    user = User.query.filter_by(email=email).first() # if this returns a user, then the email already exists in database

    if user: # if a user is found, we want to redirect back to signup page so user can try again  
        return jsonify({'message' : 'User already exists. Please Log in.'}), 401

    # create new user with the form data. Hash the password so plaintext version isn't saved.
    new_user = User(email=email, name=name,surname=surname,mobile_number=mobile_number, password=generate_password_hash(password, method='sha256'))

    # add the new user to the database
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message' : 'Successfully registered.'}), 201