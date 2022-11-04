from tensorflow import keras
import numpy as np

from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route("/", methods = ['GET', 'POST'])
def diabetes():
    model = keras.models.load_model('./model')
    request.json.get('name')
    request.json.get('pregnancies')
    request.json.get('glucose')
    request.json.get('blood-pressure')
    request.json.get('skin-thickness')
    request.json.get('insulin')
    request.json.get('bmi')
    request.json.get('pedigree')
    request.json.get('age')

    print(request.json.get('name'))
    print(request.json.get('pregnancies'))
    # a = model.predict(np.array(x).reshape((1,8)))
    return "<strong>Prediction:</strong> %s"
