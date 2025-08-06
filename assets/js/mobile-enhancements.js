// mobile-enhancements.js - Enhanced mobile functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Enhanced mobile navigation
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu');
  
  if (hamburger && menu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      menu.classList.toggle('open');
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !expanded);
      
      // Prevent body scroll when menu is open
      if (menu.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 900) {
          hamburger.classList.remove('active');
          menu.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        hamburger.classList.remove('active');
        menu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
  
  // VS Code-style panel resizing
  const controlPanel = document.getElementById('control-panel');
  console.log('Control panel found:', controlPanel);
  if (controlPanel) {
    let isResizing = false;
    let startX, startWidth;
    
    // Add resize handle element
    const resizeHandle = document.createElement('div');
    resizeHandle.id = 'resize-handle';
    resizeHandle.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      width: 6px;
      height: 100%;
      background: transparent;
      cursor: col-resize;
      z-index: 998;
      transition: background 0.2s ease;
    `;
    
    // Add hover effect
    resizeHandle.addEventListener('mouseenter', () => {
      resizeHandle.style.background = 'rgba(1, 89, 65, 0.2)';
    });
    
    resizeHandle.addEventListener('mouseleave', () => {
      if (!isResizing) {
        resizeHandle.style.background = 'transparent';
      }
    });
    
    // Insert the resize handle
    controlPanel.appendChild(resizeHandle);
    
    // Add a subtle visual indicator that the panel is resizable
    const resizeIndicator = document.createElement('div');
    resizeIndicator.style.cssText = `
      position: absolute;
      top: 50%;
      right: 2px;
      transform: translateY(-50%);
      width: 2px;
      height: 20px;
      background: rgba(1, 89, 65, 0.3);
      border-radius: 1px;
      pointer-events: none;
      z-index: 997;
    `;
    controlPanel.appendChild(resizeIndicator);
    
    const startResize = (e) => {
      e.preventDefault();
      isResizing = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX);
      startWidth = controlPanel.offsetWidth;
      
      // Visual feedback
      resizeHandle.style.background = 'rgba(1, 89, 65, 0.4)';
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      // Add event listeners
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      document.addEventListener('touchmove', resize, { passive: false });
      document.addEventListener('touchend', stopResize);
    };
    
    const resize = (e) => {
      if (!isResizing) return;
      
      e.preventDefault();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const deltaX = clientX - startX;
      const newWidth = Math.max(250, Math.min(600, startWidth + deltaX));
      
      controlPanel.style.width = newWidth + 'px';
      
      // Invalidate map size to adjust to new panel width
      if (window.map && typeof window.map.invalidateSize === 'function') {
        window.map.invalidateSize();
      }
    };
    
    const stopResize = () => {
      isResizing = false;
      
      // Remove visual feedback
      resizeHandle.style.background = 'transparent';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Remove event listeners
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.removeEventListener('touchmove', resize);
      document.removeEventListener('touchend', stopResize);
      
      // Final map size adjustment
      if (window.map && typeof window.map.invalidateSize === 'function') {
        setTimeout(() => window.map.invalidateSize(), 100);
      }
    };
    
    // Add event listeners to the resize handle
    resizeHandle.addEventListener('mousedown', startResize);
    resizeHandle.addEventListener('touchstart', startResize, { passive: false });
    
    // Also allow resizing by clicking on the right edge of the panel
    controlPanel.addEventListener('mousedown', (e) => {
      const rect = controlPanel.getBoundingClientRect();
      const handleWidth = 10; // Slightly larger touch area
      if (e.clientX >= rect.right - handleWidth && e.clientX <= rect.right) {
        startResize(e);
      }
    });
    
    controlPanel.addEventListener('touchstart', (e) => {
      const rect = controlPanel.getBoundingClientRect();
      const handleWidth = 20; // Larger touch target for mobile
      const touchX = e.touches[0].clientX;
      if (touchX >= rect.right - handleWidth && touchX <= rect.right) {
        startResize(e);
      }
    });
    
    // Disable resize on mobile devices
    if (window.innerWidth <= 700) {
      resizeHandle.style.display = 'none';
    }
    
    // Re-enable resize when screen size changes
    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) {
        resizeHandle.style.display = 'block';
      } else {
        resizeHandle.style.display = 'none';
      }
    });
  }
  
  // Enhanced carousel for mobile
  const carousel = document.getElementById('image-carousel');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const images = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    let isAnimating = false;
    
    function updateCarousel() {
      if (isAnimating) return;
      isAnimating = true;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      setTimeout(() => { isAnimating = false; }, 500);
    }
    
    function showPrev() {
      if (isAnimating) return;
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateCarousel();
    }
    
    function showNext() {
      if (isAnimating) return;
      currentIndex = (currentIndex + 1) % images.length;
      updateCarousel();
    }
    
    // Button controls
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);
    
    // Touch/swipe support for mobile
    let startX = null;
    let startY = null;
    let isDragging = false;
    
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = false;
    });
    
    track.addEventListener('touchmove', e => {
      if (startX === null) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      // Only start dragging if horizontal movement is greater than vertical
      if (diffX > diffY && diffX > 10) {
        isDragging = true;
        e.preventDefault();
      }
    });
    
    track.addEventListener('touchend', e => {
      if (startX === null || !isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          showPrev();
        } else {
          showNext();
        }
      }
      
      startX = null;
      startY = null;
      isDragging = false;
    });
    
    // Auto-advance carousel on mobile (optional)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
      if (window.innerWidth <= 600) {
        autoAdvanceInterval = setInterval(showNext, 5000);
      }
    }
    
    function stopAutoAdvance() {
      if (autoAdvanceInterval) {
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = null;
      }
    }
    
    // Start auto-advance when carousel is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoAdvance();
        } else {
          stopAutoAdvance();
        }
      });
    });
    
    observer.observe(carousel);
    
    // Pause auto-advance on user interaction
    carousel.addEventListener('mouseenter', stopAutoAdvance);
    carousel.addEventListener('mouseleave', startAutoAdvance);
    carousel.addEventListener('touchstart', stopAutoAdvance);
    carousel.addEventListener('touchend', () => {
      setTimeout(startAutoAdvance, 3000);
    });
    
    updateCarousel();
  }
  
  // Enhanced gallery lightbox for mobile
  const galleryThumbs = document.querySelectorAll('.gallery-thumb');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  if (galleryThumbs.length > 0 && lightboxOverlay) {
    let currentImageIndex = 0;
    const images = Array.from(galleryThumbs);
    
    function openLightbox(index) {
      currentImageIndex = index;
      const img = images[index];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxOverlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Focus management
      lightboxClose.focus();
    }
    
    function closeLightbox() {
      lightboxOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
    
    function showPrev() {
      currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
      const img = images[currentImageIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    
    function showNext() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      const img = images[currentImageIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }
    
    // Event listeners
    galleryThumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => openLightbox(index));
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });
    
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (lightboxOverlay.style.display === 'flex') {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowLeft') {
          showPrev();
        } else if (e.key === 'ArrowRight') {
          showNext();
        }
      }
    });
    
    // Touch/swipe support for lightbox
    let startX = null;
    
    lightboxOverlay.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    
    lightboxOverlay.addEventListener('touchend', e => {
      if (startX === null) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX;
      const threshold = 50;
      
      if (Math.abs(diffX) > threshold) {
        if (diffX > 0) {
          showPrev();
        } else {
          showNext();
        }
      }
      
      startX = null;
    });
  }
  
  // Enhanced touch targets for mobile
  const touchTargets = document.querySelectorAll('button, a, input, select');
  touchTargets.forEach(target => {
    const rect = target.getBoundingClientRect();
    if (rect.width < 48 || rect.height < 48) {
      target.style.minHeight = '48px';
      target.style.minWidth = '48px';
    }
  });
  
  // Improved scroll behavior for mobile
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Mobile-specific performance optimizations
  if (window.innerWidth <= 600) {
    // Reduce animations on mobile for better performance
    const animatedElements = document.querySelectorAll('.content-section, .team-card');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform';
    });
    
    // Lazy load images for better performance
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
  
  // Handle orientation changes
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Recalculate carousel if it exists
      const carousel = document.getElementById('image-carousel');
      if (carousel) {
        const track = carousel.querySelector('.carousel-track');
        if (track) {
          track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
      }
      
      // Recalculate touch targets
      const touchTargets = document.querySelectorAll('button, a, input, select');
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        if (rect.width < 48 || rect.height < 48) {
          target.style.minHeight = '48px';
          target.style.minWidth = '48px';
        }
      });
    }, 100);
  });
  
  // Enhanced accessibility for mobile
  const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
  focusableElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '3px solid #2563eb';
      element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    });
  });
  
  // Prevent zoom on double tap for iOS
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Add loading states for better UX
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', () => {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }
    });
  });
  
  console.log('Mobile enhancements loaded successfully');
}); 