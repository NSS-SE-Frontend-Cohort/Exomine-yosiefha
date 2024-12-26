import { fetchGovernors,updateGovernorSelect, fetchColonyInventory} from "./Governor.js";
import { fetchFacilities,updateFacilitySelect } from "./Facilities.js";
import { fetchMinerals, updateMineralsList } from "./Minerals.js";
import { updateSpaceCart } from "./Cart.js";
import { setGovernor,setFacility,setMineral , purchaseMineral } from "./TransientState.js";


// Populate governors on page load
fetchGovernors()
  .then(governors => {
    updateGovernorSelect(governors); // Populate dropdown
    governors.forEach(governor => {
      if (governor.colonyId) {
        fetchColonyInventory(governor.colonyId); // Fetch colony inventory
      } else {
        console.warn(`Governor ${governor.name} has no colony.`);
      }
    });
  })
  .catch(error => console.error("Error initializing governors:", error));


// Event listeners
document.getElementById("governor-select").addEventListener("change", async (event) => {
    const governorId = event.target.value;
    // Assuming there's a function to handle governor selection (not in this scope)
    document.getElementById("facility-select").disabled = false;
    fetchFacilities().then(facilities => updateFacilitySelect(facilities));
});

document.getElementById("facility-select").addEventListener("change", async (event) => {
    const facilityId = event.target.value;
    setFacility(facilityId); // Update transient state
    const minerals = await fetchMinerals(facilityId);
    updateMineralsList(minerals);
});

document.addEventListener("click", (event) => {
    if (event.target.id === "purchase-button") {
        purchaseMineral(); // Handle the purchase
        updateSpaceCart(); // Update UI
    }
});
