import { cart, fav, products } from "./products.js";

const container = document.getElementById("products");
const categoryBtns = document.querySelectorAll(".category");
const count = document.getElementById("product-count");
const sort = document.getElementById("sort");
const cartLength = document.getElementById("cart");
const search = document.getElementById("search");

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
let selectedCategory = "all";
let searchTerm = "";

cartLength.innerHTML = localStorage.getItem("cartLength") || 0;

const showProducts = (productList) => {
  container.innerHTML = "";

  count.innerHTML = productList.length;

  if (productList.length === 0) {
    return;
  }

  productList.forEach((p) => {
    const isFavorite = fav.some((f) => f.id == p.id);

    container.innerHTML += `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}" />

          <button 
            class="favorite" 
            id="${p.id}"
            style="background-color: ${
              isFavorite ? "var(--danger)" : "rgba(10, 10, 12, 0.8)"
            }"
          >
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

            <button class="view-btn" id="${p.id}">
              View Details
            </button>
          </div>
        </div>
      </div>
    `;
  });
};

const getFilteredProducts = () => {
  let filteredProducts = [...products];

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (searchTerm.trim() !== "") {
    filteredProducts = filteredProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }

  return filteredProducts;
};

const refreshProducts = () => {
  showProducts(getFilteredProducts());
};

categoryBtns.forEach((element) => {
  element.addEventListener("click", () => {
    categoryBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    element.classList.add("active");

    selectedCategory = element.dataset.category;

    refreshProducts();
  });
});

search.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  refreshProducts();
});

sort.addEventListener("change", (e) => {
  let filteredProducts = getFilteredProducts();

  if (e.target.value === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  showProducts(filteredProducts);
});

container.addEventListener("click", (e) => {
  const favoriteBtn = e.target.closest(".favorite");
  const viewBtn = e.target.closest(".view-btn");

  if (favoriteBtn) {
    const selected = products.find(
      (p) => p.id == favoriteBtn.id
    );

    if (!selected) return;

    const index = fav.findIndex((f) => f.id == selected.id);

    if (index !== -1) {
      fav.splice(index, 1);
      favoriteBtn.style.backgroundColor =
        "rgba(10, 10, 12, 0.8)";
    } else {
      fav.push(selected);
      favoriteBtn.style.backgroundColor = "var(--danger)";
    }

    localStorage.setItem("favorites", JSON.stringify(fav));

    return;
  }

  if (viewBtn) {
    selectedProduct = products.find(
      (p) => p.id == viewBtn.id
    );

    if (!selectedProduct) return;

    image.src = selectedProduct.image;
    title.innerText = selectedProduct.name;
    category.innerText = selectedProduct.category;
    description.innerText = selectedProduct.description;
    price.innerText = `RS ${selectedProduct.price}`;

    q = 1;
    quantity.innerText = q;

    modal.classList.add("show");
  }
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
    isFound.price =
      isFound.quantity * selectedProduct.price;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartLength", JSON.stringify(cart.length));

  cartLength.innerHTML = cart.length;

  modal.classList.remove("show");
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

refreshProducts();