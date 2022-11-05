from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np

app = Sanic("Python-Hosted-Model")

heart_model = tf.saved_model.load('./heart/notebook/model')
diabetes_model = tf.saved_model.load('./diabetes/notebook/model')
stroke_model = tf.saved_model.load('./stroke/notebook/model')

@app.post("/index/test/heart")
def callModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content)
    predictions = heart_model(predict_dataset, training=False)
    probs = tf.nn.softmax(predictions)
    class_indexes = tf.argmax(probs, axis = 1 ).numpy()
    results = []
    for i, class_idx in enumerate(class_indexes):
        p = np.max(probs[i].numpy())
        if int(class_idx) == 1: 
            decision = "Yes"
        else: 
            decision = "No" 
        results.append({"Heart Disease": decision,"probability": float(p)})
    
    print(results)
    return json({"data":results})


@app.post("/index/test/diabetes")
def callModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content)
    predictions = diabetes_model(predict_dataset, training=False)
    probs = tf.nn.softmax(predictions)
    class_indexes = tf.argmax(probs, axis = 1 ).numpy()
    results = []
    for i, class_idx in enumerate(class_indexes):
        p = np.max(probs[i].numpy())
        if int(class_idx) == 1: 
            decision = "Yes"
        else: 
            decision = "No" 
        results.append({"Diabetes": decision,"probability": float(p)})
    
    print(results)
    return json({"data":results})
    

@app.post("/index/test/stroke")
def callModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content)
    predictions = stroke_model(predict_dataset, training=False)
    probs = tf.nn.softmax(predictions)
    class_indexes = tf.argmax(probs, axis = 1 ).numpy()
    results = []
    for i, class_idx in enumerate(class_indexes):
        p = np.max(probs[i].numpy())
        if int(class_idx) == 1: 
            decision = "Yes"
        else: 
            decision = "No" 
        results.append({"Stroke": decision,"probability": float(p)})
    
    print(results)
    return json({"data":results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)