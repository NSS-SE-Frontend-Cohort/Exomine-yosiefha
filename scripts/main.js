import { fetchGovernors, updateGovernorSelect,setGovernor} from "./Governor.js";
import { fetchFacilities, updateFacilitySelect , setFacility} from "./Facilities.js";
import { fetchMinerals, updateMineralsList ,setMineral} from "./Minerals.js";
import { purchaseMineral,refreshPurchasedItems,state} from "./TransientState.js";


// Fetch governors and populate the dropdown
fetchGovernors()
  .then(governors => {
    updateGovernorSelect(governors); // Populate the governor dropdown with data
  })
  .catch(error => console.error("Error initializing governors:", error)); // Handle any errors during fetching governors


// Event listener for governor selection
document.getElementById("governor-select").addEventListener("change", async (event) => {
  const governorId = event.target.value; // Get the selected governor ID
  setGovernor(governorId); // Set the selected governor in the state
  refreshPurchasedItems(governorId); // Refresh the purchased items for the selected governor
  document.getElementById("facility-select").disabled = false; // Enable the facility dropdown
  fetchFacilities().then(facilities => updateFacilitySelect(facilities)); // Populate the facility dropdown
});

// Event listener for facility selection
document.getElementById("facility-select").addEventListener("change", async (event) => {
  const facilityId = event.target.value;
  const facilityName = event.target.options[event.target.selectedIndex].text; // Extract the facility name
  setFacility(facilityId, facilityName); // Update the state with selected facility
  const minerals = await fetchMinerals(facilityId); // Fetch minerals for the selected facility
  updateMineralsList(minerals); // Update the minerals list in the UI
});

// Event listener for mineral selection
document.getElementById("minerals-list").addEventListener("change", (event) => {
  if (event.target.name === "mineral") {
    setMineral(event.target.value); // Update the selected mineral in the state
    document.getElementById("purchase-button").disabled = false; // Enable the purchase button
  }
});

// Listener for the purchase button click event
document.addEventListener("click", async (event) => {
  if (event.target.id === "purchase-button") {
    await purchaseMineral(); // Handle the purchase action

    // Dispatch a custom event to notify the rest of the application
    const purchaseEvent = new CustomEvent("purchaseCompleted", {
      detail: {
        selectedGovernor: document.getElementById("governor-select").value,
        selectedFacility: state.selectedFacility,
      },
    });
    document.dispatchEvent(purchaseEvent);

    // Re-enable the purchase button for new selections
    document.getElementById("purchase-button").disabled = true;
  }
});

// Listener for the custom purchaseCompleted event
document.addEventListener("purchaseCompleted", async (event) => {
  const { selectedGovernor, selectedFacility } = event.detail;

  // Refresh the purchased items list
  if (selectedGovernor) {
    refreshPurchasedItems(selectedGovernor);
  }

  // Update the minerals list for the selected facility
  if (selectedFacility) {
    const minerals = await fetchMinerals(selectedFacility);
    updateMineralsList(minerals);
  }

  console.log("Purchase event handled and UI updated.");
});
