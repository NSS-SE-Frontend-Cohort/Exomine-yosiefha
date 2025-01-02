// Function to update the Space Cart display in the UI
export const updateSpaceCart = () => {
    const cart = document.getElementById("space-cart");
    cart.innerHTML = "";
    const cartItem = document.createElement("div");
    cartItem.textContent = "";
    cart.appendChild(cartItem);
};
