import { getColonyForGovernor, fetchColonyInventory } from "./Governor.js";
import { updateMineralsList, fetchAllMinerals } from "./Minerals.js";

/*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
*/

// State object to track the selected governor, facility, and mineral
export const state = {
    selectedGovernor: null,
    selectedFacility: null,
    selectedMineral: null,
};

// Function to update the purchased-items element
export async function refreshPurchasedItems(governorId) {
    if (!governorId) {
      console.warn("No governor selected"); 
      document.getElementById("purchased-items").innerHTML = "<li>No governor selected.</li>";
      return;
    }
  
    try {
      const colony = await getColonyForGovernor(governorId); // Fetch the colony associated with the governor
  
      if (!colony) {
        document.getElementById("purchased-items").innerHTML = "<li>No colony associated with this governor.</li>";
        return;
      }
  
      // Fetch the colony's inventory
      const inventory = await fetchColonyInventory(colony.id);
  
      // Fetch all minerals for name lookup
      const minerals = await fetchAllMinerals();
  
      // Clear the existing purchased items
      const purchasedItemsElement = document.getElementById("purchased-items");
      purchasedItemsElement.innerHTML = "";
  
      if (inventory && inventory.length > 0) {
        inventory.forEach(item => {
          // Find the mineral name associated with the inventory item
          const mineral = minerals.find(mineral => item.mineralId === mineral.id);
  
          if (mineral) {
            const listItem = document.createElement("li");
            listItem.textContent = `Mineral: ${mineral.name}, Quantity: ${item.quantity}`; // Display mineral name and quantity
            purchasedItemsElement.appendChild(listItem); // Add the item to the list
          }
        });
      } else {
        purchasedItemsElement.innerHTML = "<li>No items in inventory.</li>"; // Show a message if inventory is empty
      }
    } catch (error) {
      console.error("Error fetching or displaying purchased items:", error); 
      document.getElementById("purchased-items").innerHTML = "<li>Error loading purchased items.</li>";
    }
  }

export const purchaseMineral = async () => {
    const purchasedItemsList = document.getElementById("purchased-items");
    purchasedItemsList.innerHTML = ''; // Clear the current purchased items list

    try {
        const { selectedGovernor, selectedFacility, selectedMineral } = state;

        // Fetch governor data to get colonyId
        const governor = await fetch(`http://localhost:8088/governors/${selectedGovernor}`).then((res) => res.json());
        if (!governor?.colonyId) throw new Error("Governor not linked to a colony.");

        const colonyId = governor.colonyId;

        // Fetch colony data
        const colony = await fetch(`http://localhost:8088/colonies/${colonyId}`).then((res) => res.json());
        if (!colony) throw new Error("Colony data not found.");

        // Update inventory
        const existingItem = colony.inventory.find((item) => item.mineralId === selectedMineral);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            colony.inventory.push({ mineralId: selectedMineral, quantity: 1 });
        }

        // Update colony inventory
        await fetch(`http://localhost:8088/colonies/${colonyId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(colony),
        });

        // Fetch mineral data
        const mineral = await fetch(`http://localhost:8088/minerals/${selectedMineral}`).then((res) => res.json());
        if (mineral.quantity <= 0) throw new Error("Mineral is out of stock.");

        // Decrease mineral quantity in the facility
        await fetch(`http://localhost:8088/minerals/${selectedMineral}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...mineral, quantity: mineral.quantity - 1 }),
        });

        // Update UI and state
        // await refreshPurchasedItems(selectedGovernor);
        // await updateMineralsList(selectedFacility);
        // document.dispatchEvent(new CustomEvent("stateChanged"));
        const purchaseEvent = new CustomEvent('purchaseEvent', { detail: { selectedFacility, selectedGovernor } });
        document.dispatchEvent(purchaseEvent);

        console.log("Mineral purchased successfully!");
    } catch (error) {
        console.error("Error during purchase:", error.message || error);
    }
};


