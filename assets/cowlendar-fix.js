/**
 * Fix for Cowlendar over-aggressive click capture
 * Prevents Cowlendar from interfering with variant picker functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Prevent product title from being clickable via Cowlendar
  const productTitles = document.querySelectorAll('.view-product-title, [ref="productTitleLink"], a.contents');
  productTitles.forEach(element => {
    element.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
    }, true);
    
    element.addEventListener('mouseenter', function(event) {
      event.preventDefault();
      event.stopPropagation();
    }, true);
  });

  // Ensure variant picker functionality works by protecting it from Cowlendar interference
  // Only block hover events that might trigger Cowlendar, but preserve all click and change events
  const variantElements = document.querySelectorAll('variant-picker, .variant-picker, .variant-option, .variant-option__button-label');
  variantElements.forEach(element => {
    // Only prevent hover events from triggering Cowlendar booking overlay
    element.addEventListener('mouseenter', function(event) {
      // Check if this hover would trigger Cowlendar
      const cowlendarForms = document.querySelectorAll('[data-cowlendar-form]');
      let shouldPrevent = false;
      
      cowlendarForms.forEach(form => {
        if (form.contains(event.target) && !event.target.closest('.cowlendar-btn')) {
          shouldPrevent = true;
        }
      });
      
      if (shouldPrevent) {
        event.stopPropagation();
      }
    }, true);
  });

  // Debug logging for variant changes
  const variantInputs = document.querySelectorAll('.variant-picker input[type="radio"]');
  variantInputs.forEach(input => {
    input.addEventListener('change', function(event) {
      console.log('Variant changed:', event.target.value, 'Variant ID:', event.target.dataset.variantId);
    }, false);
  });

  console.log('Cowlendar variant picker fix loaded - protecting', variantElements.length, 'variant elements');
});
