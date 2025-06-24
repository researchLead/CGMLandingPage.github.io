// Main JavaScript functionality

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
  initializeFAQ();
  initializeNavigation();
  initializeScrollEffects();
  initializeAnalytics();
  
  // Check if we're in an iframe
  checkIframeStatus();
});

function checkIframeStatus() {
  const isInIframe = window.self !== window.top;
  
  if (isInIframe) {
    console.log('Page loaded in iframe - implementing fallback tracking');
    // Set a flag for iframe tracking
    window.isEmbedded = true;
    
    // Track iframe load
    trackEvent('iframe_load', {
      event_category: 'embedding',
      event_label: 'survey_platform',
      custom_parameter_1: 'research_survey'
    });
  }
}

// FAQ Functionality
function initializeFAQ() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((button) => {
    button.addEventListener('click', function () {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isOpen = answer.style.display === 'block';

      // Close all other FAQ items
      closeAllFAQItems();

      // Toggle current item
      if (!isOpen) {
        answer.style.display = 'block';
        this.style.backgroundColor = '#f8fafc';
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function closeAllFAQItems() {
  const answers = document.querySelectorAll('.faq-answer');
  const questions = document.querySelectorAll('.faq-question');

  answers.forEach((answer) => {
    answer.style.display = 'none';
  });

  questions.forEach((question) => {
    question.style.backgroundColor = 'transparent';
    question.setAttribute('aria-expanded', 'false');
  });
}

// Navigation
function initializeNavigation() {
  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed nav
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        });
      }
    });
  });
}

// Scroll Effects
function initializeScrollEffects() {
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', function () {
    // Navbar background on scroll
    if (window.scrollY > 10) {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = 'none';
    }
  });

  // Intersection Observer for animations (optional)
  if ('IntersectionObserver' in window) {
    initializeScrollAnimations();
  }
}

// Optional: Scroll animations
function initializeScrollAnimations() {
  const animateElements = document.querySelectorAll(
    '.solution-card, .benefit-card, .step, .testimonial'
  );

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animateElements.forEach((element) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Form handling (if you add forms later)
function handleFormSubmission(formId, callback) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      callback(formData);
    });
  }
}

// Enhanced tracking function
function trackEvent(eventName, eventData = {}) {
  // Try Google Analytics first
  if (typeof gtag !== 'undefined') {
    try {
      gtag('event', eventName, eventData);
      console.log('GA event tracked:', eventName, eventData);
    } catch (error) {
      console.log('GA tracking failed:', error);
      // Fallback to alternative tracking
      trackAlternative(eventName, eventData);
    }
  } else {
    console.log('gtag not available, using fallback tracking');
    trackAlternative(eventName, eventData);
  }
}

// Export functions if using modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeFAQ,
    initializeNavigation,
    initializeScrollEffects,
    trackEvent,
  };
}

// NEW FUNCTION: Track button clicks
function initializeAnalytics() {
  // Track all CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button, .nav-cta');
  ctaButtons.forEach(function (button, index) {
    button.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
          event_category: 'engagement',
          event_label: this.textContent.trim(),
          button_location: this.closest('section')?.className || 'navigation',
        });
      }
    });
  });

  // Track form submission attempts
  const formSubmitButton = document.querySelector('button[type="submit"]');
  if (formSubmitButton) {
    formSubmitButton.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_attempt', {
          event_category: 'conversion',
          event_label: 'insurance_check',
        });
      }
    });
  }

  // Track FAQ interactions
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (question) {
    question.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_click', {
          event_category: 'engagement',
          event_label: this.textContent.trim(),
        });
      }
    });
  });
}
