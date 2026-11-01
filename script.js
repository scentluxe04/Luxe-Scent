const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
let productCards = [];

const SUPABASE_URL = "https://xriigqgpokcvvnnennal.supabase.co";
const SUPABASE_KEY = "sb_publishable_Rkn_UFAvrKoV6QomDyguTw_08RU7xVh";

const { createClient } = await import(
    "https://esm.sh/@supabase/supabase-js@2"
);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Gabim nga Supabase:", error);
        return;
    }

    const container = document.querySelector(".product-container");
    container.innerHTML = "";

    data.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id;
        card.dataset.description = product.description || "";
        card.dataset.topNotes = product.top_notes || "";
        card.dataset.heartNotes = product.heart_notes || "";
        card.dataset.baseNotes = product.base_notes || "";
        card.dataset.size = product.size || "100 ml";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image_url}" alt="">
            </div>
            <div class="product-info">
                <p class="category">${product.category}</p>
                <p class="brand"></p>
                <h3></h3>
                <strong>${Number(product.price).toLocaleString("sq-AL")} L</strong>
                <button class="add-to-cart">Shto në shportë</button>
            </div>
        `;

        card.querySelector("h3").textContent = product.name;
        card.querySelector(".brand").textContent = product.brand || "";
        card.querySelector("img").alt = product.name;
        container.appendChild(card);
    });

    productCards = document.querySelectorAll(".product-card");
}

await loadProducts();

// ================= PAGINATION =================

const productsPerPage = 12;
let currentPage = 1;

function showPage(page) {
    const visibleProducts = Array.from(productCards).filter(function(card) {
        return card.dataset.filtered !== "true";
    });

    const totalPages = Math.ceil(visibleProducts.length / productsPerPage);

    if (totalPages === 0) {
        productCards.forEach(function(card) {
            card.style.display = "none";
        });

        renderPagination(0);
        return;
    }

    if (page > totalPages) {
        page = totalPages;
    }

    currentPage = page;

    // Fshij të gjitha nga pamja
    productCards.forEach(function(card) {
        card.style.display = "none";
    });

    // Shfaq vetëm 12 parfumet e faqes
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    visibleProducts.slice(start, end).forEach(function(card) {
        card.style.display = "";
    });

    renderPagination(totalPages);
    const firstProduct = visibleProducts[start];

if (firstProduct) {
    firstProduct.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
}


function renderPagination(totalPages) {
    const pagination = document.getElementById("pagination");
    if (!pagination) {
        console.error("Elementi pagination nuk u gjet në HTML.");
        return;
    }

    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    // Butoni "Mbrapa"
    const previousButton = document.createElement("button");
    previousButton.textContent = "‹";
    previousButton.disabled = currentPage === 1;

    previousButton.addEventListener("click", function() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    pagination.appendChild(previousButton);


    // Numrat e faqeve
    for (let i = 1; i <= totalPages; i++) {

        const pageButton = document.createElement("button");

        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function() {
            showPage(i);
        });

        pagination.appendChild(pageButton);
    }


    // Butoni "Përpara"
    const nextButton = document.createElement("button");
    nextButton.textContent = "›";
    nextButton.disabled = currentPage === totalPages;

    nextButton.addEventListener("click", function() {
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    pagination.appendChild(nextButton);
}


// Fillimi
showPage(1);

function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase().trim();

    productCards.forEach(function(card) {
        const productName = card.querySelector("h3").textContent.toLowerCase();

        if (productName.includes(searchTerm)) {
            card.dataset.filtered = "false";
        } else {
            card.dataset.filtered = "true";
        }
    });

    currentPage = 1;
    showPage(1);
}

searchInput.addEventListener("input", searchProducts);
searchButton.addEventListener("click", searchProducts);

const categoryFilters = document.querySelectorAll(".category-filter");

categoryFilters.forEach(function(filter) {
    filter.addEventListener("click", function() {

        const selectedCategory = this.dataset.category;

        productCards.forEach(function(card) {

            const category = card.querySelector(".category").textContent.trim();

            if (category === selectedCategory) {
                card.dataset.filtered = "false";
            } else {
                card.dataset.filtered = "true";
            }

        });

        searchInput.value = "";
        currentPage = 1;
        showPage(1);
    });
});

const showAll = document.getElementById("showAll");
const navCategoryFilters = document.querySelectorAll(".nav-category-filter");

navCategoryFilters.forEach(function(filter) {
    filter.addEventListener("click", function() {
        const selectedCategory = this.dataset.category;

        productCards.forEach(function(card) {
            const category = card.querySelector(".category").textContent.trim();

            if (
                selectedCategory === "ALL" ||
                category === selectedCategory
            ) {
                card.dataset.filtered = "false";
            } else {
                card.dataset.filtered = "true";
            }
        });

        searchInput.value = "";
        currentPage = 1;
        showPage(1);
    });
});

showAll.addEventListener("click", function() {

    productCards.forEach(function(card) {
        card.dataset.filtered = "false";
    });

    searchInput.value = "";
    currentPage = 1;
    showPage(1);
});

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");

const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");



let currentProduct = null;
const addToCartModal = document.querySelector(".order-modal");

productCards.forEach(function(card) {

    card.addEventListener("click", function(event) {
        if (event.target.closest(".add-to-cart")) {
            return;
        }

        const image = card.querySelector(".product-image img");
        const category = card.querySelector(".category");
        const name = card.querySelector("h3");
        const price = card.querySelector("strong");

        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCategory.textContent = category.textContent;
        modalName.textContent = name.textContent;
        modalPrice.textContent = price.textContent;
        
        currentProduct = {
            name: name.textContent.trim(),
            price: Number(
                price.textContent
                    .replace(/\./g, "")
                    .replace(/,/g, "")
                    .replace(" L", "")
                    .trim()
            ),
            image: image.src
        };
        
        document.getElementById("modalTopNotes").textContent =
            card.dataset.topNotes || "Nuk ka informacion";

        document.getElementById("modalHeartNotes").textContent =
            card.dataset.heartNotes || "Nuk ka informacion";

        document.getElementById("modalBaseNotes").textContent =
            card.dataset.baseNotes || "Nuk ka informacion";

        document.getElementById("modalSize").textContent =
            card.dataset.size || "100 ml";

        document.getElementById("modalDescription").textContent =
            card.dataset.description || "Nuk ka përshkrim";
        productModal.classList.add("active");
    });

});

closeModal.addEventListener("click", function() {
    productModal.classList.remove("active");
});

productModal.addEventListener("click", function(event) {
    if (event.target === productModal) {
        productModal.classList.remove("active");
    }
});

const decreaseQuantity = document.getElementById("decreaseQuantity");
const increaseQuantity = document.getElementById("increaseQuantity");
const quantityDisplay = document.getElementById("quantity");

function validateQuantity() {
    const value = Number(quantityDisplay.value);

    if (!Number.isInteger(value) || value < 1) {
        quantityDisplay.value = 1;
    }
}

increaseQuantity.addEventListener("click", function () {
    validateQuantity();
    quantityDisplay.value = Number(quantityDisplay.value) + 1;
});

decreaseQuantity.addEventListener("click", function () {
    validateQuantity();

    if (Number(quantityDisplay.value) > 1) {
        quantityDisplay.value = Number(quantityDisplay.value) - 1;
    }
});

quantityDisplay.addEventListener("change", validateQuantity);
quantityDisplay.addEventListener("blur", validateQuantity);

const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

cartButton.addEventListener("click", function () {
    cartOverlay.classList.add("active");
});

closeCart.addEventListener("click", function () {
    cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", function (event) {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("active");
    }
});

let cart = [];



function addProductToCart(product, quantity) {

    const existingProduct = cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    renderCart();
}

const addToCartButtons = document.querySelectorAll(".add-to-cart");

addToCartButtons.forEach(function(button) {

    button.addEventListener("click", function(event) {

        event.stopPropagation();

        const card = this.closest(".product-card");

        const name = card.querySelector("h3").textContent.trim();

        const priceText = card.querySelector("strong").textContent.trim();

        const price = Number(
            priceText
                .replace(/\./g, "")
                .replace(/,/g, "")
                .replace(" L", "")
                .trim()
        );

        const image = card.querySelector(".product-image img").src;

        addProductToCart(
            {
                name: name,
                price: price,
                image: image
            },
            1
        );

        cartOverlay.classList.add("active");
    });

});

addToCartModal.addEventListener("click", function () {

    if (!currentProduct) {
        return;
    }

    const quantity = Number(quantityDisplay.value) || 1;

    addProductToCart(
        {
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image
        },
        quantity
    );

    quantityDisplay.value = 1;

    productModal.classList.remove("active");
    cartOverlay.classList.add("active");
});

function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Shporta është bosh.</p>
        `;

        cartTotal.textContent = "0 L";
        cartCount.textContent = "0";

        return;
    }

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div class="cart-item-info">
                <h3>${item.name}</h3>

                <p>${item.price.toLocaleString("en-US")} L</p>

                <div class="cart-item-quantity">
                    <button class="cart-decrease" data-name="${item.name}">−</button>

                    <span>${item.quantity}</span>

                    <button class="cart-increase" data-name="${item.name}">+</button>
                </div>
            </div>

            <div class="cart-item-actions">

                <strong class="cart-item-total">
                    ${itemTotal.toLocaleString("en-US")} L
                </strong>

                <button class="remove-cart-item" data-name="${item.name}">
                     Hiq
                </button>

            </div>
        `;

        cartItems.appendChild(cartItem);
    });

        const decreaseButtons = document.querySelectorAll(".cart-decrease");
    const increaseButtons = document.querySelectorAll(".cart-increase");

    decreaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            const product = cart.find(item => item.name === productName);

            if (product && product.quantity > 1) {
                product.quantity--;
                renderCart();
            }
        });
    });

    increaseButtons.forEach(function(button) {
        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            const product = cart.find(item => item.name === productName);

            if (product) {
                product.quantity++;
                renderCart();
            }
        });
    });

    const removeButtons = document.querySelectorAll(".remove-cart-item");

    removeButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            const productName = this.dataset.name;

            cart = cart.filter(function(item) {
                return item.name !== productName;
            });

            renderCart();
        });
    });

    cartTotal.textContent = total.toLocaleString("en-US") + " L";
    cartCount.textContent = totalQuantity;
}

const checkoutButton = document.getElementById("checkoutButton");
const checkoutOverlay = document.getElementById("checkoutOverlay");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {
        alert("Shporta është bosh.");
        return;
    }

    const total = cart.reduce(function(sum, item) {
        return sum + (item.price * item.quantity);
    }, 0);

    checkoutTotal.textContent =
        total.toLocaleString("en-US") + " L";

    cartOverlay.classList.remove("active");
    checkoutOverlay.classList.add("active");
});


closeCheckout.addEventListener("click", function() {
    checkoutOverlay.classList.remove("active");
});


checkoutOverlay.addEventListener("click", function(event) {

    if (event.target === checkoutOverlay) {
        checkoutOverlay.classList.remove("active");
    }

});

emailjs.init({
    publicKey: "_ivGsOmacG-yoQM9Q"
});

checkoutForm.addEventListener("submit", function(event) {

    event.preventDefault();

    if (cart.length === 0) {
        alert("Shporta është bosh.");
        return;
    }

    const customerName = document.getElementById("customerName").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();
    const customerCity = document.getElementById("customerCity").value.trim();
    const customerAddress = document.getElementById("customerAddress").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    let orderItems = "";
    let total = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        orderItems +=
            item.name +
            " × " +
            item.quantity +
            " — " +
            itemTotal.toLocaleString("en-US") +
            " L\n";
    });

    const templateParams = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_city: customerCity,
        customer_address: customerAddress,
        payment_method: paymentMethod,
        order_items: orderItems,
        order_total: total.toLocaleString("en-US")
    };

    const confirmButton = document.querySelector(".confirm-order");

    confirmButton.disabled = true;
    confirmButton.textContent = "Duke dërguar...";

    emailjs.send(
        "service_uaasjlr",
        "template_6tjgxfg",
        templateParams
    )
    .then(function() {

        alert("Porosia u dërgua me sukses! 🤍");

        checkoutForm.reset();

        cart = [];

        renderCart();

        checkoutOverlay.classList.remove("active");

        confirmButton.disabled = false;
        confirmButton.textContent = "Konfirmo porosinë";

    })
    .catch(function(error) {

        console.error("EmailJS error:", error);

        alert(
            "Ndodhi një problem gjatë dërgimit të porosisë. Ju lutem provoni përsëri."
        );

        confirmButton.disabled = false;
        confirmButton.textContent = "Konfirmo porosinë";
    });

});

const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

if (dropdown && dropdownToggle) {
    dropdownToggle.addEventListener("click", function() {
        const isOpen = dropdown.classList.toggle("open");

        dropdownToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove("open");
            dropdownToggle.setAttribute("aria-expanded", "false");
        }
    });
}