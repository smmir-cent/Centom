# models.py

from flask_login import UserMixin
from backend.project import db

class User(UserMixin, db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True) # primary keys are required by SQLAlchemy
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    name = db.Column(db.String(1000))
    surname = db.Column(db.String(1000))
    mobile_number = db.Column(db.String(1000))

class Network(db.Model):
    __tablename__ = "network"
    name = db.Column(db.String(100), primary_key=True) # primary keys are required by SQLAlchemy
    info = db.Column(db.String(1000))