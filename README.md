# Titan Gears - Simple E-commerce Website with User Data Analysis

## Project Overview
Titan Gears is a web-based e-commerce application developed for CIT2011.  
The system allows users to register, log in, browse products, manage a shopping cart, complete checkout, generate invoices, and view user analytics through a dashboard.

The application uses HTML, CSS, and JavaScript, with data stored in the browser using localStorage.

---

### Features

### User Management
- User Registration with validation:
  - First Name, Last Name
  - Date of Birth (Age ≥ 18 validation)
  - Gender
  - Phone Number (Jamaican format)
  - Email
  - TRN (unique per user)
  - Password (minimum 8 characters)
- Login using TRN and password
- 3 login attempt limit with account lock
- Reset password functionality

---

### E-commerce Functionality
- Product catalogue (dynamic display from array)
- Add to cart functionality
- Update item quantity (+ / -)
- Remove items from cart
- Clear all items
- Cart summary:
  - Subtotal
  - Discount (if applicable)
  - Tax (15%)
  - Total cost

---

### Checkout & Invoice
- Checkout form with:
  - Full Name
  - Address
  - Amount Paid
- Invoice generation includes:
  - Company name
  - Invoice number
  - Date
  - TRN
  - Purchased items
  - Taxes
  - Total cost
- Invoice stored in:
  - `AllInvoices`
  - User’s personal `invoices[]`

---

### Dashboard & Analytics
- User frequency by:
  - Gender
  - Age group
- Visual bar-style charts
- Search invoices by TRN
- View all invoices via console

---

### Security Features
- Login required for:
  - Cart
  - Checkout
  - Invoice
  - Dashboard
- Account lock after 3 failed attempts

---

## Technologies Used
- HTML5
- CSS3
- JavaScript
- LocalStorage

---

## Project Structure

  /TitanGears
│── index.html
│── login.html
│── register.html
│── products.html
│── cart.html
│── checkout.html
│── invoice.html
│── dashboard.html
│── about.html
│── locked.html
│── style.css
│── script.js
│── Assets/

---

## How to Run the Project
1. Download or clone the repository
2. Extract the folder (if zipped)
3. Open `index.html` in a web browser
4. Register a new user
5. Log in using TRN and password
6. Start shopping

---

## Sample Test Account
(You can create your own or use this format)

TRN: 123-456-789  
Password: password123

---

## Notes
- All data is stored locally using browser localStorage
- Refreshing the page will not delete stored users or invoices
- Clearing browser storage will reset all data

---

## Students Information
- Name: Warren Burgher  
- ID#: 2409320
- K'Vonne Marshall
- ID#: 
- Khaleil Ricketts
- ID#: 2404237
- Jelornie Jarrett
- ID#: 2404228
- Module: CIT2011  
- Assignment: Simple E-commerce Website with User Data Analysis  
- Class Time: Wednesday 12:00 PM – 1:50 PM  

---

## License
This project is for academic purposes only.
