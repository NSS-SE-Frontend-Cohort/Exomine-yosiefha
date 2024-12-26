export const fetchMinerals = async (facilityId) => {
    const response = await fetch(`http://localhost:8088/minerals?facilityId=${facilityId}`);
    return await response.json();
};

export const updateMineralsList = (minerals) => {
    const mineralsList = document.getElementById("minerals-list");
    mineralsList.innerHTML = "";
    minerals.forEach(mineral => {
        if (mineral.quantity > 0) {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "mineral";
            radio.value = mineral.id;

            const label = document.createElement("label");
            label.textContent = `${mineral.name} (${mineral.quantity} tons)`;

            mineralsList.appendChild(radio);
            mineralsList.appendChild(label);
            mineralsList.appendChild(document.createElement("br"));
        }
    });
};