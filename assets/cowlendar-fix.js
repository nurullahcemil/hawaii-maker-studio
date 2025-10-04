/**
 * Fix for Cowlendar over-aggressive click capture
 * Prevents Cowlendar from interfering with variant picker functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Prevent Cowlendar from capturing variant picker clicks
  const variantPickers = document.querySelectorAll('variant-picker, .variant-picker, .variant-option, .variant-option__button-label');
  
  variantPickers.forEach(element => {
    element.addEventListener('click', function(event) {
      // Only stop propagation for Cowlendar-specific events, not all events
      // This allows variant update events to reach price components
      if (event.target.closest('.cowlendar-btn') || event.target.classList.contains('cowlendar-btn')) {
        return; // Let Cowlendar handle its own buttons
      }
      
      // For variant picker elements, we don't want to stop all propagation
      // Just prevent the event from reaching Cowlendar's global handlers
      const cowlendarElements = document.querySelectorAll('[data-cowlendar-form], .cowlendar-btn, .cow-form-valid-variant');
      cowlendarElements.forEach(cowEl => {
        if (cowEl.contains(event.target) && !event.target.closest('variant-picker')) {
          event.stopPropagation();
        }
      });
    }, true); // Use capture phase to intercept before Cowlendar
    
    element.addEventListener('mouseenter', function(event) {
      // Prevent hover events from triggering Cowlendar, but allow other events
      if (!event.target.closest('.cowlendar-btn')) {
        event.stopPropagation();
      }
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
