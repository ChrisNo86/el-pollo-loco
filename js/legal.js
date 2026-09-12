/**
 * @module "legal.js"
 */

/**
 * Selector for the elements that must NOT trigger the "click outside closes"
 * behavior: the content box itself and the top navigation icons, which
 * already have their own click handlers.
 */
const KEEP_OPEN_SELECTOR = ".imprint_site, .privacy_Policy_site, .privacy_policy, .imprint, .el_pollo_loco_logo";

/**
 * Navigates back to the start screen, closing the legal page.
 */
function closeLegalPage() {
  window.location.href = "./index.html";
}

/**
 * Closes the legal page when the user clicks outside its content box.
 * @param {MouseEvent} event - The click event on the page.
 */
function closeOnOutsideClick(event) {
  if (!event.target.closest(KEEP_OPEN_SELECTOR)) closeLegalPage();
}

/**
 * Closes the legal page when the user presses the Escape key.
 * @param {KeyboardEvent} event - The keydown event on the page.
 */
function closeOnEscape(event) {
  if (event.key === "Escape") closeLegalPage();
}

document.addEventListener("click", closeOnOutsideClick);
document.addEventListener("keydown", closeOnEscape);
