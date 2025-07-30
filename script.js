// Navigation functionality
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Smooth scrolling for navigation links
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

// Service card toggle functionality
function toggleService(card) {
    const isActive = card.classList.contains('active');
    
    // Close all other service cards
    document.querySelectorAll('.service-card').forEach(serviceCard => {
        serviceCard.classList.remove('active');
    });
    
    // Toggle the clicked card
    if (!isActive) {
        card.classList.add('active');
    }
}

// Before/After slider functionality
function initBeforeAfterSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const sliderHandle = document.querySelector('.slider-handle');
    const afterImage = document.querySelector('.after-image');
    
    if (!sliderContainer || !sliderHandle || !afterImage) return;
    
    let isResizing = false;
    
    function updateSliderPosition(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        
        // Constrain to 0-100%
        const constrainedPercentage = Math.max(0, Math.min(100, percentage));
        
        sliderHandle.style.left = `${constrainedPercentage}%`;
        afterImage.style.width = `${constrainedPercentage}%`;
    }
    
    function handleMouseDown(e) {
        isResizing = true;
        sliderContainer.style.cursor = 'col-resize';
        e.preventDefault();
    }
    
    function handleMouseMove(e) {
        if (!isResizing) return;
        updateSliderPosition(e.clientX);
    }
    
    function handleMouseUp() {
        isResizing = false;
        sliderContainer.style.cursor = 'default';
    }
    
    // Event listeners
    sliderHandle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events for mobile
    sliderHandle.addEventListener('touchstart', (e) => {
        isResizing = true;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        const touch = e.touches[0];
        updateSliderPosition(touch.clientX);
        e.preventDefault();
    });
    
    document.addEventListener('touchend', () => {
        isResizing = false;
    });
    
    // Initialize slider at 50%
    updateSliderPosition(sliderContainer.getBoundingClientRect().left + sliderContainer.offsetWidth / 2);
}

// Form submission functionality
function submitForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Check for honeypot field (spam protection)
    const botField = formData.get('bot-field');
    if (botField) {
        // This is likely a bot, silently ignore
        form.reset();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        return;
    }
    
    // Prepare data for submission
    const formObject = {};
    formData.forEach((value, key) => {
        if (key !== 'bot-field' && key !== 'form-name') {
            formObject[key] = value;
        }
    });
    
    // Add timestamp and source
    formObject.timestamp = new Date().toISOString();
    formObject.source = 'website';
    
    // First, try to submit to Netlify function
    fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Netlify function failed');
        }
    })
    .then(data => {
        if (data.success) {
            // Trigger webhook for make.com automation
            triggerWebhook(formObject);
            
            showNotification(data.message, 'success');
            form.reset();
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Netlify function error:', error);
        
        // Fallback: Submit to Netlify's built-in form handling
        submitToNetlifyForm(form, formObject, submitButton, originalText);
    });
}

// Fallback function to submit to Netlify's built-in form handling
function submitToNetlifyForm(form, formObject, submitButton, originalText) {
    // Create a temporary form for Netlify submission
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = '/';
    tempForm.style.display = 'none';
    
    // Add form name
    const formNameInput = document.createElement('input');
    formNameInput.type = 'hidden';
    formNameInput.name = 'form-name';
    formNameInput.value = 'contact';
    tempForm.appendChild(formNameInput);
    
    // Add all form data
    Object.keys(formObject).forEach(key => {
        if (key !== 'timestamp' && key !== 'source') {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formObject[key];
            tempForm.appendChild(input);
        }
    });
    
    // Add honeypot field
    const honeypotInput = document.createElement('input');
    honeypotInput.type = 'hidden';
    honeypotInput.name = 'bot-field';
    honeypotInput.value = '';
    tempForm.appendChild(honeypotInput);
    
    document.body.appendChild(tempForm);
    
    // Submit the form
    tempForm.submit();
    
    // Trigger webhook for make.com automation
    triggerWebhook(formObject);
    
    // Show success message
    showNotification('Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.', 'success');
    form.reset();
    
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Clean up
    document.body.removeChild(tempForm);
}

// Function to trigger webhook for make.com automation
function triggerWebhook(formData) {
    // Get webhook URL from config
    const webhookUrl = typeof CONFIG !== 'undefined' ? CONFIG.MAKE_WEBHOOK_URL : null;
    
    if (webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                service: formData.service,
                message: formData.message || '',
                timestamp: formData.timestamp,
                source: formData.source
            })
        })
        .then(response => {
            if (response.ok) {
                console.log('Webhook triggered successfully');
            } else {
                console.error('Webhook failed:', response.status);
            }
        })
        .catch(error => {
            console.error('Webhook error:', error);
        });
    } else {
        console.log('Webhook URL not configured - skipping automation trigger');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Choose icon based on type
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Choose background color based on type
    let bgColor = '#2196F3'; // default blue
    if (type === 'success') bgColor = '#4CAF50'; // green
    if (type === 'error') bgColor = '#f44336'; // red
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to contact function
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .credential, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1rem;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBeforeAfterSlider();
    initScrollAnimations();
    
    // Add some interactive hover effects
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('leadForm');
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
        case 'service':
            if (value === '') {
                isValid = false;
                errorMessage = 'Please select a service';
            }
            break;
    }
    
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#ff6b6b';
        field.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
        
        // Show error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ff6b6b;
                font-size: 0.8rem;
                margin-top: 5px;
                margin-left: 5px;
            `;
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    } else {
        field.style.borderColor = '#d4af37';
        field.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.1)';
        
        // Remove error message
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    return isValid;
}