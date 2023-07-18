import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.feature_selection import SelectFromModel
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import matplotlib.pyplot as plt

fraudulent = pd.read_csv('Fraud.csv')

X = fraudulent.drop(columns=["isFraud"])
X = X.drop(columns=["isFlaggedFraud"])
X = X.drop(columns=["step"])
X = X.drop(columns=["nameOrig"])
X = X.drop(columns=["nameDest"])
Y = fraudulent["isFraud"]

numeric_columns = X.select_dtypes(include=['number'])
Q1 = numeric_columns.quantile(0.25)
Q3 = numeric_columns.quantile(0.75)
IQR = Q3 - Q1

# IQR method Implementation
outliers = (numeric_columns < (Q1 - 1.5 * IQR)) | (numeric_columns > (Q3 + 1.5 * IQR))
outliers = outliers.any(axis=1)

# Remove outliers from the DataFrame
X_no_outliers = X[~outliers]
Y_no_outliers = Y[~outliers]

# Specify the name of the categorical column(s)
categorical_cols = ['type']  # Replace 'type' with the actual name of your categorical column

# Preprocess categorical column(s) using one-hot encoding
preprocessor = ColumnTransformer(
    transformers=[('encoder', OneHotEncoder(), categorical_cols)],
    remainder='passthrough'
)
X_preprocessed = preprocessor.fit_transform(X_no_outliers)

feature_selector = SelectFromModel(LogisticRegression(penalty="l1", C=0.01, solver="saga"))
X_selected = feature_selector.fit_transform(X_preprocessed, Y_no_outliers)

model = LogisticRegression()
model.fit(X_selected, Y_no_outliers)

predictions = model.predict(X_selected)

accuracy = accuracy_score(Y_no_outliers, predictions)

print("Accuracy:", accuracy)

