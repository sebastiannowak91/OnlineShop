
let products = [];
let cart = [];

const shopItems = document.querySelector(".shop-items");
const cartItems = document.querySelector(".cart-items");
const total = document.querySelector(".total-value");


//Fetching and displaying products in the store
fetchProducts();
async function fetchProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const json = await response.json();
    products = json.products.map((product) => ({...product, quantity: 1 }));
    displayShopItems();
};

function displayShopItems() {
    products.forEach( (product) => {
        const item = `
            <div class="shop-item">
                <div class="shop-item-hero">
                    <img src="${product.images[0]}" alt="${product.title}"/>
                    <div class="hero-headline">
                        <h4>${product.title}</h4>
                        <h5>${product.brand}</h5>
                    </div>
                </div>
                <p>${product.description}</p>
                <ul class="shoping-details">
                    <li class="price product-subtotal">${product.price}</li>
                    <li class="quantity"><input type="number" id=${product.id} class="how-many-input" value=${product.quantity}></li> 
                    <li class="add-remove"><button onclick="update('plus', ${product.id})">+</button><button onclick="update('minus', ${product.id})">-</button></li>
                    <li class="add-to-cart"><button class="add-btn" onclick="addToCart(${product.id})"><i class="ph-shopping-cart-bold"></i></button></li>
                </ul>
            </div>
        `;
        shopItems.innerHTML += item;
    });
};


//Updating quantity of products before adding to the cart
function update(action, id) {
    let input = document.getElementById(id);
    let value = input.value;
    if (action === "minus" && value > 1) {
        value--;
    } else if (action === "plus"){
        value++;
    };
    input.value = value;
};


//Adding to the cart
function addToCart(id) {
    let input = document.getElementById(id);
    if(cart.some((cartItem) => cartItem.id === id)) {
        changeQuantity('plus', id, input.value);
    } else {
        const cartItem = products.find((product) => product.id === id);
        cart.push({
            ...cartItem,
            quantity: input.value,
        });
    }
    input.value = 1;
    displayCartItems();
};


//Creating subcarts per product brand and displaying products in the cart
function createSubcarts() {
    subCarts = [];
    const brands = cart.map(product => `${product.brand}`);
    brands.forEach((brand) => {
        subCarts.includes(brand) ? null : subCarts.push(brand);
    }); 
    return subCarts;
};

function displayCartItems() {
    subCarts = createSubcarts();
    cartItems.innerHTML = "";
    let cartItem = "";
    let grandTotal = 0;
    subCarts.forEach( (brand) => {
        let subtotal = 0;
        cartItem += `
            <div class="cart-item">
                <h3>${brand}</h3>
        `;
        cart.forEach( (product) => {
            if(product.brand === brand) {
                let totalPrice = (product.price) * (product.quantity);
                subtotal += totalPrice;
                cartItem += `
                    <div class="added-item">
                        <ul class="item-details">
                            <li class="item">${product.title}</li>
                            <li class="price product-subtotal">${totalPrice.toFixed(2)}</li>
                            <li class="quantity"><input type="number" value=${product.quantity}></li>
                            <li class="add-remove"><button class="more" onclick="changeQuantity('plus', ${product.id}, 1)">+</button><button class="less" onclick="changeQuantity('minus', ${product.id}, 1)">-</button></li>
                        </ul>
                        <button class="remove-item" onclick="removeFromCart(${product.id})"><i class="ph-trash-bold"></i></button>
                    </div>
                `;
            };
        });
        cartItem += `
                <div class="subtotal">Total: ${subtotal.toFixed(2)} $</div>
            </div>
        `;
        cartItems.innerHTML = cartItem;
        grandTotal += subtotal;
    });
    total.innerHTML = `
        ${grandTotal.toFixed(2)}
    `;
};


//Changing quantity of products in the cart
function changeQuantity(action, id, addQuantity) {
    cart = cart.map((product) => {
        let quantity = parseInt(product.quantity);
        if (product.id === id) {
            if (action === "minus" && product.quantity > 1) {
                quantity--;
            } else if (action === "plus"){
                quantity+= parseInt(addQuantity);
            }
        }
        return {
            ...product,
            quantity,
        };
    });
    displayCartItems();
};


//Removing product from the cart
function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    displayCartItems();
};