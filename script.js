// Utility functions
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

const formatDateUTC = (date) => {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    hour12: false
  }).format(date).replace(/(\d{4})-(\d{2})-(\d{2}), (\d{2}):(\d{2}):(\d{2})/, '$1-$2-$3 $4:$5:$6');
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Time Manager Class
class TimeManager {
  constructor() {
    this.timeElements = {
      current: document.querySelector('.current-time'),
      utc: document.querySelector('.utc-time'),
      local: document.querySelector('.local-time')
    };
    this.userLogin = 'Sharmin8014';
    this.isVisible = true;
    this.updateInterval = null;
    this.setupVisibilityHandler();
    this.init();
  }

  init() {
    this.updateAllTimes();
    this.startUpdateInterval();
    this.addUserInfo();
  }

  updateAllTimes() {
    const now = new Date();
    
    if (this.timeElements.current) {
      this.timeElements.current.textContent = formatDate(now);
    }
    
    if (this.timeElements.utc) {
      this.timeElements.utc.textContent = `UTC: ${formatDateUTC(now)}`;
    }
    
    if (this.timeElements.local) {
      this.timeElements.local.textContent = `Local: ${formatDate(now)}`;
    }

    // Update page title with current time
    if (document.title && !document.title.includes('•')) {
      document.title = `${document.title} • ${formatDateUTC(now)}`;
    }
  }

  startUpdateInterval() {
    this.updateInterval = setInterval(() => {
      if (this.isVisible) {
        this.updateAllTimes();
      }
    }, 1000);
  }

  setupVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.updateAllTimes();
      }
    });
  }

  addUserInfo() {
    const userInfoElement = document.querySelector('.user-info');
    if (userInfoElement) {
      userInfoElement.textContent = `Welcome, ${this.userLogin}`;
    } else {
      // Create user info element if it doesn't exist
      const userInfo = document.createElement('div');
      userInfo.className = 'user-info';
      userInfo.textContent = `Welcome, ${this.userLogin}`;
      
      const header = document.querySelector('header .header-content');
      if (header) {
        header.prepend(userInfo);
      }
    }
  }

  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Enhanced Modal Controller Class
class ModalController {
  constructor() {
    this.modal = document.getElementById('modal');
    this.modalPdf = document.getElementById('modal-pdf');
    this.closeBtn = document.querySelector('.close-modal');
    this.isAnimating = false;
    this.isOpen = false;
    this.loadingStates = new Map();
    this.setupEventListeners();
    this.setupKeyboardNavigation();
  }

  setupEventListeners() {
    // View PDF buttons
    document.querySelectorAll('.view-pdf').forEach(button => {
      button.addEventListener('click', (e) => this.openModal(e));
    });

    // Close button
    this.closeBtn?.addEventListener('click', () => this.closeModal());

    // Click outside modal
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.closeModal();
      }
    });

    // Handle PDF load events
    if (this.modalPdf) {
      this.modalPdf.addEventListener('load', () => {
        this.handlePdfLoad();
      });

      this.modalPdf.addEventListener('error', () => {
        this.handlePdfError();
      });
    }
  }

  setupKeyboardNavigation() {
    if (this.modal) {
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      this.modal.setAttribute('aria-labelledby', 'modal-title');
    }
  }

  async openModal(event) {
    if (this.isAnimating) return;
    
    try {
      this.isAnimating = true;
      const button = event.currentTarget;
      const pdfPath = button.getAttribute('data-pdf');
      const pdfTitle = button.getAttribute('data-title') || 'PDF Document';
      
      if (!pdfPath) {
        throw new Error('PDF path not found');
      }

      // Store button reference
      this.currentButton = button;
      
      // Show loading state
      this.setButtonState(button, 'loading');
      
      // Set modal title
      const modalTitle = this.modal.querySelector('#modal-title');
      if (modalTitle) {
        modalTitle.textContent = pdfTitle;
      }

      // Prepare modal
      this.modal.style.display = 'flex';
      this.modal.style.opacity = '0';
      this.modal.style.transform = 'scale(0.95)';
      
      // Focus management
      this.previousActiveElement = document.activeElement;
      
      // Load PDF
      this.modalPdf.src = pdfPath;

      // Animate modal opening
      await this.animateIn();
      
      this.isOpen = true;
      
      // Focus modal for keyboard navigation
      this.modal.focus();

    } catch (error) {
      console.error('Error opening modal:', error);
      this.showNotification('Failed to load PDF. Please try again.', 'error');
      this.setButtonState(this.currentButton, 'error');
    } finally {
      this.isAnimating = false;
    }
  }

  async closeModal() {
    if (this.isAnimating || !this.isOpen) return;

    try {
      this.isAnimating = true;
      
      // Animate modal closing
      await this.animateOut();
      
      // Clean up
      this.modal.style.display = 'none';
      this.modalPdf.src = '';
      this.isOpen = false;
      
      // Reset button state
      if (this.currentButton) {
        this.setButtonState(this.currentButton, 'default');
      }
      
      // Restore focus
      if (this.previousActiveElement) {
        this.previousActiveElement.focus();
      }
      
    } catch (error) {
      console.error('Error closing modal:', error);
    } finally {
      this.isAnimating = false;
    }
  }

  async animateIn() {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        this.modal.style.opacity = '1';
        this.modal.style.transform = 'scale(1)';
        setTimeout(resolve, 300);
      });
    });
  }

  async animateOut() {
    return new Promise(resolve => {
      this.modal.style.opacity = '0';
      this.modal.style.transform = 'scale(0.95)';
      setTimeout(resolve, 300);
    });
  }

  handlePdfLoad() {
    if (this.currentButton) {
      this.setButtonState(this.currentButton, 'success');
      setTimeout(() => {
        this.setButtonState(this.currentButton, 'default');
      }, 2000);
    }
  }

  handlePdfError() {
    this.showNotification('Failed to load PDF document.', 'error');
    if (this.currentButton) {
      this.setButtonState(this.currentButton, 'error');
    }
    this.closeModal();
  }

  setButtonState(button, state) {
    if (!button) return;
    
    // Remove all state classes
    button.classList.remove('loading', 'success', 'error');
    
    // Add new state
    if (state !== 'default') {
      button.classList.add(state);
    }
    
    // Update accessibility
    switch (state) {
      case 'loading':
        button.setAttribute('aria-busy', 'true');
        button.setAttribute('aria-label', 'Loading PDF...');
        break;
      case 'success':
        button.setAttribute('aria-busy', 'false');
        button.setAttribute('aria-label', 'PDF loaded successfully');
        break;
      case 'error':
        button.setAttribute('aria-busy', 'false');
        button.setAttribute('aria-label', 'Failed to load PDF');
        break;
      default:
        button.removeAttribute('aria-busy');
        button.removeAttribute('aria-label');
        break;
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icon = this.getNotificationIcon(type);
    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">&times;</button>
    `;

    document.body.appendChild(notification);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => this.removeNotification(notification));

    // Show notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification);
    }, 5000);
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }

  removeNotification(notification) {
    if (notification && notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }
}

// Enhanced Abstract Controller Class
class AbstractController {
  constructor() {
    this.activeAbstracts = new Set();
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.querySelectorAll('.toggle-abstract-btn').forEach(button => {
      button.addEventListener('click', (e) => this.toggleAbstract(e));
    });
  }

  async toggleAbstract(event) {
    const button = event.currentTarget;
    const abstractId = button.getAttribute('aria-controls');
    const abstract = document.getElementById(abstractId);
    
    if (!abstract) {
      console.warn(`Abstract element with ID "${abstractId}" not found`);
      return;
    }

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      await this.collapseAbstract(button, abstract, abstractId);
    } else {
      await this.expandAbstract(button, abstract, abstractId);
    }
  }

  async expandAbstract(button, abstract, abstractId) {
    // Close other abstracts if needed
    this.activeAbstracts.forEach(id => {
      if (id !== abstractId) {
        const otherAbstract = document.getElementById(id);
        const otherButton = document.querySelector(`[aria-controls="${id}"]`);
        if (otherAbstract && otherButton) {
          this.collapseAbstract(otherButton, otherAbstract, id);
        }
      }
    });

    // Update state
    button.setAttribute('aria-expanded', 'true');
    this.activeAbstracts.add(abstractId);
    
    // Calculate target height
    abstract.style.height = 'auto';
    const targetHeight = abstract.scrollHeight;
    abstract.style.height = '0px';
    
    // Animate expansion
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        abstract.style.height = `${targetHeight}px`;
        abstract.style.opacity = '1';
        setTimeout(resolve, 300);
      });
    });
    
    // Update button with animation
    this.updateButtonText(button, 'Hide Abstract', true);
    
    // Set final height to auto for responsive behavior
    abstract.style.height = 'auto';
  }

  async collapseAbstract(button, abstract, abstractId) {
    // Update state
    button.setAttribute('aria-expanded', 'false');
    this.activeAbstracts.delete(abstractId);
    
    // Set explicit height before animating
    const currentHeight = abstract.scrollHeight;
    abstract.style.height = `${currentHeight}px`;
    
    // Animate collapse
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        abstract.style.height = '0px';
        abstract.style.opacity = '0';
        setTimeout(resolve, 300);
      });
    });
    
    // Update button with animation
    this.updateButtonText(button, 'Show Abstract', false);
  }

  updateButtonText(button, text, isExpanded) {
    button.classList.add('rotating');
    
    setTimeout(() => {
      button.textContent = text;
      button.classList.remove('rotating');
      
      // Update icon if present
      const icon = button.querySelector('.toggle-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    }, 150);
  }
}

// Performance Monitor Class
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      renderTime: 0,
      interactionTime: 0
    };
    this.init();
  }

  init() {
    // Measure page load time
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
      this.logMetrics();
    });

    // Measure largest contentful paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.renderTime = lastEntry.startTime;
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }
  }

  logMetrics() {
    console.group('Performance Metrics');
    console.log(`Page Load Time: ${this.metrics.loadTime.toFixed(2)}ms`);
    console.log(`Render Time: ${this.metrics.renderTime.toFixed(2)}ms`);
    console.groupEnd();
  }
}

// Theme Manager Class
class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
    this.watchSystemTheme();
  }

  getStoredTheme() {
    return localStorage.getItem('theme');
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
  }

  setupThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggleTheme());
    }
  }

  watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Enhanced Scroll Manager
class ScrollManager {
  constructor() {
    this.scrollPosition = 0;
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.setupSmoothScrolling();
    this.setupScrollAnimations();
    this.setupScrollToTop();
    this.trackScrollPosition();
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('header')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible
