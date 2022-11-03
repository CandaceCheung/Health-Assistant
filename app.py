from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np

app = Sanic("Python-Hosted-Model")

@app.post("/heart")
def callModel(request):
    model = tf.saved_model.load('./heart/notebook/model/saved_model.pb')
    content = request.json
    predict_dataset = tf.convert_to_tensor(content)
    predictions = model(predict_dataset, training=False)
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
    return json({"data":results})



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)