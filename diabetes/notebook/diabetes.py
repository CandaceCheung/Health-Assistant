import pandas as pd
import matplotlib.pyplot as plt
from tensorflow import keras
from sklearn.model_selection import train_test_split
from keras.models import Sequential
from keras.layers import Dense

df = pd.read_csv('../dataset/diabetes2.csv')

df_positive = df[ df['Diabetes_binary'] == 1 ] 
df_negative = df[ df['Diabetes_binary'] == 0 ]
df_negative_cut = df_negative.sample(n = 40000)
dataset = pd.concat([df_positive, df_negative_cut])


X = dataset.drop(['Diabetes_binary','Education','NoDocbcCost','Income','Education','DiffWalk','AnyHealthcare'], axis=1)
y = dataset['Diabetes_binary']

X_train,X_test,y_train,y_test = train_test_split(X,y, test_size=0.2, random_state=10)


model = Sequential()

model.add(Dense(19, input_shape=(16,), activation='relu'))
model.add(Dense(11, activation='relu'))
# model.add(Dropout(0.2))
model.add(Dense(1, activation='sigmoid'))

model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

result = model.fit(X_train, y_train, epochs = 8, batch_size=10, validation_data=(X_test, y_test))


model.evaluate(X_test, y_test)

model.save('./model',overwrite=True)