import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import pickle as pkl
from sklearn.metrics import classification_report

# Read the data
training = pd.read_csv('Training.csv')
testing = pd.read_csv('Testing.csv')
training.columns = training.columns.str.strip()

# Drop the 'Unnamed: 133' column
if 'Unnamed: 133' in training.columns:
    training = training.drop('Unnamed: 133', axis=1)

# Drop the 'Unnamed: 133' column
if 'Unnamed: 133' in testing.columns:    
    testing = testing.drop('Unnamed: 133', axis=1)   
training = training.reset_index(drop=True)
testing = testing.reset_index(drop=True)
# # Convert the medical specialty to numeric values

# Extract feature variable
x_feature = training.drop(columns=["prognosis"])

x_target = training["prognosis"]

y_feature = testing.drop(columns=["prognosis"])

y_target = testing["prognosis"]



logreg = LogisticRegression()
logreg.fit(x_feature, x_target)

# y_val_pred_logreg = logreg.predict(y_feature)
# accuracy_logreg = accuracy_score(y_target, y_val_pred_logreg)
# print("Accuracy:", accuracy_logreg)

with open("model.pkl", "wb") as f:
    pkl.dump(logreg, f)

with open("model.pkl", "rb") as f:
    model = pkl.load(f)

predictions = model.predict(y_feature)

accuracy = accuracy_score(y_target, predictions)

print("Accuracy:", accuracy)

report = classification_report(y_target, predictions)
print("Classification Report:")
print(report)