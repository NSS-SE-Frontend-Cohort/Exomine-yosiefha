export const fetchFacilities = async () => {
    const response = await fetch("http://localhost:8088/facilities?status=active");
    return await response.json();
};

export const updateFacilitySelect = (facilities) => {
    const facilitySelect = document.getElementById("facility-select");
    facilitySelect.innerHTML = "<option value=''>--Select Facility--</option>";
    facilities.forEach(facility => {
        const option = document.createElement("option");
        option.value = facility.id;
        option.textContent = facility.name;
        facilitySelect.appendChild(option);
    });
};