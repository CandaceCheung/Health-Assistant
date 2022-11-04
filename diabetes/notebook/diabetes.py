import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import numpy as np
import pandas as pd

df = pd.read_csv('../../dataset/diabetes.csv')

X = df.drop('Outcome', axis=1)
y = df['Outcome']

X_train,X_test,y_train,y_test = train_test_split(X,y, random_state=np.random.randint(10))

from keras.models import Sequential
from keras.layers import Dense, Dropout

model = Sequential()

model.add(Dense(12, input_dim=8, activation='relu'))
model.add(Dense(8, activation='relu'))
model.add(Dropout(.2))
model.add(Dense(4, activation='relu'))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss="mse", optimizer="adam", metrics=['accuracy'])

model.fit(X_train, y_train, epochs = 2600, batch_size=15, validation_data=(X_test, y_test))

model.predict(np.array([0, 180, 90, 26, 90, 36.5, 0.314, 35]).reshape((1,8)))

model.evaluate(X_test, y_test)

model.save('./model',overwrite=True)

