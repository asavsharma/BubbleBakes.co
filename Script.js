/* ============================================================
   Bubble Bakes — Script.js  (vanilla JavaScript only)
   Handles: mobile menu, menu filters, "Order" buttons,
   auto-selecting products, form validation and success modal.
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1. Mobile navigation toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", function () {
    var isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close the mobile menu whenever a link inside it is clicked
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- 2. Menu category filtering ---------- */
  var filterButtons = document.querySelectorAll(".filter-btn");
  var productCards = document.querySelectorAll(".product-card");

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      // Update active button styling
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      button.classList.add("active");

      var filter = button.getAttribute("data-filter");

      // Show or hide cards based on the chosen category
      productCards.forEach(function (card) {
        var category = card.getAttribute("data-category");
        if (filter === "all" || filter === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ---------- 3. Product "Order" buttons ---------- */
  // Clicking an Order button selects that product in the form
  // and smoothly scrolls to the order section.
  var orderButtons = document.querySelectorAll(".btn-order");
  var productSelect = document.getElementById("product");
  var orderSection = document.getElementById("order");

  orderButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var productName = button.getAttribute("data-product");

      // Try to auto-select the product in the dropdown
      if (productSelect) {
        var matched = false;
        for (var i = 0; i < productSelect.options.length; i++) {
          if (productSelect.options[i].value === productName) {
            productSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (matched) {
          productSelect.classList.remove("invalid");
          document.getElementById("err-product").textContent = "";
        }
      }

      // Smooth scroll to the order section
      orderSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- 4. Form validation + success modal ---------- */
  var form = document.getElementById("orderForm");
  var modal = document.getElementById("successModal");
  var modalClose = document.getElementById("modalClose");

  function showError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById("err-" + fieldId);
    if (input) input.classList.add("invalid");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(fieldId) {
    var input = document.getElementById(fieldId);
    var errorEl = document.getElementById("err-" + fieldId);
    if (input) input.classList.remove("invalid");
    if (errorEl) errorEl.textContent = "";
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // no backend — front-end enquiry only

    var valid = true;

    // Name
    var name = document.getElementById("name").value.trim();
    if (name === "") { showError("name", "Please enter your name."); valid = false; }
    else { clearError("name"); }

    // Phone (must be 10 digits)
    var phone = document.getElementById("phone").value.trim();
    var phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) { showError("phone", "Enter a valid 10-digit phone number."); valid = false; }
    else { clearError("phone"); }

    // Product
    var product = document.getElementById("product").value;
    if (product === "") { showError("product", "Please choose a product."); valid = false; }
    else { clearError("product"); }

    // Quantity
    var quantity = parseInt(document.getElementById("quantity").value, 10);
    if (isNaN(quantity) || quantity < 1) { showError("quantity", "Quantity must be at least 1."); valid = false; }
    else { clearError("quantity"); }

    // If everything checks out, show the success modal and reset the form
    if (valid) {
      openModal();
      form.reset();
      document.getElementById("quantity").value = "1";
    }
  });

  /* ---------- 5. Modal open / close ---------- */
  function openModal() {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  modalClose.addEventListener("click", closeModal);

  // Close when clicking the dark backdrop
  modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
  });

  // Close on the Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });

  /* ---------- 6. Scroll reveal animations ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback for very old browsers: just show everything
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- 7. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
