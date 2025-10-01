const notyf = new Notyf({
  duration: 2000,
  position : { x: "right", y: "top" },
  dismissable: true,
  types : [
    { type: 'error', background: 'indianred', icon: false  },
    {type: 'success', background: 'gold', icon: false  }
  ]
});
// town -> state mapping (keys MUST match your <option value="..."> exactly)
const townToState = {
  "Abule_Egba": "Lagos",
  "Ado_Odo/Ota": "Ogun",
  "Agege": "Lagos",
  "Ajah": "Lagos",
  "Akinyele": "Oyo",
  "Alimosho": "Lagos",
  "Amuwo_Odofin": "Lagos",
  "Apo": "Abuja",
  "Asaba": "Delta",
  "Asokoro": "Abuja",
  "Bariga": "Lagos",
  "Bwari": "Abuja",
  "Dakwo": "Abuja",
  "Dei-Dei": "Abuja",
  "Durumi": "Abuja",
  "Egbe/Idimu": "Lagos",
  "Ejigbo": "Lagos",
  "Enugu": "Enugu",
  "Galadinmawa": "Abuja",
  "Gaduwa": "Abuja",
  "Garki_1": "Abuja",
  "Garki_2": "Abuja",
  "Gbagada": "Lagos",
  "Guzape": "Abuja",
  "Gwarinpa": "Abuja",
  "Ibadan": "Oyo",
  "Ibadan_North": "Oyo",
  "Ibeju-Lekki": "Lagos",
  "Ido": "Abuja",           
  "Idu": "Abuja",
  "Ijebu": "Ogun",
  "Ikoyi": "Lagos",
  "Ikorodu": "Lagos",
  "Ikotun/Igando": "Lagos",
  "Ikeja": "Lagos",
  "Ilupeju": "Lagos",
  "Ipaja": "Lagos",
  "Isolo": "Lagos",
  "Jabi": "Abuja",
  "Jahi": "Abuja",
  "Kaduna_North": "Kaduna",
  "Kagarko": "Kaduna",
  "Kado": "Abuja",
  "Karmo": "Abuja",
  "Katampe_Ext": "Abuja",
  "Katampe_Main": "Abuja",
  "Kaura_(Games_Village)": "Abuja",
  "Ketu": "Lagos",
  "Kosofe/Ikosi": "Lagos",
  "Kubwa": "Abuja",
  "Lagos_Island": "Lagos",
  "Lekki": "Lagos",
  "Life_Camp": "Abuja",
  "Lokogoma": "Abuja",
  "Lugbe": "Abuja",
  "Mabushi": "Abuja",
  "Maitama": "Abuja",
  "Maryland": "Lagos",
  "Mpape": "Abuja",
  "Mushin": "Lagos",
  "Nbora": "Abuja",
  "Nyanya": "Abuja",
  "Obafemi_Owode": "Ogun",
  "Odo": "Ogun",             
  "Ogba": "Lagos",         
  "Ogba-Egbema-Ndoni": "Rivers",
  "Ogudu": "Lagos",
  "Ojo": "Lagos",
  "Ojodu": "Lagos",
  "Ojota": "Lagos",
  "Okota": "Lagos",
  "Oluyole": "Oyo",
  "Oshimili": "Delta",
  "Oshodi": "Lagos",
  "Shomolu": "Lagos",
  "Surulere": "Lagos",
  "Sangotedo": "Lagos",
  "Utako": "Abuja",
  "Victoria_Island": "Lagos",
  "Wumba": "Abuja",
  "Wuse_1": "Abuja",
  "Wuse_2": "Abuja",
  "Wuye": "Abuja",
  "Yaba": "Lagos"
};
//========================== SENDING DATA TO FASTAPI BACKEND
function submitForm(event) {
  event.preventDefault();
  localStorage.clear();

  //==========================  Defining Eelements
  var inputs = document.querySelectorAll("input");
  var selects = document.querySelectorAll("select");

  // Instaintiating data dictionary
  let data = {};

  //==========================  Getting input values
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value !== "") {
      // Check if input is not empty
      if (inputs[i].type === "radio" && inputs[i].checked) {
        data[inputs[i].name] = Number(inputs[i].value);
        continue;
      }
      if (inputs[i].type === "checkbox") {
        data[inputs[i].name] = Number(inputs[i].checked ? 1 : 0);
        continue;
      }
      data[inputs[i].name] = inputs[i].value;
    } else {
      data[inputs[i].name] = null;
      notyf.error(`${inputs[i].name} cannot be empty`);
      return;
    }
    //==========================  Error handling for negative numbers
    if (
      ["bedroom", "bathroom", "toilets", "extras"].includes(inputs[i].name) &&
      (Number(data[inputs[i].name]) < 0 || Number(data[inputs[i].name]) === 0)
    ) {
      notyf.error(`${inputs[i].name} cannot be negative or zero`);
      return;
    }
  }
  //==========================  Getting select values
  for (let i = 0; i < selects.length; i++) {
    if (selects[i].value !== "") {
      data[selects[i].name] = selects[i].value;
    } else {
      data[selects[i].name] = null;
      notyf.error(`${selects[i].name} cannot be null`);
      return;
    }
  }

  //==========================  Convert numeric fields
  data["bedroom"] = Number(data["bedroom"]);
  data["bathroom"] = Number(data["bathroom"]);
  data["toilets"] = Number(data["toilets"]);
  data["parking_lot"] = Number(data["parking_lot"]);
  data["extras"] = Number(data["extras"]);

  //==========================  Saving some values to local storage to use in price.html
  localStorage.setItem("bedroom", data["bedroom"]);
  localStorage.setItem("town", data["town"]);

  console.log(data);

  // ==========================  Logic consistency checks
  if (data["bathroom"] > data["bedroom"]) {
    notyf.error("Number of Bathrooms cannot be more than number of Bedrooms!");
    return;
  }
  if (data["bathroom"] > data["toilets"]) {
    notyf.error("Number of Bathrooms cannot be more than number of Toilets");
    return;
  }
  if (data["bedroom"] == 1 && (data["bathroom"] > 1 || data["toilets"] > 1)) {
    notyf.error(
      "For 1 Bedroom, number of Bathrooms and Toilets cannot be more than 1"
    );
    return;
  }
  if (data["title"].includes("self") && (data["bedroom"] || data["bathroom"] > 1 || data["toilets"])) {
    notyf.error("Self contain apartment should have 1 bedroom and bathroom")
    return;
  }
  // tOWN AND STATE LOGIC



  //==========================  Show loader
  showLoader();
  //==========================  Send to FastAPI
  axios
    .post("/predict", data)
    .then((response) => {
      window.location.assign("price.html");
      console.log(response.data);
      var price = Number(response.data.predicted_price);

      localStorage.setItem("predicted_price", price.toLocaleString());
    })
    .catch((error) => {
      console.log(error.response?.data || error.error);
      notyf.error(
        "An error occurred while processing your request. Please try again."
      );
      //==========================  Hide loader
      hideLoader();
    });
}

//==========================  Displaying price on price.html
var priceDisplay = document.getElementById("price");
var estimationInfo = document.getElementById("estimation_info");

priceDisplay.innerHTML = localStorage.getItem("predicted_price");
estimationInfo.innerHTML = `Your Estimated Annual Cost of ${localStorage.getItem(
  "bedroom"
)} Bedroom(s) in ${localStorage.getItem("town")} is:`;

//==========================  Function to show loader
function showLoader() {
  var loader = document.getElementById("loading");
  loader.style.display = "flex";
}
function hideLoader() {
  var loader = document.getElementById("loading");
  loader.style.display = "none";
}



// call this on town change
function handleTownChange(selectedTownValue) {
  const stateSelect = document.getElementById("state");
  const stateOptions = Array.from(stateSelect.options);

  // If no town selected => re-enable all states and reset
  if (!selectedTownValue) {
    stateOptions.forEach(opt => { opt.disabled = false; });
    stateSelect.value = ""; // reset selection
    return;
  }

  // Look up correct state (mapping must use exact option values)
  const correctState = townToState[selectedTownValue];

  if (!correctState) {
    console.warn("No mapping found for town:", selectedTownValue);
    // fallback: do nothing (or re-enable all)
    stateOptions.forEach(opt => { opt.disabled = false; });
    return;
  }

  // Disable all states except the correct one
  stateOptions.forEach(opt => {
    if (opt.value === "") return; // keep placeholder enabled
    opt.disabled = (opt.value !== correctState);
  });

  // Auto-select the matched state so user sees what's allowed
  stateSelect.value = correctState;

}
