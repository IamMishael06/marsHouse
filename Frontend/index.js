// SENDING DATA TO FASTAPI BACKEND
function submitForm(event) {
event.preventDefault();
localStorage.clear();

// Defining Eelements
var inputs = document.querySelectorAll('input');
var selects = document.querySelectorAll('select');

// Instaintiating data dictionary
let data = {}

// Getting input values
for (let i = 0; i < inputs.length;i++) {
    if (inputs[i].value !== '') { // Check if input is not empty
        if (inputs[i].type === 'radio' && inputs[i].checked) {
            data[inputs[i].name] = Number(inputs[i].value)
            continue
        }
        if (inputs[i].type === 'checkbox') {
            data[inputs[i].name] = Number(inputs[i].checked ? 1 : 0)
            continue
        }
        data[inputs[i].name] = inputs[i].value
    }else{
        data[inputs[i].name] = null
    }
    // Error handling for negative numbers
    if (['bedroom', 'bathroom', 'toilets', 'parking_lot', 'extras'].includes(inputs[i].name) && Number(data[inputs[i].name]) < 0) {
        alert(`${inputs[i].name} cannot be negative`);
        return;
    }
   
}
// Getting select values
for (let i = 0; i < selects.length;i++) {
    if (selects[i].value !== '') {
        data[selects[i].name] = selects[i].value
    }else{
        data[selects[i].name] = null
    }
   
}

// Convert numeric fields
data['bedroom'] = Number(data['bedroom']) 
data['bathroom'] = Number(data['bathroom']) 
data['toilets'] = Number(data['toilets'])
data['parking_lot'] = Number(data['parking_lot'])  
data["extras"] = Number(data["extras"]) 

// Saving some values to local storage to use in price.html
localStorage.setItem('bedroom', data['bedroom'])
localStorage.setItem('town', data['town'])

console.log(data)
// Show loader
showLoader();
// Send to FastAPI
axios.post("http://127.0.0.1:8000/predict", data)
.then((response)=> {
   
    window.location.assign('price.html')
    console.log(response.data)
    var price = Number(response.data.predicted_price)

    localStorage.setItem('predicted_price', price.toLocaleString());
   
  
})
.catch((error)=> {
    console.log(error.response?.data || error.message);
    alert("An error occurred while processing your request. Please try again.")
    // Hide loader
    hideLoader();
})


}

// Displaying price on price.html
var priceDisplay = document.getElementById('price');
var estimationInfo = document.getElementById('estimation_info');

priceDisplay.innerHTML = localStorage.getItem('predicted_price');
estimationInfo.innerHTML = `Your Estimated Annual Cost of ${localStorage.getItem('bedroom')} Bedroom(s) in ${localStorage.getItem('town')} is:`



// Function to show loader
function showLoader() {
    var loader = document.getElementById('loading');
    loader.style.display = 'flex'; 
 ;
}
function hideLoader() {
    var loader = document.getElementById('loading');
    loader.style.display = 'none'; 
}