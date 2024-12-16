// Function to show a generic notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

// Function to update local storage and cart count
function updateLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
}

// Function to update the cart item count in the navbar
function updateCartCount(cart) {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalItems;
}

// Function to add item to cart with a limit of 99
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.name === product.name);

    if (existingItemIndex > -1) {
        if (cart[existingItemIndex].quantity + product.quantity <= 99) {
            cart[existingItemIndex].quantity += product.quantity;
        } else {
            showNotification('You can only add up to 99 of the same item.');
            return;
        }
    } else {
        product.quantity = product.quantity || 1; 
        cart.push(product);
    }

    updateLocalStorage(cart);
    showNotification('Item added to cart!');
}

// Function to display the cart items on the cart page
function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        totalPriceElement.innerText = '₱0.00';
        return;
    }

    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <p>${item.name}</p>
                <p>₱${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" data-index="${index}">+</button>
                </div>
            </div>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.innerText = `₱${totalPrice.toFixed(2)}`;
    addCartEventListeners();
}

// Attach event listeners for cart actions
function addCartEventListeners() {
    document.querySelectorAll('.decrease-quantity').forEach(button => button.addEventListener('click', decreaseQuantity));
    document.querySelectorAll('.increase-quantity').forEach(button => button.addEventListener('click', increaseQuantity));
    document.querySelectorAll('.remove-item').forEach(button => button.addEventListener('click', removeItem));
}

function decreaseQuantity(e) {
    const index = e.target.getAttribute('data-index');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateLocalStorage(cart);
    displayCartItems();
}

function increaseQuantity(e) {
    const index = e.target.getAttribute('data-index');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index] && (cart[index].quantity < 99)) { 
        cart[index].quantity += 1;
        updateLocalStorage(cart);
        displayCartItems();
    } else {
        showNotification('You can only have up to 99 of this item.');
    }
}

function removeItem(e) {
    const index = e.target.getAttribute('data-index');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    updateLocalStorage(cart);
    displayCartItems();
}

function checkout() {
    showNotification('Your order has been confirmed!');
    clearCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount([]);
    displayCartItems();
}

document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(cart);
    displayCartItems();
});
