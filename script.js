import { cart, products } from "./products.js";

const container = document.getElementById("products");
const categoryBtns = document.querySelectorAll(".category");
const count = document.getElementById("product-count");
const sort = document.getElementById("sort");
const cartLength = document.getElementById('cart')

cartLength.innerHTML = localStorage.getItem('cartLength')

sort.addEventListener("change", (e) => {
  let selectedSort = e.target.value;
  let filteredProducts;

  if (selectedSort == "low") {
    filteredProducts = products.sort((a, b) => a.price - b.price);
  } else {
    filteredProducts = products.sort((a, b) => b.price - a.price);
  }
  showProducts(filteredProducts);
});

const search = document.getElementById("search");
let searchTerm = "";

search.addEventListener("input", (e) => {
  searchTerm = e.target.value;

  let filteredProducts = products.filter((p) =>
    p.name.toLowerCase().startsWith(searchTerm.trim().toLowerCase()),
  );

  showProducts(filteredProducts);
});

let selected = "all";

categoryBtns.forEach((element) => {
  element.addEventListener("click", () => {
    categoryBtns.forEach((btn) => {
      btn.classList.remove("active");
    });
    element.classList.add("active");

    selected = element.dataset.category;
    let filteredProducts;

    if (selected == "all" || "") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (p) => p.category.toLowerCase() == selected.toLowerCase(),
      );
    }

    showProducts(filteredProducts);
  });
});

const showProducts = (products) => {
  container.innerHTML = "";

  products.forEach((p) => {
    container.innerHTML += `
            <div class="product-card">

                <div class="product-image">

                    <img
                        src="${p.image}"
                        alt="${p.name}"
                    />

                    <button class="favorite">
                        <i class="fa-regular fa-heart"></i>
                    </button>

                </div>


                <div class="product-info">

                    <span class="product-category">
                        ${p.category}
                    </span>

                    <h3 class="product-name">
                        ${p.name}
                    </h3>


                    <div class="product-bottom">

                        <span class="product-price">
                            Rs. ${p.price}
                        </span>

                        <button class="view-btn" id=${p.id}>
                            View Details
                        </button>

                    </div>

                </div>

            </div>
        `;
  });
};
count.innerHTML = products.length;
showProducts(products);
const viewBtns = document.querySelectorAll(".view-btn");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".close-modal");
const image = document.getElementById("modal-image");
const title = document.getElementById("modal-name");
const category = document.getElementById("modal-category");
const description = document.getElementById("modal-description");
const price = document.getElementById("modal-price");
const quantity = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decrease");
const increaseBtn = document.getElementById("increase");
const cartBtn = document.querySelector(".add-cart");

let selectedProduct = null;
let q = 1;

viewBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    selectedProduct = products.find((p) => p.id == e.currentTarget.id);

    image.src = selectedProduct.image;
    title.innerText = selectedProduct.name;
    category.innerText = selectedProduct.category;
    description.innerText = selectedProduct.description;
    price.innerText = `RS ${selectedProduct.price}`;

    q = 1;
    quantity.innerText = q;

    modal.classList.add("show");
  });
});

increaseBtn.addEventListener("click", () => {
  q += 1;
  quantity.innerText = q;
});

decreaseBtn.addEventListener("click", () => {
  if (q > 1) {
    q -= 1;
    quantity.innerText = q;
  }
});

cartBtn.addEventListener("click", () => {
  if (!selectedProduct) return;

  const item = {
    id: selectedProduct.id,
    image: selectedProduct.image,
    name: selectedProduct.name,
    quantity: q,
    price: q * selectedProduct.price,
  };

  const isFound = cart.find((c) => c.id == item.id);

  if (isFound) {
    isFound.quantity += item.quantity;
    isFound.price = isFound.quantity * selectedProduct.price;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartLength", JSON.stringify(cart.length));
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
