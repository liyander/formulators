document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        renderItemQuantities();
    }

    function renderCart() {
        // Clear all individual product cart displays first
        document.querySelectorAll(".product-cart-item").forEach(el => el.remove());
        
        // Create cart items and place them under their corresponding products
        cart.forEach((item, index) => {
            // Find all product containers that match this item by image path
            document.querySelectorAll(".add-to-cart").forEach(button => {
                const productImage = button.getAttribute("data-image");
                
                // Only create cart display for matching products by image
                if (productImage === item.image) {
                    const productDiv = button.closest(".pro");
                    
                    // Create cart item display
                    let cartItemDiv = document.createElement("div");
                    cartItemDiv.classList.add("product-cart-item");
                    cartItemDiv.style.padding = "8px";
                    cartItemDiv.style.margin = "5px 0";
                    cartItemDiv.style.borderTop = "1px solid #e1e1e1";
                    
                    cartItemDiv.innerHTML = `
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <div style="display: flex; align-items: center;">
                                <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; margin-right: 10px; object-fit: cover;">
                                <div>
                                    <p style="margin: 0; font-size: 14px;">${item.name}</p>
                                    <p style="margin: 0; font-size: 14px;">₹${item.price} × ${item.quantity}</p>
                                </div>
                            </div>
                            <a href="#" class="remove-btn" data-index="${index}" style="color: #ff5f5f; text-decoration: none; font-size: 14px;">Remove</a>
                        </div>
                    `;
                    
                    // Append cart item directly after the product details
                    productDiv.appendChild(cartItemDiv);
                }
            });
        });

        // Add event listeners for remove buttons
        document.querySelectorAll(".remove-btn").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                let index = this.getAttribute("data-index");
                cart.splice(index, 1);
                updateCart();
            });
        });

        // Also update the main cart display if it exists
        let mainCartContainer = document.getElementById("cart-items");
        if (mainCartContainer) {
            mainCartContainer.innerHTML = "";
            
            cart.forEach((item, index) => {
                let itemElement = document.createElement("div");
                itemElement.classList.add("cart-item");
                itemElement.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; margin-right: 10px;">
                        <p>${item.name} - ₹${item.price} x ${item.quantity}</p>
                        <a href="#" class="main-remove-btn" data-index="${index}" style="margin-left: 10px;">Remove</a>
                    </div>
                `;
                mainCartContainer.appendChild(itemElement);
            });
            
            document.querySelectorAll(".main-remove-btn").forEach(link => {
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                    let index = this.getAttribute("data-index");
                    cart.splice(index, 1);
                    updateCart();
                });
            });
        }
    }

    function renderItemQuantities() {
        // Remove any existing quantity displays
        document.querySelectorAll(".item-quantity").forEach(el => el.remove());
        
        // Add quantity indicators for each product based on image
        document.querySelectorAll(".add-to-cart").forEach(button => {
            const imagePath = button.getAttribute("data-image");
            const existingItem = cart.find(item => item.image === imagePath);
            
            // Get the parent product div
            const productDiv = button.closest(".pro");
            
            // Create or update quantity indicator
            let quantityDiv = document.createElement("div");
            quantityDiv.className = "item-quantity";
            quantityDiv.style.textAlign = "center";
            quantityDiv.style.marginTop = "5px";
            quantityDiv.style.fontWeight = "bold";
            quantityDiv.style.color = "#4a4a4a";
            
            if (existingItem) {
                quantityDiv.innerHTML = `In Cart: ${existingItem.quantity}`;
                quantityDiv.style.display = "block";
            } else {
                quantityDiv.style.display = "none";
            }
            
            // Append after the product details but before the cart item display
            const cartItemDisplay = productDiv.querySelector(".product-cart-item");
            if (cartItemDisplay) {
                productDiv.insertBefore(quantityDiv, cartItemDisplay);
            } else {
                productDiv.appendChild(quantityDiv);
            }
        });
    }

    function addToCart(name, price, image) {
        // Use image as the unique identifier
        let existingItem = cart.find(item => item.image === image);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, image, quantity: 1 });
        }
        updateCart();
    }

    document.querySelectorAll(".add-to-cart").forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            let name = this.getAttribute("data-name");
            let price = parseFloat(this.getAttribute("data-price"));
            let image = this.getAttribute("data-image");
            addToCart(name, price, image);
        });
    });

    // Initialize cart displays
    updateCart();
});