from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np
import neattext.functions as nfx
from keras.preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences

app = Sanic("Python-Hosted-Model")

suicide_model = tf.saved_model.load('./suicide-detection/model')
heart_model = tf.saved_model.load('./heart/notebook/model')
diabetes_model = tf.saved_model.load('./diabetes/notebook/model')
stroke_model = tf.saved_model.load('./stroke/notebook/model')

@app.post("/index/test/suicide")
def callModel(request):
    content = request.json
    
    print(content)

    text_length=[]
    cleaned_text=[]
    for str in content :
        str=str.lower()
        str=nfx.remove_special_characters(str)
        str=nfx.remove_stopwords(str)
        text_length.append(len(str.split()))
        cleaned_text.append(str)
    
    tokenizer=Tokenizer()
    tokenizer.fit_on_texts(cleaned_text)
    test_text_seq= tokenizer.texts_to_sequences(cleaned_text)
    test_text_pad= pad_sequences(test_text_seq,maxlen=40)
    predict_dataset = tf.convert_to_tensor(test_text_pad, dtype =np.float32)
    predictions = suicide_model(predict_dataset, training=False)
    
    print(predictions)
    
    probs = tf.nn.softmax(predictions)
    class_indexes = tf.argmax(probs, axis = 1 ).numpy()

    print (probs)
    print (class_indexes)

    results = []
    for i, class_idx in enumerate(class_indexes):
        p = np.max(probs[i].numpy())
        if int(class_idx) == 1: 
            decision = "Yes"
        else: 
            decision = "No" 
        results.append({"Suicide Risk": decision,"probability": float(p)})
    
    print(results)
    return json({"data":results})

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
    print("predictions",predictions)
    probs = tf.nn.softmax(predictions)
    print("probs", probs)
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