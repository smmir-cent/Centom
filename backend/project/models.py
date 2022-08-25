# models.py

from flask_login import UserMixin
from . import db

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    user_role = db.Column(db.String(100))

class Network(db.Model):
    __tablename__ = "network"
    name = db.Column(db.String(100), primary_key=True) # primary keys are required by SQLAlchemy
    subnet = db.Column(db.String(100))
    agents = db.Column(db.String(1000))
    info = db.Column(db.String(1000))


# class NetConfig(db.Model):
#     __tablename__ = "net_config"
#     ip = db.Column(db.String(100), primary_key=True) # primary keys are required by SQLAlchemy
#     subnet = db.Column(db.String(100))
#     username = db.Column(db.String(100))
#     password = db.Column(db.String(100))
#     engine_id = db.Column(db.String(100))
#     ## todo: 
#     ## CPU ---> Percentages of system CPU time (walk or get: .1.3.6.1.4.1.2021.11.10)
#     ## CPU ---> CPU Load (walk: .1.3.6.1.4.1.2021.10.1.3)
#     ## Memory ---> Total Real/Physical Memory Space on the host(get .1.3.6.1.4.1.2021.4.5)
#     ## Memory ---> Available Real/Physical Memory Space on the host(get .1.3.6.1.4.1.2021.4.6)
#     ## Swap ---> free/total (get .1.3.6.1.4.1.2021.4.3 , .1.3.6.1.4.1.2021.4.4)
#     ## Disk ---> perc(get .1.3.6.1.4.1.2021.9.1.9) total: (get .1.3.6.1.4.1.2021.9.1.6)
#     ## sysUpTime
#     ## interface