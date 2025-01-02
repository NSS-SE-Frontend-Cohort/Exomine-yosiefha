// Fetch minerals for a specific facility
export const fetchMinerals = async (facilityId) => {
  // Fetch minerals from the server filtered by facility ID
  const response = await fetch(`http://localhost:8088/minerals?facilityId=${facilityId}`);
  return await response.json(); // Return the minerals data as JSON
};



export const updateMineralsList = async (minerals) => {
  const mineralsList = document.getElementById("minerals-list"); // Target the minerals list element
  const displayElement = document.getElementById("space-cart"); // Target the display element for the selected mineral

  // Clear existing content in the minerals list
  mineralsList.innerHTML = "";

  // Filter minerals with quantity > 0 and iterate over them
  minerals
      .filter((mineral) => mineral.quantity > 0)
      .forEach((mineral) => {
          // Create radio button and label for each mineral
          const radio = Object.assign(document.createElement("input"), {
              type: "radio",
              name: "mineral",
              value: mineral.id,
          });

          const label = document.createElement("label");
          label.textContent = `${mineral.name} (${mineral.quantity} tons)`;

          // Add event listener to update the display element
          radio.addEventListener("click", () => {
              displayElement.textContent = `1 ton of ${mineral.name}`;
          });

          // Append radio, label, and line break to the minerals list
          mineralsList.append(radio, label, document.createElement("br"));
      });
};


// Fetch all minerals data from the server
export const fetchAllMinerals = async () => {
  try {
      // Make a fetch request to get the complete list of minerals
      const response = await fetch("http://localhost:8088/minerals");

      // Check if the response is successful
      if (!response.ok) {
          throw new Error("Failed to fetch minerals"); // Throw an error if the request fails
      }

      const minerals = await response.json(); // Parse the response JSON
      return minerals; // Return the list of minerals
  } catch (error) {
      console.error("Error fetching minerals:", error); // Log any errors encountered
      return []; // Return an empty array in case of an error
  }
};

  