from fastapi import FastAPI # Importing FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware # Importing CORS middleware to handle cross-origin requests
import numpy as np
import pandas as pd
from joblib import load # For loading the saved model pipeline
from pathlib import Path
import sys
import DataEngineering.Model.module as module # Importing the module where custom transformers are defined
import DataEngineering.Model.module.preprocessor as preprocessor # Importing the preprocessor module
from fastapi.staticfiles import StaticFiles # For serving static files

# Patch joblib imports
sys.modules["module"] = module # Patch the module
sys.modules["module.preprocessor"] = preprocessor # Patch the preprocessor module


app = FastAPI() # Creating FastAPI instance

MODEL_PATH = Path(__file__).resolve().parent.parent / "DataEngineering" / "Model" / "Joblib" / "house_price_pipeline.joblib"


app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:8000", "http://127.0.0.1:8000"],   # Adjust as necessary for your frontend's origin 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],   
)

class FormData(BaseModel):
    bedroom : int
    parking_lot : int
    bathroom : int
    toilets : int
    town : str
    state : str
    serviced : int
    extras : int
    Stable_Electricity: int = Field(..., alias="Stable Electricity")  
    title : str

def HousePrediction(df, filename, log_target=True):
    """
    Predict house prices from given dataframe using a saved pipeline.
    
    df : pandas DataFrame with same columns as training data.
    filename : Path to saved joblib pipeline.
    log_target : If True, model was trained on log1p target.
    """
    # Load pipeline (preprocessing + feature engineering + model)
    pipeline = load(filename)
    
    # Predict
    y_pred = pipeline.predict(df)
    
    # Unlog if model was trained on log values
    if log_target:
        y_pred = np.expm1(y_pred)
    
    return f"{y_pred[0]:.1f}"

@app.post("/predict")
def make_prediction(form_data: FormData):
    for data in form_data:
        if data is None or data == "":
            return {"error": "All fields are required."}
        if data in ["bedroom", "parking_lot", "bathroom", "toilets", "serviced", "extras", "Stable_Electricity"]:
            if not isinstance(data, int) or data < 0:
                return {"error": f"{data} must be a non-negative integer."}
            if data in ["bedroom", "bathroom", "toilets"] and data == 0:
                return {"error": f"{data} must be at least 1."}
            if data in ["bedroom", "bathroom", "toilets"] and data > 20:
                return {"error": f"{data} seems too high. Please enter a realistic number."}
            if data in ["bathroom"] > data in ["bedroom", "toilets"]:
                return {"error": "Number of bathrooms cannot exceed number of bedrooms or toilets."}
    # Turning the first letter in town to uppercase to match training data
    form_data.town  = form_data.town.capitalize()
    # Replacing ,,;,-,_ with whitespace to match training data
    form_data.town = form_data.town.replace(","," ").replace(";"," ").replace("_"," ")
    
    df = pd.DataFrame([form_data.dict(by_alias=True)]) # Convert form data to DataFrame
    
    # Making prediction
    predicted_price = HousePrediction(df, MODEL_PATH)
    # Here you would typically process the form_data and make a prediction
    return {"predicted_price": predicted_price} 


app.mount(
    "/", 
    StaticFiles(directory=Path(__file__).resolve().parent.parent / "Frontend", html=True), 
    name="Frontend"
)