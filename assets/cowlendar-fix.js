/**
 * Fix for Cowlendar over-aggressive click capture
 * Prevents Cowlendar from interfering with variant picker functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Prevent Cowlendar from capturing variant picker clicks
  const variantPickers = document.querySelectorAll('variant-picker, .variant-picker, .variant-option, .variant-option__button-label');
  
  variantPickers.forEach(element => {
    element.addEventListener('click', function(event) {
      // Stop event from bubbling to Cowlendar handlers
      event.stopPropagation();
    }, true); // Use capture phase to intercept before Cowlendar
    
    element.addEventListener('mouseenter', function(event) {
      // Prevent hover events from triggering Cowlendar
      event.stopPropagation();
    }, true);
  });

  // Prevent product title from being clickable via Cowlendar
  const productTitles = document.querySelectorAll('.view-product-title, [ref="productTitleLink"], a.contents');
  productTitles.forEach(element => {
    element.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    }, true);
  });

  // Ensure variant selection works properly
  const variantInputs = document.querySelectorAll('.variant-picker input[type="radio"]');
  variantInputs.forEach(input => {
    input.addEventListener('change', function(event) {
      // Allow variant picker to handle the change normally
      event.stopPropagation();
    }, true);
  });

  console.log('Cowlendar variant picker fix loaded');
});
