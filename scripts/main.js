import { fetchGovernors, updateGovernorSelect} from "./Governor.js";
import { fetchFacilities, updateFacilitySelect } from "./Facilities.js";
import { fetchMinerals, updateMineralsList } from "./Minerals.js";
import { updateSpaceCart } from "./Cart.js";
import { setGovernor, setFacility, setMineral, purchaseMineral,refreshPurchasedItems,state} from "./TransientState.js";

// Fetch governors and populate the dropdown
fetchGovernors()
  .then(governors => {
    console.log("Governors data:", governors);
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

// Event listener for purchase button click
document.addEventListener("click", async (event) => {
  if (event.target.id === "purchase-button") {
    await purchaseMineral(); // Handle the purchase action
    updateSpaceCart(); // Update the space cart UI

    // Refresh purchased-items to reflect updated inventory
    const governorId = document.getElementById("governor-select").value; // Get the selected governor
    refreshPurchasedItems(governorId); // Update the purchased items list

    // Re-fetch and update minerals for the selected facility
    const facilityId = state.selectedFacility; // Retrieve selected facility from state
    const minerals = await fetchMinerals(facilityId); // Fetch updated minerals
    updateMineralsList(minerals); // Refresh minerals list UI

    // Re-enable the purchase button for new selections
    document.getElementById("purchase-button").disabled = true;
  }
});

