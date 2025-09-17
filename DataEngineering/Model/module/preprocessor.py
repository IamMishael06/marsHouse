import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin

class RestoreColumnNames(BaseEstimator, TransformerMixin):
    """
    A transformer to restore DataFrame column names after transformations.
    """
    def __init__(self, transformer, original_columns):
        self.transformer = transformer
        self.original_columns = original_columns

    def fit(self, X, y=None):
        self.transformer.fit(X, y)
        return self

    def transform(self, X):
        transformed_array = self.transformer.transform(X)
        return pd.DataFrame(transformed_array, columns=self.original_columns)


class FeatureEngineering(BaseEstimator, TransformerMixin):
    def fit(self, X,y=None):
        return self

    def transform(self, X):
        X = X.copy()
        X["house_lux_combo"] = (X.bedroom + X.bathroom + X.toilets) * (1 + X["Stable Electricity"] * 2)

        X["extras_bucket"] = pd.cut(
            X["extras"], 
            bins=[-1, 2, 4, 6, 16], 
            labels=["low", "medium", "high", "very_high"]
        )
        X = pd.get_dummies(X, columns=["extras_bucket"], dtype=int)

        X["parking_ratio"] = X["parking_lot"] / (X["bedroom"] + 1)
        X["Visitors toilet"] = X["toilets"] - X["bathroom"]
        X["is_self_contain"] = (X["bedroom"] == 1).astype(int)
        X["luxury_scores"] = X["extras"] + X["serviced"] + X["Stable Electricity"] + X["parking_lot"]
        X["is_lagos"] = (X.get("state_Lagos", 0) == 1).astype(int)

        X.loc[
            (X["parking_lot"] == 1) | (X["serviced"] == 1),
            "extras"
        ] = X["extras"].clip(lower=1)

        X["top_tier_houses"] = (
            ((X["bedroom"] > 4) | (X["bathroom"] > 4)) &
            (X["extras"] > 5) &
            (X["house_lux_combo"] > 10) &
            ((X["is_lagos"] == 1) | (X.get("town_Ikoyi", 0) == 1) | (X.get("town_Victoria_Island", 0)== 1) )
        ).astype(int)

        return X
