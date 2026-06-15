/* =====================================================
   KURADE DIGITAL TECHNOLOGIES - MAIN JAVASCRIPT
   ===================================================== */

// ==================== NAVIGATION ==================== 
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navLinks.classList.remove('active');
    });
  });

  // Active link highlighting
  function updateActiveLink() {
    const currentLocation = window.location.pathname.split('/').pop() || 'index.html';
    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (href === currentLocation || (currentLocation === '' && href === 'index.html')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  updateActiveLink();

  // Navbar scroll effect
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
});

// ==================== SMOOTH SCROLLING ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// ==================== SCROLL REVEAL ANIMATIONS ==================== 
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.scroll-reveal').forEach(el => {
  observer.observe(el);
});

// Add scroll-reveal class to elements
function initScrollReveal() {
  const elements = [
    '.service-card',
    '.product-card',
    '.feature-item',
    '.stat-item'
  ];

  elements.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('scroll-reveal');
    });
  });
}

// ==================== ANIMATED COUNTERS ==================== 
class AnimatedCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = parseInt(target) || 0;
    this.duration = duration;
    this.current = 0;
    this.increment = this.target / (duration / 16);
  }

  start() {
    const timer = setInterval(() => {
      this.current += this.increment;
      if (this.current >= this.target) {
        this.current = this.target;
        clearInterval(timer);
      }
      this.element.textContent = Math.floor(this.current).toLocaleString();
    }, 16);
  }
}

let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = counter.getAttribute('data-target') || counter.textContent;
    new AnimatedCounter(counter, target, 2000).start();
  });
}

// Trigger counters when statistics section comes into view
const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

window.addEventListener('load', function() {
  const statsSection = document.querySelector('.statistics');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }
});

// ==================== CONTACT FORM VALIDATION ==================== 
class ContactForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    if (this.validateForm(data)) {
      this.submitForm(data);
    }
  }

  validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;
    const messageEl = this.form.querySelector('.form-message');

    // Clear previous messages
    messageEl.classList.remove('success', 'error');

    if (!data.name || data.name.trim() === '') {
      this.showError('Please enter your name');
      return false;
    }

    if (!data.email || !emailRegex.test(data.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }

    if (!data.phone || !phoneRegex.test(data.phone.replace(/\D/g, ''))) {
      this.showError('Please enter a valid phone number');
      return false;
    }

    if (!data.subject || data.subject.trim() === '') {
      this.showError('Please enter a subject');
      return false;
    }

    if (!data.message || data.message.trim() === '') {
      this.showError('Please enter your message');
      return false;
    }

    return true;
  }

  showError(message) {
    const messageEl = this.form.querySelector('.form-message');
    messageEl.classList.add('error');
    messageEl.textContent = message;
  }

  showSuccess(message) {
    const messageEl = this.form.querySelector('.form-message');
    messageEl.classList.add('success');
    messageEl.textContent = message;
  }

  submitForm(data) {
    // Show loading state
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate form submission (in production, this would send to a server)
    setTimeout(() => {
      this.showSuccess('Thank you! We will contact you soon.');
      this.form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Clear message after 5 seconds
      setTimeout(() => {
        this.form.querySelector('.form-message').classList.remove('success', 'error');
      }, 5000);
    }, 1500);
  }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', function() {
  new ContactForm('#contactForm');
  initScrollReveal();
});

// ==================== WHATSAPP INTEGRATION ==================== 
class WhatsAppButton {
  constructor(phoneNumber = '+917378523732', defaultMessage = 'Hi, I am interested in your services') {
    this.phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    this.defaultMessage = encodeURIComponent(defaultMessage);
    this.init();
  }

  init() {
    const button = document.querySelector('.whatsapp-float');
    if (button) {
      button.addEventListener('click', () => this.openWhatsApp());
    }
  }

  openWhatsApp() {
    const url = `https://wa.me/${this.phoneNumber}?text=${this.defaultMessage}`;
    window.open(url, '_blank');
  }
}

// Initialize WhatsApp button
document.addEventListener('DOMContentLoaded', function() {
  new WhatsAppButton('+91 7378523732', 'Hi, I am interested in your services. Can you please provide more information?');
});

// ==================== LOADING ANIMATION ==================== 
class PageLoader {
  constructor() {
    this.loading = document.querySelector('.loading');
    this.overlay = document.querySelector('.loading-overlay');
    this.isLoading = false;
  }

  show() {
    if (this.loading && this.overlay) {
      this.loading.classList.add('active');
      this.overlay.classList.add('active');
      this.isLoading = true;
    }
  }

  hide() {
    if (this.loading && this.overlay) {
      this.loading.classList.remove('active');
      this.overlay.classList.remove('active');
      this.isLoading = false;
    }
  }
}

const loader = new PageLoader();

// Show loader on page load
window.addEventListener('load', function() {
  loader.hide();
});

// ==================== LINK CLICK NAVIGATION ==================== 
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'A' && e.target.getAttribute('href') && !e.target.getAttribute('href').startsWith('#')) {
    if (!e.target.getAttribute('target') && !e.target.getAttribute('href').startsWith('http')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      loader.show();
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    }
  }
});

// ==================== UTILITY FUNCTIONS ==================== 

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Add animation to elements on scroll
function addScrollAnimation() {
  const elements = document.querySelectorAll('[data-animation]');
  
  const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.getAttribute('data-animation');
        entry.target.style.animation = `${animation} 0.6s ease-out forwards`;
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => animationObserver.observe(el));
}

// Get URL parameters
function getURLParameter(param) {
  const pageURL = window.location.search.substring(1);
  const urlVariables = pageURL.split('&');
  for (let i = 0; i < urlVariables.length; i++) {
    const paramName = urlVariables[i].split('=');
    if (paramName[0] === param) {
      return decodeURIComponent(paramName[1]);
    }
  }
  return '';
}

// ==================== FORM INPUT HELPERS ==================== 

// Format phone number
function formatPhoneNumber(value) {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length <= 10) {
    return cleaned;
  }
  return cleaned.substring(0, 15);
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ==================== KEYBOARD SHORTCUTS ==================== 

document.addEventListener('keydown', function(e) {
  // ESC key to close mobile menu
  if (e.key === 'Escape') {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  }

  // Ctrl+K to focus search (if search exists)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    // Add search functionality here if needed
  }
});

// ==================== PERFORMANCE OPTIMIZATION ==================== 

// Lazy load images (if data-src is used)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ==================== PRINT STYLES INITIALIZATION ==================== 

window.addEventListener('beforeprint', function() {
  document.body.style.backgroundColor = '#ffffff';
});

window.addEventListener('afterprint', function() {
  document.body.style.backgroundColor = '';
});

// ==================== INITIALIZATION ==================== 

document.addEventListener('DOMContentLoaded', function() {
  console.log('Kurade Digital Technologies - Website Loaded');
  
  // Initialize all components
  initScrollReveal();
  addScrollAnimation();
  
  // Add smooth page transitions
  document.body.style.transition = 'background 0.3s ease';
});

// ==================== SERVICE CARD INTERACTIONS ==================== 

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// ==================== PRODUCT CARD INTERACTIONS ==================== 

document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-10px)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });
});

// ==================== FEATURE ITEM INTERACTIONS ==================== 

document.querySelectorAll('.feature-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    const icon = this.querySelector('.feature-icon');
    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }
  });
  
  item.addEventListener('mouseleave', function() {
    const icon = this.querySelector('.feature-icon');
    if (icon) {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }
  });
});

// ==================== STAT ITEM INTERACTIONS ==================== 

document.querySelectorAll('.stat-item').forEach(item => {
  item.addEventListener('mouseenter', function() {
    const number = this.querySelector('.stat-number');
    if (number) {
      number.style.transform = 'scale(1.2)';
    }
  });
  
  item.addEventListener('mouseleave', function() {
    const number = this.querySelector('.stat-number');
    if (number) {
      number.style.transform = 'scale(1)';
    }
  });
});

// ==================== RESPONSIVE BREAKPOINT DETECTION ==================== 

class ResponsiveHelper {
  static isMobile() {
    return window.innerWidth <= 768;
  }

  static isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  static isDesktop() {
    return window.innerWidth > 1024;
  }

  static getCurrentBreakpoint() {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }
}

// Log responsive breakpoint for debugging
window.addEventListener('resize', function() {
  // Can be used for responsive behavior adjustments
});

// ==================== ACCESSIBILITY ==================== 

// Improve accessibility for keyboard navigation
document.addEventListener('keydown', function(e) {
  const buttons = document.querySelectorAll('button, a, input, textarea');
  
  if (e.key === 'Tab') {
    // Tab key handling
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.classList) {
      focusedElement.classList.add('keyboard-focus');
    }
  }
});

document.addEventListener('mousedown', function(e) {
  // Remove keyboard focus styles when using mouse
  document.querySelectorAll('.keyboard-focus').forEach(el => {
    el.classList.remove('keyboard-focus');
  });
});
