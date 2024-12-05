// Function to show a generic notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Function to update local storage and cart count
function updateLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
}

// Function to update the cart item count in the navbar
function updateCartCount(cart) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0); // Count total quantity
    document.getElementById('cart-count').innerText = totalItems;
}

// Function to add item to cart with a limit of 99
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if the item already exists in the cart
    const existingItemIndex = cart.findIndex(item => item.name === product.name);

    if (existingItemIndex > -1) {
        // Check if adding more exceeds the limit of 99
        if (cart[existingItemIndex].quantity + product.quantity <= 99) {
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            showNotification('You can only add up to 99 of the same item.');
            return;
        }
    } else {
        // If the item doesn't exist, add it to the cart
        product.quantity = 1; // Set default quantity for new products
        cart.push(product);
    }

    // Save updated cart to localStorage and update UI
    updateLocalStorage(cart);
    
    // Show a notification that the item has been added to the cart
    showNotification('Item added to cart!');
}

// Function to display the cart items on the cart page
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    // Clear any existing cart items
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.innerText = '₱0.00';
        return;
    }

    let totalPrice = 0;
    
    // Render each item in the cart
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += item.price * item.quantity; // Calculate total price
    });

    totalPriceElement.innerText = `₱${totalPrice.toFixed(2)}`;

    // Add event listeners for quantity buttons and remove button
    addCartEventListeners();
}

// Function to add event listeners for quantity and remove buttons
function addCartEventListeners() {
   document.querySelectorAll('.decrease-quantity').forEach(button => {
       button.addEventListener('click', decreaseQuantity);
   });
   
   document.querySelectorAll('.increase-quantity').forEach(button => {
       button.addEventListener('click', increaseQuantity);
   });
   
   document.querySelectorAll('.remove-item').forEach(button => {
       button.addEventListener('click', removeItem);
   });
}

// Function to decrease the quantity of an item in the cart
function decreaseQuantity(e) {
   const index = e.target.getAttribute('data-index');
   let cart = JSON.parse(localStorage.getItem('cart')) || [];
   
   if (cart[index].quantity > 1) {
       cart[index].quantity -= 1; // Decrease quantity
   } else {
       cart.splice(index, 1); // Remove item if quantity is 0
   }
   
   updateLocalStorage(cart); // Update local storage and UI.
   displayCartItems(); // Re-render the cart after updating quantities.
}

// Function to increase the quantity of an item in the cart
function increaseQuantity(e) {
   const index = e.target.getAttribute('data-index');
   let cart = JSON.parse(localStorage.getItem('cart')) || [];
   
   if (cart[index] && (cart[index].quantity < 99)) { 
       cart[index].quantity += 1; // Increase quantity.
       updateLocalStorage(cart); // Update local storage.
       displayCartItems(); // Re-render the cart after updating quantities.
   } else if (cart[index]) {
       showNotification('You can only have up to 99 of this item.');
   }
}

// Function to remove an item from the cart
function removeItem(e) {
   const index = e.target.getAttribute('data-index');
   
   let cart = JSON.parse(localStorage.getItem('cart')) || [];
   
   if (index >= 0 && index < cart.length) { 
       cart.splice(index, 1); // Remove item from cart.
       updateLocalStorage(cart); // Update local storage.
       displayCartItems(); // Re-render the cart after removing an item.
   }
}

// Function to handle checkout process
function checkout() {
   const totalPriceElement = document.getElementById('total-price');
   const formattedTotal = totalPriceElement.textContent;

   showNotification(`Your order has been confirmed! Total amount: ${formattedTotal}.`);

   clearCart(); // Clear all items from local storage after checkout.
}

// Function to clear all items from local storage and reset UI
function clearCart() {
   localStorage.removeItem('cart'); 
   updateCartCount([]); // Update nav count to 0.
   
   displayCartItems(); // Clear displayed items on current page.
}

// Initial load setup for updating nav count on page load.
document.addEventListener("DOMContentLoaded", () => {
   const cart = JSON.parse(localStorage.getItem('cart')) || [];
   updateCartCount(cart);
   displayCartItems(); // Display items when page loads.
});

// Function to close confirmation popup.
function closeConfirmation() {
   const confirmationPopup = document.getElementById('confirmation-popup');
   confirmationPopup.style.display = 'none'; 
}