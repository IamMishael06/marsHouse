## MarHouse – House Rent Prediction in Naira
📌 Overview

MarHouse is a machine learning project that predicts the annual rent of houses in Nigeria (in Naira) based on various features like location, property type, and amenities.
The project includes:

* Data collection from a real estate site using a custom scraper (via ScraperAPI).

* Data cleaning & feature engineering to turn messy, unstructured housing listings into meaningful data.

* Model training using `RandomForestRegressor` for accurate predictions.

* Deployment-ready backend with FastAPI.

* Containerize with Docker and deploy.

### ⚙️ Tech Stack

* Python – Core language

* Pandas / NumPy – Data manipulation

* Scikit-learn – Machine learning model and preprocessing

* ScraperAPI – Data scraping

* Joblib – Model saving/loading

* Django – Web framework for deployment

### 📊Features & Input Variables

| Feature                | Description                                |
| ---------------------- | ------------------------------------------ |
| Bedrooms               | Number of bedrooms                         |
| Bathrooms              | Number of bathrooms                        |
| Toilets                | Number of toilets                          |
| Parking lot            | Available parking spaces                   |
| Extras                 | Additional features count                  |
| Serviced               | Whether the house is serviced (1/0)        |
| Stable Electricity     | Whether electricity supply is stable (1/0) |
| State                  | State where the property is located        |
| Town                   | Town where the property is located         |
| Title (Apartment Type) | e.g., Duplex, Bungalow, Flat               |


### 🧠 Model Details

Algorithm: RandomForestRegressor

Encoding:

* OneHotEncoder – For state and town

* TargetEncoder – For title (apartment type)

* Pipeline: Combined preprocessing and model in a single scikit-learn pipeline.

* Output: Predicted annual rent in Naira.

### 🚀 Usage

Clone Repository
```
git clone https://github.com/yourusername/marhouse.git
cd marhouse
```

install dependencies
```
pip install -r requirements.txt

```

```python
import pandas as pd
from joblib import load
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
        y_pred = np.trunc(np.expm1(y_pred))
    
    return f"The Annual estimatated price in Naira is N{y_pred[0]}" ```

data = {
    "bedroom" : [1],
    "parking_lot" : [0],
    "bathroom" : [1], 
    "toilets" : [1],
    "town" : ["Ojodu"],
    "state" : ["Ogun"],
    "serviced" : [0],
    "extras" : [1],
    "Stable Electricity" : [0],
    "title" : ["flat apartment"],
} # Change values to experiment
df = pd.DataFrame(data)
HousePrediction(df, "house_price_pipeline.joblib")

```
For the title town and states, these are the most notable values that can be used. using them gives the model a more accurate prediction as it is data it is familiar with
Title:
1. Flat apartment
2. Terraced Duplex
3. mini flat apartment
4. detached duplex
5. blocks of flats

Town:
1. Galadinmawa
2. Garki 1
3. Garki 2
4. Gwarinpa
5. Ibadan
6. Ibeju-Lekki
7. Ajah
8. Ikoyi
9. Ikeja
10. Ikorodu
11. Ojudu
12. Maryland
13. Victoria Island
14. Wuse 1
15. Wuse 2
16. Yaba
17. Victoria Island
18. Oshodi

States
1. Delta
2. Enugu
3. Kaduna
4. Lagos
5. Ogun
6. Oyo
7. Rivers
8. Abuja


### 📦 Deployment

* Initial release will run locally.
* Future releases will have a FastAPI powered web interface for easy input and prediction.
* There will be more feature egineering on existing model to improve model scores and prediction.


### 📖 Notes from the Developer

This project started as a challenge to push myself outside my comfort zone.
I didn’t take the easy path of using clean, ready-made datasets. Instead, I scraped my own data, which came in messy and unstructured.
Through determination and many iterations of cleaning, feature engineering, and testing, I managed to turn it into a dataset capable of powering accurate predictions.


📜 License

This project is licensed under the MIT License – You are free to use and modify it, but please credit the original author.

