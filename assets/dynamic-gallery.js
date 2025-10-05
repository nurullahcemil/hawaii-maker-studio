/**
 * Dynamic Image Gallery Component
 * Handles slideshow functionality, zoom modal, and responsive behavior
 */

class DynamicGallery {
  constructor(container) {
    this.container = container;
    this.slideshow = container.querySelector('.dynamic-gallery__slideshow');
    this.masonryGrid = container.querySelector('.dynamic-gallery__grid--masonry');
    this.images = [];
    this.currentSlide = 0;
    this.autoplayTimer = null;
    this.columnHeights = [];
    
    this.init();
  }

  init() {
    this.setupSlideshow();
    this.setupMasonry();
    this.setupZoom();
    this.setupKeyboardNavigation();
    
    // Re-layout on window resize
    window.addEventListener('resize', () => {
      if (this.masonryGrid) {
        this.layoutMasonry();
      }
    });
  }

  setupMasonry() {
    if (!this.masonryGrid) return;
    
    // Wait for images to load before positioning
    const images = this.masonryGrid.querySelectorAll('img');
    let loadedCount = 0;
    
    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        this.layoutMasonry();
      }
    };

    images.forEach(img => {
      if (img.complete) {
        checkAllLoaded();
      } else {
        img.addEventListener('load', checkAllLoaded);
        img.addEventListener('error', checkAllLoaded);
      }
    });

    // If no images or all already loaded
    if (images.length === 0) {
      this.layoutMasonry();
    }
  }

  layoutMasonry() {
    if (!this.masonryGrid) return;

    const items = this.masonryGrid.querySelectorAll('.dynamic-gallery__grid-item');
    if (items.length === 0) return;

    // Get current column count based on screen size
    const computedStyle = getComputedStyle(this.container);
    let columnCount;
    let gap;
    
    if (window.innerWidth >= 990) {
      columnCount = parseInt(computedStyle.getPropertyValue('--columns-desktop')) || 4;
      gap = 24;
    } else if (window.innerWidth >= 750) {
      columnCount = parseInt(computedStyle.getPropertyValue('--columns-tablet')) || 3;
      gap = 20;
    } else {
      columnCount = parseInt(computedStyle.getPropertyValue('--columns-mobile')) || 2;
      gap = 16;
    }

    // Initialize column heights
    this.columnHeights = new Array(columnCount).fill(0);
    
    // Position each item
    items.forEach((item, index) => {
      // Find shortest column
      const shortestColumnIndex = this.columnHeights.indexOf(Math.min(...this.columnHeights));
      
      // Calculate position
      const itemWidth = item.offsetWidth;
      const itemHeight = item.offsetHeight;
      const leftPosition = shortestColumnIndex * (itemWidth + gap);
      const topPosition = this.columnHeights[shortestColumnIndex];
      
      // Position the item
      item.style.left = `${leftPosition}px`;
      item.style.top = `${topPosition}px`;
      
      // Update column height
      this.columnHeights[shortestColumnIndex] += itemHeight + gap;
    });

    // Set container height
    const maxHeight = Math.max(...this.columnHeights);
    this.masonryGrid.style.height = `${maxHeight}px`;
  }

  setupSlideshow() {
    if (!this.slideshow) return;

    const slides = this.slideshow.querySelectorAll('.slideshow__slide');
    const prevBtn = this.slideshow.querySelector('.slideshow__btn--prev');
    const nextBtn = this.slideshow.querySelector('.slideshow__btn--next');
    const dots = this.slideshow.querySelectorAll('.slideshow__dot');
    
    this.images = Array.from(slides).map(slide => ({
      element: slide,
      image: slide.querySelector('.dynamic-gallery__image')
    }));

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Dot navigation
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Auto-play
    const autoplay = this.slideshow.dataset.autoplay === 'true';
    const autoplaySpeed = parseInt(this.slideshow.dataset.autoplaySpeed) * 1000 || 5000;
    
    if (autoplay && this.images.length > 1) {
      this.startAutoplay(autoplaySpeed);
      
      // Pause on hover
      this.slideshow.addEventListener('mouseenter', () => this.stopAutoplay());
      this.slideshow.addEventListener('mouseleave', () => this.startAutoplay(autoplaySpeed));
    }

    // Touch/swipe support
    this.setupTouchNavigation();
  }

  setupTouchNavigation() {
    if (!this.slideshow) return;

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    this.slideshow.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    this.slideshow.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent scrolling
    });

    this.slideshow.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // Only trigger if horizontal swipe is more significant than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    });
  }

  goToSlide(index) {
    if (index < 0 || index >= this.images.length) return;

    // Hide current slide
    const currentSlideElement = this.images[this.currentSlide].element;
    currentSlideElement.setAttribute('data-active', 'false');
    currentSlideElement.style.display = 'none';

    // Show new slide
    this.currentSlide = index;
    const newSlideElement = this.images[this.currentSlide].element;
    newSlideElement.setAttribute('data-active', 'true');
    newSlideElement.style.display = 'block';

    // Update dots
    this.updateDots();
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.images.length;
    this.goToSlide(nextIndex);
  }

  previousSlide() {
    const prevIndex = this.currentSlide === 0 ? this.images.length - 1 : this.currentSlide - 1;
    this.goToSlide(prevIndex);
  }

  updateDots() {
    const dots = this.slideshow.querySelectorAll('.slideshow__dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('slideshow__dot--active', index === this.currentSlide);
    });
  }

  startAutoplay(speed) {
    this.stopAutoplay();
    this.autoplayTimer = setInterval(() => {
      this.nextSlide();
    }, speed);
  }

  stopAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  setupZoom() {
    const zoomButtons = this.container.querySelectorAll('.dynamic-gallery__zoom-btn');
    const modal = this.container.querySelector('.dynamic-gallery__zoom-modal');
    
    if (!modal) return;

    const modalImage = modal.querySelector('.dynamic-gallery__zoom-image');
    const closeBtn = modal.querySelector('.dynamic-gallery__zoom-close');
    const prevBtn = modal.querySelector('.dynamic-gallery__zoom-prev');
    const nextBtn = modal.querySelector('.dynamic-gallery__zoom-next');
    
    let currentZoomIndex = 0;
    const zoomImages = Array.from(zoomButtons).map(btn => {
      const img = btn.querySelector('.dynamic-gallery__image');
      return {
        src: img.src.replace('width=600', 'width=1200').replace('width=800', 'width=1200'),
        alt: img.alt
      };
    });

    // Open zoom modal
    zoomButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        currentZoomIndex = index;
        this.openZoomModal(modal, modalImage, zoomImages[currentZoomIndex]);
      });
    });

    // Close modal
    closeBtn.addEventListener('click', () => {
      this.closeZoomModal(modal);
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeZoomModal(modal);
      }
    });

    // Navigation in zoom
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        currentZoomIndex = currentZoomIndex === 0 ? zoomImages.length - 1 : currentZoomIndex - 1;
        this.updateZoomImage(modalImage, zoomImages[currentZoomIndex]);
      });

      nextBtn.addEventListener('click', () => {
        currentZoomIndex = (currentZoomIndex + 1) % zoomImages.length;
        this.updateZoomImage(modalImage, zoomImages[currentZoomIndex]);
      });
    }
  }

  openZoomModal(modal, modalImage, imageData) {
    modal.setAttribute('aria-hidden', 'false');
    modalImage.src = imageData.src;
    modalImage.alt = imageData.alt;
    document.body.style.overflow = 'hidden';
  }

  closeZoomModal(modal) {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  updateZoomImage(modalImage, imageData) {
    modalImage.src = imageData.src;
    modalImage.alt = imageData.alt;
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      const modal = this.container.querySelector('.dynamic-gallery__zoom-modal');
      const isModalOpen = modal && modal.getAttribute('aria-hidden') === 'false';

      if (isModalOpen) {
        switch (e.key) {
          case 'Escape':
            this.closeZoomModal(modal);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            modal.querySelector('.dynamic-gallery__zoom-prev')?.click();
            break;
          case 'ArrowRight':
            e.preventDefault();
            modal.querySelector('.dynamic-gallery__zoom-next')?.click();
            break;
        }
      } else if (this.slideshow && document.activeElement.closest('.dynamic-gallery') === this.container) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.previousSlide();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.nextSlide();
            break;
        }
      }
    });
  }
}

// Initialize galleries when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const galleries = document.querySelectorAll('.dynamic-gallery');
  galleries.forEach(gallery => {
    new DynamicGallery(gallery);
  });
});

// Re-initialize on section reloads (Shopify theme editor)
document.addEventListener('shopify:section:load', (event) => {
  const galleries = event.target.querySelectorAll('.dynamic-gallery');
  galleries.forEach(gallery => {
    new DynamicGallery(gallery);
  });
});

export default DynamicGallery;
