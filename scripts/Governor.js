import { state} from "./TransientState.js";



export async function fetchColonyInventory(colonyId) {
  try {
    const response = await fetch('http://localhost:8088/colonies');
    if (!response.ok) {
      throw new Error('Failed to fetch colonies');
    }

    const colonies = await response.json();
    const matchingColony = colonies.find(colony => String(colony.id) === String(colonyId)); // Match colony by ID

    if (!matchingColony) {
      displayMessage(`No colony found with ID ${colonyId}`, "error");
      return []; // Return empty array if no colony matches
    }

    if (!matchingColony.inventory || matchingColony.inventory.length === 0) {
      displayMessage(`Colony with ID ${colonyId} has no inventory.`, "warning");
      return []; // Return empty array if the inventory is empty
    }

    return matchingColony.inventory; // Return the inventory directly
  } catch (error) {
    displayMessage('Error fetching colonies.', "error");
    return [];
  }
}

// Function to fetch the list of governors
export const fetchGovernors = async () => {
  try {
    const response = await fetch("http://localhost:8088/governors?status=active");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const governors = await response.json();

    if (!Array.isArray(governors) || governors.length === 0) {
      displayMessage('No governors found.', "warning");
      return [];
    }

    return governors; // Return the list of governors
  } catch (error) {
    displayMessage('Error fetching governors.', "error");
    return [];
  }
};

// Function to update the governor dropdown
export const updateGovernorSelect = (governors) => {
  const governorSelect = document.getElementById("governor-select");
  if (!governors || !Array.isArray(governors)) {
    displayMessage('Invalid governors data.', "error");
    return;
  }

  governors.forEach(governor => {
    const option = document.createElement("option");
    option.value = governor.id;
    option.textContent = governor.name;
    governorSelect.appendChild(option);
  });
};

// Function to fetch the colony associated with a governor
export const getColonyForGovernor = async (governorId) => {
  try {
    const governors = await fetchGovernors();
    const governor = governors.find(gov => gov.id === governorId);

    if (!governor) {
      displayMessage("Governor not found.", "error");
      return null;
    }

    const colonyResponse = await fetch("http://localhost:8088/colonies");
    const colonies = await colonyResponse.json();
    const colony = colonies.find(col => col.id === String(governor.colonyId));

    if (!colony) {
      displayMessage("Colony not found.", "error");
      return null;
    }

    return colony;
  } catch (error) {
    displayMessage("Error fetching colony for governor.", "error");
    return null;
  }
};

// Function to update the purchased items UI for a governor
export const updatePurchasedItems = async (governorId) => {
  try {
    // Get the colony name and ID associated with the governor
    const colonyName = await getColonyForGovernor(governorId);
    if (!colonyName) {
      displayMessage("Colony not found for the governor.", "error");
      return;
    }

    // Fetch the governor's colony inventory
    const governors = await fetchGovernors();
    const selectedGovernor = governors.find(gov => gov.id === governorId);

    if (!selectedGovernor) {
      displayMessage("Governor not found.", "error");
      return;
    }

    const colonyResponse = await fetchColonyInventory(selectedGovernor.colonyId);

    if (!colonyResponse || colonyResponse.length === 0) {
      displayMessage("Colony inventory not found or empty.", "warning");
      return;
    }

    const colonyInventory = colonyResponse[0].inventory; // Access inventory of the matched colony

    // Update the purchased-items element
    const purchasedItemsElement = document.getElementById("purchased-items");
    purchasedItemsElement.innerHTML = ""; // Clear existing items

    if (colonyInventory && colonyInventory.length > 0) {
      // Create a header to display the colony name
      const colonyHeader = document.createElement("h3");
      colonyHeader.textContent = `Purchased Items for Colony: ${colonyName}`;
      purchasedItemsElement.appendChild(colonyHeader);

      // List each purchased item
      const purchaseList = document.createElement("ul");
      colonyInventory.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = `Mineral ID: ${item.mineralId}, Quantity: ${item.quantity}`;
        purchaseList.appendChild(listItem);
      });

      purchasedItemsElement.appendChild(purchaseList);
    } else {
      // Show a message if no purchases exist
      purchasedItemsElement.innerHTML = "<p>No purchases yet.</p>";
    }
  } catch (error) {
    displayMessage("Error updating purchased items.", "error");
  }
};

// Utility function to display messages in the UI
function displayMessage(message, type) {
  const messageContainer = document.getElementById("message-container"); // Assuming there's an element for messages
  const messageElement = document.createElement("div");
  messageElement.textContent = message;

  // Assign a class based on the message type
  messageElement.className = type === "error" ? "error-message" :
                             type === "warning" ? "warning-message" :
                             "info-message";

  // Append the message and auto-remove it after 5 seconds
  messageContainer.appendChild(messageElement);
  setTimeout(() => messageContainer.removeChild(messageElement), 5000);
}

// Sets the selected governor and updates the colony heading
export const setGovernor = async (governorId) => {
  state.selectedGovernor = governorId; // Update the state with the selected governor
  const colony = await getColonyForGovernor(governorId); // Fetch the colony associated with the governor
  const colonyHeading = document.getElementById('colony'); 
  colonyHeading.textContent = `Colony: ${colony.name}`; // Update the UI with the colony name

  // Dispatch a custom event to signal state change
  document.dispatchEvent(new CustomEvent("stateChanged"));
};
