from tensorflow import keras
import numpy as np

from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/")
def diabetes():
    
    return "<strong>Prediction:</strong> %s"

