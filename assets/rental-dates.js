import { Component } from '@theme/component';

/**
 * @typedef {object} RentalDatesRefs
 * @property {HTMLInputElement} startDate - The start date input
 * @property {HTMLInputElement} endDate - The end date input
 * @property {HTMLElement} summary - The rental summary container
 * @property {HTMLElement} durationText - The duration display element
 * @property {HTMLElement} totalPrice - The total price display element
 * @property {HTMLInputElement} durationInput - Hidden duration input
 * @property {HTMLInputElement} totalInput - Hidden total input
 */

/**
 * Rental dates component for handling date selection and price calculation
 * @extends Component<RentalDatesRefs>
 */
class RentalDatesComponent extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.updateEndDateMin();
  }

  /**
   * Handle date change events
   */
  handleDateChange() {
    this.updateEndDateMin();
    this.calculateRental();
  }

  /**
   * Update the minimum date for end date based on start date
   */
  updateEndDateMin() {
    const { startDate, endDate } = this.refs;
    
    if (startDate.value) {
      // Set end date minimum to the day after start date
      const startDateObj = new Date(startDate.value);
      startDateObj.setDate(startDateObj.getDate() + 1);
      const minEndDate = startDateObj.toISOString().split('T')[0];
      endDate.min = minEndDate;
      
      // Clear end date if it's before the new minimum
      if (endDate.value && endDate.value <= startDate.value) {
        endDate.value = '';
      }
    }
  }

  /**
   * Calculate rental duration and total price
   */
  calculateRental() {
    const { startDate, endDate, summary, durationText, totalPrice, durationInput, totalInput } = this.refs;
    
    if (!startDate.value || !endDate.value) {
      summary.style.display = 'none';
      if (durationInput) durationInput.value = '';
      if (totalInput) totalInput.value = '';
      return;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    
    // Calculate days between dates
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff <= 0) {
      summary.style.display = 'none';
      if (durationInput) durationInput.value = '';
      if (totalInput) totalInput.value = '';
      return;
    }

    // Update duration display and hidden input
    const durationLabel = daysDiff === 1 ? '1 day' : `${daysDiff} days`;
    durationText.textContent = durationLabel;
    if (durationInput) durationInput.value = durationLabel;

    // Calculate and display total price if daily rate is set
    const dailyRate = parseFloat(this.dataset.dailyRate) || 0;
    if (dailyRate > 0 && totalPrice && totalInput) {
      const total = dailyRate * daysDiff;
      const formattedTotal = this.formatPrice(total);
      totalPrice.textContent = formattedTotal;
      totalInput.value = formattedTotal;
    }

    // Show the summary
    summary.style.display = 'block';

    // Dispatch custom event for other components to listen to
    this.dispatchEvent(new CustomEvent('rental:calculated', {
      detail: {
        startDate: startDate.value,
        endDate: endDate.value,
        days: daysDiff,
        dailyRate: dailyRate,
        total: dailyRate * daysDiff
      }
    }));
  }

  /**
   * Format price for display
   * @param {number} price - The price to format
   * @returns {string} Formatted price string
   */
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  /**
   * Get the current rental data
   * @returns {object|null} Rental data or null if incomplete
   */
  getRentalData() {
    const { startDate, endDate } = this.refs;
    
    if (!startDate.value || !endDate.value) {
      return null;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const dailyRate = parseFloat(this.dataset.dailyRate) || 0;

    return {
      startDate: startDate.value,
      endDate: endDate.value,
      days: daysDiff,
      dailyRate: dailyRate,
      total: dailyRate * daysDiff
    };
  }

  /**
   * Set rental dates programmatically
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   */
  setDates(startDate, endDate) {
    const { startDate: startInput, endDate: endInput } = this.refs;
    
    startInput.value = startDate;
    endInput.value = endDate;
    
    this.handleDateChange();
  }

  /**
   * Clear all rental dates
   */
  clearDates() {
    const { startDate, endDate, summary, durationInput, totalInput } = this.refs;
    
    startDate.value = '';
    endDate.value = '';
    summary.style.display = 'none';
    
    if (durationInput) durationInput.value = '';
    if (totalInput) totalInput.value = '';
  }

  /**
   * Validate rental dates
   * @returns {boolean} True if dates are valid
   */
  validateDates() {
    const { startDate, endDate } = this.refs;
    
    if (!startDate.value || !endDate.value) {
      return false;
    }

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if start date is not in the past
    if (start < today) {
      return false;
    }

    // Check if end date is after start date
    if (end <= start) {
      return false;
    }

    return true;
  }
}

// Register the custom element
if (!customElements.get('rental-dates-component')) {
  customElements.define('rental-dates-component', RentalDatesComponent);
}

export default RentalDatesComponent;
