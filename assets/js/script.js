'use strict';

/**
 * element toggle function
 */
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/**
 * sidebar toggle
 */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

/**
 * page navigation
 */
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach((link, index) => {
  link.addEventListener("click", function () {
    pages.forEach(page => page.classList.remove("active"));
    navLinks.forEach(nav => nav.classList.remove("active"));

    pages[index].classList.add("active");
    this.classList.add("active");

    window.scrollTo(0, 0);
  });
});

/**
 * form validation
 */
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

formInputs.forEach(input => {
  input.addEventListener("input", function () {
    let filled = [...formInputs].every(i => i.value.trim() !== "");
    formBtn.disabled = !filled;
  });
});

/**
 * testimonials modal (optional)
 */
const testimonialsItems = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

if (testimonialsItems.length) {
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  testimonialsItems.forEach(item => {
    item.addEventListener("click", function () {
      modalContainer.classList.add("active");
      overlay.classList.add("active");

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalTitle.textContent = this.querySelector("[data-testimonials-title]").textContent;
      modalText.textContent = this.querySelector("[data-testimonials-text]").textContent;
    });
  });

  modalCloseBtn.addEventListener("click", function () {
    modalContainer.classList.remove("active");
    overlay.classList.remove("active");
  });
}
