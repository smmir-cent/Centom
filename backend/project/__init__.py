# init.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager 
from flask_jwt_extended import JWTManager
from datetime import timedelta
import json
# init SQLAlchemy so we can use it later in our models
db = SQLAlchemy()

def create_app(redis_pass,sqlite_pass):
    app = Flask(__name__)

    app.config['redis_pass'] = redis_pass
    app.config['sqlite_pass'] = sqlite_pass
    app.config['SECRET_KEY'] = '9OLWxND4o83j4K4iuopO'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    jwt = JWTManager(app)
    db.init_app(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    from project.models import User

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    # blueprint for auth routes in our app
    from project.auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    # blueprint for non-auth parts of app
    from project.main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
if __name__ == "__main__":
    with open("/etc/centom/centom.json", "r") as jsonfile:
        data = json.load(jsonfile)
        print("Read successful")
    print(data)    
    redis_pass =  data['redis_pass']
    sqlite_pass =  data['sqlite_pass']
    create_app(redis_pass,sqlite_pass).run(host= '0.0.0.0', port=5000,debug=True)