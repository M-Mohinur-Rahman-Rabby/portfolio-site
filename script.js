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

// Update current time
const updateCurrentTime = () => {
  const timeElement = document.querySelector('.current-time');
  if (timeElement) {
    timeElement.textContent = formatDate(new Date());
  }
};

// Initialize time and update every second
updateCurrentTime();
setInterval(updateCurrentTime, 1000);

// Modal Controller Class
class ModalController {
  constructor() {
    this.modal = document.getElementById('modal');
    this.modalPdf = document.getElementById('modal-pdf');
    this.closeBtn = document.querySelector('.close-modal');
    this.isAnimating = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    // View PDF buttons
    document.querySelectorAll('.view-pdf').forEach(button => {
      button.addEventListener('click', (e) => this.openModal(e));
    });

    // Close button
    this.closeBtn?.addEventListener('click', () => this.closeModal());

    // Click outside
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  async openModal(event) {
    if (this.isAnimating) return;
    
    try {
      this.isAnimating = true;
      const button = event.currentTarget;
      const pdfPath = button.getAttribute('data-pdf');
      
      if (!pdfPath) {
        throw new Error('PDF path not found');
      }

      // Show loading state
      button.classList.add('loading');
      
      // Animate modal opening
      this.modal.style.display = 'flex';
      this.modal.style.opacity = '0';
      this.modalPdf.src = pdfPath;

      await new Promise(resolve => setTimeout(resolve, 50));
      this.modal.style.opacity = '1';
      this.modal.style.transform = 'scale(1)';

      // Add success animation to button
      button.classList.remove('loading');
      button.classList.add('success');
      
    } catch (error) {
      console.error('Error opening modal:', error);
      this.showError('Failed to load PDF. Please try again.');
    } finally {
      this.isAnimating = false;
    }
  }

  async closeModal() {
    if (this.isAnimating) return;

    try {
      this.isAnimating = true;
      
      // Animate modal closing
      this.modal.style.opacity = '0';
      this.modal.style.transform = 'scale(0.95)';
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      this.modal.style.display = 'none';
      this.modalPdf.src = '';
      
    } catch (error) {
      console.error('Error closing modal:', error);
    } finally {
      this.isAnimating = false;
    }
  }

  showError(message) {
    const errorToast = document.createElement('div');
    errorToast.className = 'error-toast';
    errorToast.textContent = message;
    document.body.appendChild(errorToast);

    // Animate error toast
    setTimeout(() => errorToast.classList.add('show'), 100);
    setTimeout(() => {
      errorToast.classList.remove('show');
      setTimeout(() => errorToast.remove(), 300);
    }, 3000);
  }
}

// Abstract Controller Class
class AbstractController {
  constructor() {
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
    
    if (!abstract) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const newHeight = isExpanded ? 0 : abstract.scrollHeight;

    // Update ARIA attributes
    button.setAttribute('aria-expanded', !isExpanded);
    
    // Animate height
    abstract.style.height = `${abstract.scrollHeight}px`;
    await new Promise(resolve => setTimeout(resolve, 50));
    abstract.style.height = `${newHeight}px`;
    
    // Update button text with animation
    button.classList.add('rotating');
    setTimeout(() => {
      button.textContent = isExpanded ? 'Show Paper' : 'Hide Paper';
      button.classList.remove('rotating');
    }, 150);

    // Handle complete collapse
    if (isExpanded) {
      setTimeout(() => {
        abstract.style.height = '';
      }, 300);
    }
  }
}

// Initialize controllers
document.addEventListener('DOMContentLoaded', () => {
  new ModalController();
  new AbstractController();

  // Add page load animation
  document.body.classList.add('loaded');
});

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Add intersection observer for scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// Add custom cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// Add these styles to your CSS
const styles = `
  .error-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ff4757;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 9999;
  }

  .error-toast.show {
    transform: translateY(0);
    opacity: 1;
  }

  .loading {
    position: relative;
    pointer-events: none;
  }

  .loading::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-top-color: transparent;
    border-radius: 50%;
    animation: loading 0.8s linear infinite;
  }

  .success {
    background: #2ecc71 !important;
  }

  .rotating {
    animation: rotate 0.3s ease;
  }

  @keyframes loading {
    to { transform: rotate(360deg); }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(180deg); }
  }

  .custom-cursor {
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    mix-blend-mode: difference;
    transition: transform 0.1s ease;
    z-index: 9999;
  }

  .animate-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }

  .animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
