import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
import numpy as np
import pandas as pd

df = pd.read_csv('../../dataset/healthcare-dataset-stroke-data.csv')

dataset.replace( {'Male': 0,'Female':1, 'No': 0, 'Yes': 1, 'Private': 0, 'Self-employed': 1, 'Govt_job': 2, 'children': 3, 'Never_worked': 4 }, inplace=True)
dataset.replace( {'Urban': 0, 'Rural': 1, 'formerly smoked': 1, 'never smoked': 0, 'smokes': 2, 'Unknown': 4 }, inplace=True)
dataset.drop(['smoking_status','Residence_type','ever_married','work_type','hypertension','heart_disease','avg_glucose_level'], axis=1,inplace=True)
dataset.dropna(inplace=True)

features_names = ['gender','age','bmi' ]
target_names = 'stroke'

target = dataset[target_names]
feature = dataset[features_names]

print(target.shape)
print(feature.shape)

X_train, X_test, y_train, y_test = train_test_split(
    feature,target,
    test_size=0.2,
    random_state=np.random.randint(10))


inputs = keras.Input(shape=(3,))
h1 = keras.layers.Dense(10,activation=tf.nn.sigmoid)(inputs)
h2 = keras.layers.Dense(3,activation=tf.nn.sigmoid)(h1)
outputs = keras.layers.Dense(2)(h2)
model = keras.Model(inputs=inputs, outputs=outputs, name="stroke_model")

model.summary()




loss_object = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)




next_batch_dataset = next(iter(train_dataset))
features,labels = next_batch_dataset
predictions = model(features)

print(f"Prediction: {tf.argmax(predictions, axis=1)}")
print(f"    Labels: {labels}")




def loss(model, x, y, training):
  y_ = model(x, training=training)

  return loss_object(y_true=y, y_pred=y_)

l = loss(model, features, labels, training=False)
print(f"Loss test: {l}")





def grad(model, inputs, targets):
  with tf.GradientTape() as tape:
    loss_value = loss(model, inputs, targets, training=True)
  return loss_value, tape.gradient(loss_value, model.trainable_variables)

optimizer = tf.keras.optimizers.SGD(learning_rate=0.01)




loss_value, grads = grad(model, features, labels)

print(f"Step: {optimizer.iterations.numpy()}, Initial Loss: {loss_value.numpy()}")

optimizer.apply_gradients(zip(grads, model.trainable_variables))
print(f"Step: {optimizer.iterations.numpy()}, Loss: {loss(model, features, labels, training=True).numpy()}")





train_loss_results = []
train_accuracy_results = []

num_epochs = 10

for epoch in range(num_epochs):
    epoch_loss_avg = tf.keras.metrics.Mean()
    epoch_accuracy = tf.keras.metrics.SparseCategoricalAccuracy()

    for x, y in train_dataset:
        loss_value, grads = grad(model, x, y)
        optimizer.apply_gradients(zip(grads, model.trainable_variables))

        # Track progress
        epoch_loss_avg.update_state(loss_value)  
        epoch_accuracy.update_state(y, model(x, training=True))

    train_loss_results.append(epoch_loss_avg.result())
    train_accuracy_results.append(epoch_accuracy.result())


    print(f"Epoch {epoch:03d}: Loss: {epoch_loss_avg.result():.3f}, Accuracy: {epoch_accuracy.result():.3%}")




fig, axes = plt.subplots(2, sharex=True, figsize=(12, 8))
fig.suptitle('Training Metrics')

axes[0].set_ylabel("Loss", fontsize=14)
axes[0].plot(train_loss_results)

axes[1].set_ylabel("Accuracy", fontsize=14)
axes[1].set_xlabel("Epoch", fontsize=14)
axes[1].plot(train_accuracy_results)
plt.show()




test_accuracy = tf.keras.metrics.Accuracy()

for (x, y) in test_dataset:
  logits = model(x, training=False)
  prediction = tf.argmax(logits, axis=1, output_type=tf.int32)
  test_accuracy(prediction, y)

print(f"Test set accuracy: {test_accuracy.result():.3%}")



model.save('./model',overwrite=True)

# from keras.models import Sequential
# from keras.layers import Dense, Dropout

# model = Sequential()

# model.add(Dense(12, input_dim=8, activation='relu'))
# model.add(Dense(8, activation='relu'))
# model.add(Dropout(.2))
# model.add(Dense(4, activation='relu'))
# model.add(Dense(1, activation='sigmoid'))

# model.compile(loss="mse", optimizer="adam", metrics=['accuracy'])

# model.fit(X_train, y_train, epochs = 2600, batch_size=15, validation_data=(X_test, y_test))

# model.predict(np.array([0, 180, 90, 26, 90, 36.5, 0.314, 35]).reshape((1,8)))

# model.evaluate(X_test, y_test)



