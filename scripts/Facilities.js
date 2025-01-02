// Function to fetch the list of active facilities
export const fetchFacilities = async () => {
    // Send a GET request to the API endpoint for facilities with active status
    const response = await fetch("http://localhost:8088/facilities?status=active");
    
    // Parse and return the JSON response from the server
    return await response.json();
};

// Function to update the facility selection dropdown in the UI
export const updateFacilitySelect = (facilities) => {
    // Get the HTML <select> element for facilities
    const facilitySelect = document.getElementById("facility-select");

    // Clear any existing options and set a default placeholder option
    facilitySelect.innerHTML = "<option value=''>--Select Facility--</option>";

    // Iterate through the list of facilities
    facilities.forEach(facility => {
        // Create a new <option> element for each facility
        const option = document.createElement("option");
        
        // Set the value and display text of the option
        option.value = facility.id; // Use facility ID as the value
        option.textContent = facility.name; // Display facility name as the label

        // Add the option to the facility dropdown
        facilitySelect.appendChild(option);
    });
};
