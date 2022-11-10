from sanic import Sanic
from sanic.response import json
import tensorflow as tf
import numpy as np
import neattext as nt
import neattext.functions as nfx
from keras.preprocessing.text import Tokenizer
from keras_preprocessing.sequence import pad_sequences

app = Sanic("Python-Hosted-Model")

lung_model = tf.saved_model.load('./lung-cancer/notebook/model')
suicide_model = tf.saved_model.load('./suicide-detection/notebook/model')
heart_model = tf.saved_model.load('./heart/notebook/model')
diabetes_model = tf.saved_model.load('./diabetes/notebook/model')
stroke_model = tf.saved_model.load('./stroke/notebook/model')

@app.post("/index/test/lung")
def callLungModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content, dtype=tf.float32)
    predictions = lung_model(predict_dataset, training=False)
    probs = predictions.numpy()[0]

    results = []

    if probs[0] > 0.5: 
        decision = "Yes"
    else: 
        decision = "No"

    results.append({"Lung Cancer": decision,"probability": str(probs[0])})
 
    return json({"data":results})

@app.post("/index/test/suicide")
def callSuicideModel(request):
    content = request.json

    cleaned_text=[]
    for str in content :
        str=str.lower()
        str=nfx.remove_emails(str)
        str=nfx.remove_urls(str)
        str=nfx.remove_special_characters(str)
        str=nfx.remove_stopwords(str)
        cleaned_text.append(str)

    tokenizer=Tokenizer()
    tokenizer.fit_on_texts(cleaned_text)
    test_text_seq= tokenizer.texts_to_sequences(cleaned_text)
    test_text_pad= pad_sequences(test_text_seq,maxlen=100)
    predict_dataset = tf.convert_to_tensor(test_text_pad, dtype =float)
    predictions = suicide_model(predict_dataset, training=False)
    
    probs = predictions.numpy()[0]

    return json({"probability": f'{probs[0]}'})

@app.post("/index/test/heart")
def callHeartModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content, dtype=tf.float32)
    predictions = heart_model(predict_dataset, training=False)
    probs = predictions.numpy()[0]

    results = []

    if probs[0] > 0.5: 
        decision = "Yes"
    else: 
        decision = "No"

    results.append({"Heart Disease": decision,"probability": str(probs[0])})
 
    return json({"data":results})

@app.post("/index/test/diabetes")
def callDiabetesModel(request):
    content = request.json
    print (content)
    
    predict_dataset = tf.convert_to_tensor(content,dtype=tf.float32)
    predictions = diabetes_model(predict_dataset, training=False)
    
    predictions = np.round(predictions.numpy()[0],2)
    predictions = str(predictions[0]*100)

    print("predictions",predictions, type(predictions))

    return json({"data": predictions})
    
@app.post("/index/test/stroke")
def callStrokeModel(request):
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
    app.run(host="0.0.0.0", port=8000,  single_process=True)