/* =========================================================
   TITAN GEARS - GROUP PROJECT SCRIPT
   Student: Warren Burgher
   Module: CIT2011

   This script covers:
   1. Registration with localStorage
   2. Login with TRN + password
   3. Product catalogue from JS objects
   4. Shopping cart
   5. Checkout and invoice generation
   6. Dashboard functions
========================================================= */

/* =========================================================
   SECTION 1: LOCAL STORAGE SETUP
========================================================= */

function getRegistrationData() {
    return JSON.parse(localStorage.getItem("RegistrationData")) || [];
}

function saveRegistrationData(data) {
    localStorage.setItem("RegistrationData", JSON.stringify(data));
}

function getAllProducts() {
    return JSON.parse(localStorage.getItem("AllProducts")) || [];
}

function saveAllProducts(products) {
    localStorage.setItem("AllProducts", JSON.stringify(products));
}

function getAllInvoices() {
    return JSON.parse(localStorage.getItem("AllInvoices")) || [];
}

function saveAllInvoices(invoices) {
    localStorage.setItem("AllInvoices", JSON.stringify(invoices));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("CurrentUser"));
}

function setCurrentUser(user) {
    localStorage.setItem("CurrentUser", JSON.stringify(user));
}

/* =========================================================
   SECTION 2: HELPER FUNCTIONS
========================================================= */

function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

function generateInvoiceNumber() {
    return "INV-" + Date.now();
}

function calculateCartSummary(cart) {
    let subtotal = 0;

    cart.forEach(function (item) {
        subtotal += item.price * item.qty;
    });

    let discount = subtotal > 10000 ? 1000 : 0;
    let taxableAmount = subtotal - discount;
    let tax = taxableAmount * 0.15;
    let total = taxableAmount + tax;

    return {
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total
    };
}

function getAgeGroup(age) {
    if (age >= 18 && age <= 25) return "18-25";
    if (age >= 26 && age <= 35) return "26-35";
    if (age >= 36 && age <= 50) return "36-50";
    return "50+";
}

/* =========================================================
   SECTION 3: PRODUCT INITIALIZATION
   Requirement: products stored as array of objects and saved
   to localStorage as AllProducts
========================================================= */

function initializeProducts() {
    const existingProducts = getAllProducts();

    if (existingProducts.length > 0) return;

    const products = [
        {
            id: 1,
            name: "Reflective Safety Vest",
            price: 2500,
            description: "High-visibility vest suitable for road work, construction, and security teams.",
            image: "vest.jpg"
        },
        {
            id: 2,
            name: "Safety Helmet",
            price: 3800,
            description: "Strong, lightweight helmet built for industrial and construction environments.",
            image: "helmet.jpg"
        },
        {
            id: 3,
            name: "Protective Gloves",
            price: 1200,
            description: "Comfortable work gloves made for grip, protection, and repeated use.",
            image: "gloves.jpg"
        }
    ];

    saveAllProducts(products);
}

/* =========================================================
   SECTION 4: DISPLAY PRODUCTS DYNAMICALLY
========================================================= */

function displayProducts() {
    const productGrid = document.getElementById("product-grid");
    if (!productGrid) return;

    const products = getAllProducts();
    productGrid.innerHTML = "";

    products.forEach(function (product) {
        productGrid.innerHTML += `
            <article class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">JMD ${product.price.toFixed(2)}</p>
                <button class="btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </article>
        `;
    });
}

/* =========================================================
   SECTION 5: REGISTRATION
   Requirement: store records in RegistrationData
========================================================= */

function validateRegister() {
    const firstName = document.getElementById("firstName")?.value.trim();
    const lastName = document.getElementById("lastName")?.value.trim();
    const dob = document.getElementById("dob")?.value;
    const gender = document.getElementById("gender")?.value;
    const phone = document.getElementById("phone")?.value.trim();
    const email = document.getElementById("emailReg")?.value.trim();
    const trn = document.getElementById("trn")?.value.trim();
    const password = document.getElementById("passwordReg")?.value;
    const message = document.getElementById("registerMessage");

    if (!message) return false;

    message.textContent = "";
    message.style.color = "red";

    if (!firstName || !lastName || !dob || !gender || !phone || !email || !trn || !password) {
        message.textContent = "Please complete all registration fields.";
        return false;
    }

    const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
    if (!trnPattern.test(trn)) {
        message.textContent = "TRN must be in the format 000-000-000.";
        return false;
    }

    if (password.length < 8) {
        message.textContent = "Password must be at least 8 characters long.";
        return false;
    }

    const age = calculateAge(dob);
    if (age < 18) {
        message.textContent = "You must be over 18 years old to register.";
        return false;
    }

    let registrationData = getRegistrationData();

    const trnExists = registrationData.some(function (user) {
        return user.trn === trn;
    });

    if (trnExists) {
        message.textContent = "TRN already exists. Please use another TRN.";
        return false;
    }

    const newUser = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        age: age,
        gender: gender,
        phone: phone,
        email: email,
        trn: trn,
        password: password,
        dateOfRegistration: new Date().toLocaleString(),
        cart: [],
        invoices: []
    };

    registrationData.push(newUser);
    saveRegistrationData(registrationData);

    message.style.color = "green";
    message.textContent = "Registration successful.";

    document.getElementById("registerForm")?.reset();
    return true;
}

/* =========================================================
   SECTION 6: LOGIN
   Requirement: TRN + password, 3 attempts, lock redirect
========================================================= */

function validateLogin() {
    const trn = document.getElementById("trnLogin")?.value.trim();
    const password = document.getElementById("passwordLogin")?.value.trim();
    const message = document.getElementById("loginMessage");

    if (!message) return false;

    message.textContent = "";
    message.style.color = "red";

    if (!trn || !password) {
        message.textContent = "Please enter your TRN and password.";
        return false;
    }

    let attempts = parseInt(localStorage.getItem("LoginAttempts")) || 0;
    const users = getRegistrationData();

    const matchedUser = users.find(function (user) {
        return user.trn === trn && user.password === password;
    });

    if (matchedUser) {
        localStorage.setItem("LoginAttempts", "0");
        setCurrentUser(matchedUser);
        message.style.color = "green";
        message.textContent = "Login successful.";
        window.location.href = "products.html";
        return true;
    }

    attempts++;
    localStorage.setItem("LoginAttempts", attempts.toString());

    if (attempts >= 3) {
        window.location.href = "locked.html";
        return false;
    }

    message.textContent = "Invalid TRN or password. Attempt " + attempts + " of 3.";
    return false;
}

function resetPassword() {
    const trn = prompt("Enter your TRN (000-000-000):");
    if (!trn) return;

    let users = getRegistrationData();
    const userIndex = users.findIndex(function (user) {
        return user.trn === trn;
    });

    if (userIndex === -1) {
        alert("TRN not found.");
        return;
    }

    const newPassword = prompt("Enter your new password (minimum 8 characters):");
    if (!newPassword || newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    users[userIndex].password = newPassword;
    saveRegistrationData(users);

    alert("Password reset successful.");
}

/* =========================================================
   SECTION 7: CART
========================================================= */

function addToCart(productId) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("Please log in before adding items to cart.");
        window.location.href = "login.html";
        return;
    }

    const products = getAllProducts();
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) return;

    let users = getRegistrationData();
    const userIndex = users.findIndex(function (user) {
        return user.trn === currentUser.trn;
    });

    if (userIndex === -1) return;

    let userCart = users[userIndex].cart || [];

    const existingItem = userCart.find(function (item) {
        return item.id === product.id;
    });

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        userCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }

    users[userIndex].cart = userCart;
    saveRegistrationData(users);
    setCurrentUser(users[userIndex]);

    alert(product.name + " added to cart.");
}

function displayCart() {
    const currentUser = getCurrentUser();
    const cartItems = document.getElementById("cart-items");
    const discountEl = document.getElementById("discount");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const subtotalEl = document.getElementById("subtotal");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
        cartItems.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
        if (discountEl) discountEl.textContent = "0.00";
        if (taxEl) taxEl.textContent = "0.00";
        if (totalEl) totalEl.textContent = "0.00";
        if (subtotalEl) subtotalEl.textContent = "0.00";
        return;
    }

    currentUser.cart.forEach(function (item) {
        const itemTotal = item.price * item.qty;

        cartItems.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                    <button type="button" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    ${item.qty}
                    <button type="button" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                </td>
                <td>${itemTotal.toFixed(2)}</td>
                <td><button type="button" onclick="removeFromCart(${item.id})">Remove</button></td>
            </tr>
        `;
    });

    const summary = calculateCartSummary(currentUser.cart);

    if (subtotalEl) subtotalEl.textContent = summary.subtotal.toFixed(2);
    if (discountEl) discountEl.textContent = summary.discount.toFixed(2);
    if (taxEl) taxEl.textContent = summary.tax.toFixed(2);
    if (totalEl) totalEl.textContent = summary.total.toFixed(2);
}

function updateCartQuantity(productId, change) {
    let users = getRegistrationData();
    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const userIndex = users.findIndex(function (user) {
        return user.trn === currentUser.trn;
    });

    if (userIndex === -1) return;

    let cart = users[userIndex].cart || [];
    const itemIndex = cart.findIndex(function (item) {
        return item.id === productId;
    });

    if (itemIndex === -1) return;

    cart[itemIndex].qty += change;

    if (cart[itemIndex].qty <= 0) {
        cart.splice(itemIndex, 1);
    }

    users[userIndex].cart = cart;
    saveRegistrationData(users);
    setCurrentUser(users[userIndex]);
    displayCart();
}

function removeFromCart(productId) {
    let users = getRegistrationData();
    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const userIndex = users.findIndex(function (user) {
        return user.trn === currentUser.trn;
    });

    if (userIndex === -1) return;

    users[userIndex].cart = users[userIndex].cart.filter(function (item) {
        return item.id !== productId;
    });

    saveRegistrationData(users);
    setCurrentUser(users[userIndex]);
    displayCart();
}

function clearCart() {
    let users = getRegistrationData();
    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const userIndex = users.findIndex(function (user) {
        return user.trn === currentUser.trn;
    });

    if (userIndex === -1) return;

    users[userIndex].cart = [];
    saveRegistrationData(users);
    setCurrentUser(users[userIndex]);

    alert("Cart cleared.");
    displayCart();
}

function closeCart() {
    window.location.href = "products.html";
}

/* =========================================================
   SECTION 8: CHECKOUT AND INVOICE
========================================================= */

function loadCheckoutSummary() {
    const currentUser = getCurrentUser();
    const checkoutTotal = document.getElementById("checkout-total");

    if (!checkoutTotal) return;

    if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
        checkoutTotal.textContent = "0.00";
        return;
    }

    const summary = calculateCartSummary(currentUser.cart);
    checkoutTotal.textContent = summary.total.toFixed(2);
}

function confirmOrder() {
    const currentUser = getCurrentUser();
    const fullName = document.getElementById("fullName")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const amountPaid = document.getElementById("amountPaid")?.value.trim();

    if (!currentUser) {
        alert("Please log in first.");
        return;
    }

    if (!fullName || !address || !amountPaid) {
        alert("Please complete all shipping details.");
        return;
    }

    if (!currentUser.cart || currentUser.cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const summary = calculateCartSummary(currentUser.cart);

    const invoice = {
        companyName: "Titan Gears",
        invoiceNumber: generateInvoiceNumber(),
        dateOfInvoice: new Date().toLocaleString(),
        trn: currentUser.trn,
        shippingInformation: {
            fullName: fullName,
            address: address,
            amountPaid: amountPaid
        },
        purchasedItems: currentUser.cart,
        subtotal: summary.subtotal,
        discount: summary.discount,
        taxes: summary.tax,
        totalCost: summary.total
    };

    let allInvoices = getAllInvoices();
    allInvoices.push(invoice);
    saveAllInvoices(allInvoices);

    let users = getRegistrationData();
    const userIndex = users.findIndex(function (user) {
        return user.trn === currentUser.trn;
    });

    if (userIndex !== -1) {
        users[userIndex].invoices.push(invoice);
        users[userIndex].cart = [];
        saveRegistrationData(users);
        setCurrentUser(users[userIndex]);
    }

    localStorage.setItem("CurrentInvoice", JSON.stringify(invoice));

    alert("Order confirmed. Invoice has been generated and sent to your email.");
    window.location.href = "invoice.html";
}

function cancelOrder() {
    window.location.href = "cart.html";
}

function displayInvoice() {
    const invoice = JSON.parse(localStorage.getItem("CurrentInvoice"));
    const invoiceContainer = document.getElementById("invoice-container");

    if (!invoiceContainer || !invoice) return;

    let itemsHtml = "";

    invoice.purchasedItems.forEach(function (item) {
        itemsHtml += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.qty).toFixed(2)}</td>
            </tr>
        `;
    });

    invoiceContainer.innerHTML = `
        <h2>Invoice</h2>
        <p><strong>Company:</strong> ${invoice.companyName}</p>
        <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> ${invoice.dateOfInvoice}</p>
        <p><strong>TRN:</strong> ${invoice.trn}</p>
        <p><strong>Shipping Name:</strong> ${invoice.shippingInformation.fullName}</p>
        <p><strong>Shipping Address:</strong> ${invoice.shippingInformation.address}</p>

        <table border="1" cellpadding="8">
            <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
            ${itemsHtml}
        </table>

        <p><strong>Subtotal:</strong> JMD ${invoice.subtotal.toFixed(2)}</p>
        <p><strong>Discount:</strong> JMD ${invoice.discount.toFixed(2)}</p>
        <p><strong>Taxes:</strong> JMD ${invoice.taxes.toFixed(2)}</p>
        <p><strong>Total Cost:</strong> JMD ${invoice.totalCost.toFixed(2)}</p>
    `;
}

/* =========================================================
   SECTION 9: DASHBOARD FUNCTIONS
========================================================= */

function showUserFrequency() {
    const genderOutput = document.getElementById("gender-frequency");
    const ageOutput = document.getElementById("age-frequency");
    const users = getRegistrationData();

    if (!genderOutput || !ageOutput) return;

    let genderCounts = {
        Male: 0,
        Female: 0,
        Other: 0
    };

    let ageCounts = {
        "18-25": 0,
        "26-35": 0,
        "36-50": 0,
        "50+": 0
    };

    users.forEach(function (user) {
        if (genderCounts[user.gender] !== undefined) {
            genderCounts[user.gender]++;
        }

        const ageGroup = getAgeGroup(user.age);
        ageCounts[ageGroup]++;
    });

    genderOutput.innerHTML = `
        <h3>Gender Frequency</h3>
        <p>Male: ${genderCounts.Male}</p>
        <p>Female: ${genderCounts.Female}</p>
        <p>Other: ${genderCounts.Other}</p>
    `;

    ageOutput.innerHTML = `
        <h3>Age Group Frequency</h3>
        <p>18-25: ${ageCounts["18-25"]}</p>
        <p>26-35: ${ageCounts["26-35"]}</p>
        <p>36-50: ${ageCounts["36-50"]}</p>
        <p>50+: ${ageCounts["50+"]}</p>
    `;
}

function showInvoices() {
    const invoices = getAllInvoices();
    console.log("All Invoices:", invoices);
}

function getUserInvoices() {
    const trnSearch = document.getElementById("searchTrn")?.value.trim();
    const output = document.getElementById("user-invoices");
    const users = getRegistrationData();

    if (!output || !trnSearch) return;

    const user = users.find(function (item) {
        return item.trn === trnSearch;
    });

    if (!user) {
        output.innerHTML = "<p>No user found with that TRN.</p>";
        return;
    }

    if (!user.invoices || user.invoices.length === 0) {
        output.innerHTML = "<p>No invoices found for this user.</p>";
        return;
    }

    let html = `<h3>Invoices for ${user.firstName} ${user.lastName}</h3>`;

    user.invoices.forEach(function (invoice) {
        html += `
            <div class="invoice-box">
                <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoice.dateOfInvoice}</p>
                <p><strong>Total:</strong> JMD ${invoice.totalCost.toFixed(2)}</p>
            </div>
        `;
    });

    output.innerHTML = html;
}

/* =========================================================
   SECTION 10: AUTO-RUN FUNCTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeProducts();
    displayProducts();
    displayCart();
    loadCheckoutSummary();
    displayInvoice();
    showUserFrequency();
});
