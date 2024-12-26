export const addMineralToCart = async (mineral) => {
    const response = await fetch("http://localhost:8088/selectedMineralsCart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mineral)
    });
    return response.ok;
};
export const updateSpaceCart = () => {
    const cart = document.getElementById("space-cart");
    cart.innerHTML = ""; // Clear current cart
    // Assuming state is updated in `purchaseMineral`
    const cartItem = document.createElement("div");
    cartItem.textContent = "Mineral added to cart successfully!";
    cart.appendChild(cartItem);
};