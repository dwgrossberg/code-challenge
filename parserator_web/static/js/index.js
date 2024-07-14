// Pass the address string to the api/parse API endpoint
const parseAddress = async (address) => {
   const url = "api/parse/?address=" + address
   const response = await fetch(url, {
      method: "GET"
   })
   .then((response) => response.json())
   .then((data) => {
      // Handle and display error messages if required
      if (data.error) {
         console.log(data.error)
         displayError(data.Error);
      } else if (data.ParseError) {
         displayError(data.ParseError);
      } else if (data.TypeError) {
         displayError(data.TypeError);
      // Otherwise display the address parse results
      } else {
         displayAddress(data);
      }
   });
}

const displayAddress = (addressData) => {
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
