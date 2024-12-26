const state = {

}
export const setGovernor = (governorId) => {
    state.selectedGovernor = governorId;
    document.dispatchEvent(new CustomEvent("stateChanged"));
};

export const setFacility = (facilityId) => {
    state.selectedFacility = facilityId
    document.dispatchEvent(new CustomEvent("stateChanged"))
}
export const setMineral = (mineralId) => {
    state.selectedMineral = mineralId;
    document.dispatchEvent(new CustomEvent("stateChanged"));
};

export const purchaseMineral = async () => {

    /*
        Does the chosen governor's colony already own some of this mineral?
            - If yes, what should happen?
            - If no, what should happen?

        Defining the algorithm for this method is traditionally the hardest
        task for teams during this group project. It will determine when you
        should use the method of POST, and when you should use PUT.

        Only the foolhardy try to solve this problem with code.
    */
    try {
        const governorId = state.selectedGovernor;
        const facilityId = state.selectedFacility;
        const mineralId = state.selectedMineral;

        if (!governorId || !facilityId || !mineralId) {
            console.error("Governor, facility, or mineral not selected.");
            return;
        }

        // Fetch colony data for the chosen governor
        const colonyResponse = await fetch(`http://localhost:8088/colonies?governorId=${governorId}`);
        const colonies = await colonyResponse.json();

        if (colonies.length === 0) {
            console.error("No colony found for the selected governor.");
            return;
        }

        const colony = colonies[0]; // Assume one colony per governor for simplicity

        // Check if the mineral already exists in the colony inventory
        const inventoryItem = colony.inventory.find(item => item.mineralId === mineralId);

        if (inventoryItem) {
            // If yes, update the quantity using PUT
            const updatedInventory = colony.inventory.map(item =>
                item.mineralId === mineralId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            await fetch(`http://localhost:8088/colonies/${colony.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...colony, inventory: updatedInventory })
            });

            console.log(`Updated inventory for mineral ID ${mineralId} in colony ${colony.id}.`);
        } else {
            // If no, add a new mineral entry using POST
            colony.inventory.push({ mineralId, quantity: 1 });

            await fetch(`http://localhost:8088/colonies/${colony.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(colony)
            });

            console.log(`Added new mineral ID ${mineralId} to colony ${colony.id}.`);
        }

        // Decrement the quantity of the mineral in the facility's inventory
        const facilityResponse = await fetch(`http://localhost:8088/minerals/${mineralId}`);
        const mineral = await facilityResponse.json();

        if (mineral.quantity > 0) {
            await fetch(`http://localhost:8088/minerals/${mineralId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...mineral, quantity: mineral.quantity - 1 })
            });

            console.log(`Decremented inventory for mineral ID ${mineralId} in facility ${facilityId}.`);
        } else {
            console.error("Mineral is out of stock in the facility.");
        }

        // Notify the UI that the state has changed
        document.dispatchEvent(new CustomEvent("stateChanged"));
    } catch (error) {
        console.error("Error during purchase:", error);
    }
};
