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
