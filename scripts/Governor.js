
export function fetchColonyInventory(colonyId) {
    let colonyInventory =[]
    return fetch('http://localhost:8088/colonies')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch colonies');
      }
      return response.json();
    })
    .then(colonies => {
      // Iterating over colonies array and logging data
      colonies.forEach(colony => {
        if( colonyId == colony.id){
          colonyInventory.push(colony)
        }
        
      });
    })
    .catch(error => {
      console.error('Error fetching colonies:', error);
    });
    
  }
  


  export const fetchGovernors = async () => {
    try {
      const response = await fetch("http://localhost:8088/governors?status=active");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const governors = await response.json();
      console.log('Governors API response:', governors);
  
      if (!Array.isArray(governors) || governors.length === 0) {
        console.error('Invalid governors data:', governors);
        return [];
      }
  
      return governors; // Return the list of governors
    } catch (error) {
      console.error('Error fetching governors:', error);
      return []; // Return an empty array in case of an error
    }
  };
  
  

export const updateGovernorSelect = (governors) => {
    const governorSelect = document.getElementById("governor-select");
    if (!governors || !Array.isArray(governors)) {
      console.error('Invalid governors data:', governors);
      return;
    }
  
    governors.forEach(governor => {
      const option = document.createElement("option");
      option.value = governor.id;
      option.textContent = governor.name;
      governorSelect.appendChild(option);
    });
  };
  