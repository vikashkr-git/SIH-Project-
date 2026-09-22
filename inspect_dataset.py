import pandas as pd
import numpy as np

df = pd.read_csv('Food_Packaging_Dataset_5000.csv')
print(f"Dataset shape: {df.shape}")
print("\nColumns and Dtypes:")
print(df.dtypes)

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicates:", df.duplicated().sum())

print("\nSummary statistics of numerical columns:")
print(df.describe().T[['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']])

print("\nUnique Commodities count:", df['Commodity'].nunique())
print("Commodities sample:", df['Commodity'].unique()[:10])

print("\nCategories distribution:")
print(df['Category'].value_counts())

print("\nRecommended_Packaging distribution:")
print(df['Recommended_Packaging'].value_counts())

print("\nOTR_Class distribution:")
print(df['OTR_Class'].value_counts())

print("\nWVTR_Class distribution:")
print(df['WVTR_Class'].value_counts())

print("\nMAP_Suitable distribution:")
print(df['MAP_Suitable'].value_counts())

# Check for scientific inconsistencies / outliers
# e.g. Moisture > 100%, negative values, pH out of 0-14 range
print("\n--- Outlier & Validity Checks ---")
invalid_moisture = df[df['Moisture_pct'] > 100]
print(f"Moisture > 100%: {len(invalid_moisture)} rows")
if len(invalid_moisture) > 0:
    print(invalid_moisture[['Food_ID', 'Commodity', 'Moisture_pct']].head())

invalid_ph = df[(df['pH'] < 1) | (df['pH'] > 14)]
print(f"pH out of range (1-14): {len(invalid_ph)} rows")

negative_fat = df[df['Fat_pct'] < 0]
print(f"Negative fat: {len(negative_fat)} rows")
