// Pass the address string to the api/parse API endpoint
const parseAddress = async (address) => {
   // This function triggers an eslint Parsing error: The keyword 'const' is reserved,
   // which I was unable to resolve in a satisfactory manner
   const url = "api/parse/?address=" + address
   try {
      const response = await fetch(url, {
         method: "GET"
      });
      // Check that the response is valid
      if (!response.ok) {
         throw new Error(`Response status: ${response.status}`);
      } else {
         const data = await response.json();
         // Check for input string API errors
         if (data.Error) {
            displayError(data.Error);
         } else if (data.ParseError) {
            displayError(data.ParseError);
         } else if (data.RepeatedLabelError) {
            displayError(data.RepeatedLabelError);
         // Otherwise display the address parse results
         } else {
            displayAddress(data);
         }
         displayAddress(data);
      } 
   // Catch any error messages -- 500 statusq
   } catch (error) {
      displayError(error.message);
   }
};

// Display the address response to the DOM
const displayAddress = (addressData) => {
   // Clear input value
   document.getElementById("address").value = "";
   // Remove error if applicable
   document.getElementById("error-container").style.display = "None";
   const addressResults = document.getElementById("address-results");
   // Show results table
   addressResults.style.display = "block";
   // Display address type
   document.getElementById("parse-type").innerText = addressData.address_type;
   // Loop through address_components and add new rows to results table
   const tableBody = document.getElementsByTagName('tbody')[0];
   // Clear previous search results
   while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.lastChild);
   }
   for (let [tag, part] of Object.entries(addressData.address_components)) {
      let resultsRow = document.createElement("tr");
      let partData = document.createElement("td");
      let tagData = document.createElement("td");
      partData.innerText = part;
      tagData.innerText = tag;      
      resultsRow.appendChild(partData);
      resultsRow.appendChild(tagData);
      tableBody.appendChild(resultsRow);
   }
}

// Display any errors to the user
const displayError = (error) => {
   // Clear address results if applicable
   document.getElementById("address-results").style.display = "None";
   const errorContainer = document.getElementById("error-container");
   const errorText = document.getElementById("error-message");
   errorContainer.style.display = "flex";
   console.log(error);
   if (error === "Response status: 500") {
      errorText.textContent = "Unable to parse this value due to repeated labels. Our team has been notified of the error.";
   } else {
      errorText.textContent = error;
   }
}

// Handle form submission
const addressForm = document.getElementsByTagName("form")[0];
console.log(addressForm);
addressForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const addressData = new FormData(e.target).get("address");
   // Check for blank string or string of whitespace
   if (addressData && addressData.trim()) {
      parseAddress(addressData);
   }
})

// Handle close error message event
const errorContainer = document.getElementById("error-container");
const errorCloseButton = document.getElementById("close-button");
errorCloseButton.addEventListener("mousedown", () => {
   document.getElementById("address").value = "";
   errorContainer.style.display = "None";
})