import { products } from "./products.js";

const container = document.getElementById("products");
const categoryBtns = document.querySelectorAll(".category");
const count = document.getElementById("product-count");
const sort = document.getElementById("sort");

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

viewBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const selectedProduct = products.find((p) => p.id == e.target.id);

    console.log(selectedProduct);

    modal.classList.add("show");
  });
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});
