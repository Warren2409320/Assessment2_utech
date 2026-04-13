/* IA#2 JavaScript: DOM manipulation, event handling, validation, calculations */

function addToCart(productName, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(productName + " added to cart.");
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cart-items");
    let discountEl = document.getElementById("discount");
    let taxEl = document.getElementById("tax");
    let totalEl = document.getElementById("total");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>${itemTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    let discount = subtotal > 10000 ? 1000 : 0;
    let taxableAmount = subtotal - discount;
    let tax = taxableAmount * 0.15;
    let total = taxableAmount + tax;

    if (discountEl) discountEl.textContent = discount.toFixed(2);
    if (taxEl) taxEl.textContent = tax.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

function clearCart() {
    localStorage.removeItem("cart");
    alert("Cart cleared.");
    location.reload();
}

function loadCheckoutSummary() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let checkoutTotal = document.getElementById("checkout-total");

    if (!checkoutTotal) return;

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;
    });

    let discount = subtotal > 10000 ? 1000 : 0;
    let taxableAmount = subtotal - discount;
    let tax = taxableAmount * 0.15;
    let total = taxableAmount + tax;

    checkoutTotal.textContent = total.toFixed(2);
}

function confirmOrder() {
    let fullName = document.getElementById("fullName").value.trim();
    let address = document.getElementById("address").value.trim();
    let amountPaid = document.getElementById("amountPaid").value.trim();

    if (fullName === "" || address === "" || amountPaid === "") {
        alert("Please complete all shipping details.");
        return;
    }

    alert("Order confirmed. Thank you for shopping with Titan Gear.");
    localStorage.removeItem("cart");
    window.location.href = "index.html";
}

function cancelOrder() {
    alert("Order cancelled.");
    window.location.href = "cart.html";
}

function validateLogin() {
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if (!email || !password) return true;

    let emailValue = email.value.trim();
    let passwordValue = password.value.trim();

    if (emailValue === "" || passwordValue === "") {
        alert("Please enter your email and password.");
        return false;
    }

    return true;
}

function validateRegister() {
    let fullName = document.getElementById("fullName");
    let dob = document.getElementById("dob");
    let email = document.getElementById("email");
    let username = document.getElementById("username");
    let password = document.getElementById("password");

    if (!fullName || !dob || !email || !username || !password) return true;

    if (
        fullName.value.trim() === "" ||
        dob.value.trim() === "" ||
        email.value.trim() === "" ||
        username.value.trim() === "" ||
        password.value.trim() === ""
    ) {
        alert("Please complete all registration fields.");
        return false;
    }

    return true;
}
