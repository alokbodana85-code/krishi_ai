import pandas as pd

DATA_PATH = "data/crop_recommendation.csv"

df = pd.read_csv(DATA_PATH)

print("Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

print("\nMissing values:")
print(df.isna().sum())

print("\nDuplicate rows:", df.duplicated().sum())

print("\nCrop counts:")
print(df["label"].value_counts())

print("\nStatistics:")
print(df.describe())

