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
}

// ===== BULLETPROOF FORM SUBMISSION SYSTEM =====

// Debug logging system
const DEBUG = {
    enabled: true,
    log: function(message, type = 'info') {
        if (!this.enabled) return;
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
        console.log(logMessage);
        
        // Also log to a visible debug area if it exists
        const debugArea = document.getElementById('debug-log');
        if (debugArea) {
            debugArea.innerHTML += `<div>[${timestamp}] ${type.toUpperCase()}: ${message}</div>`;
            debugArea.scrollTop = debugArea.scrollHeight;
        }
    },
    
    error: function(message) { this.log(message, 'error'); },
    success: function(message) { this.log(message, 'success'); },
    warning: function(message) { this.log(message, 'warning'); },
    info: function(message) { this.log(message, 'info'); }
};

// Configuration validation
function validateConfiguration() {
    DEBUG.info('Validating configuration...');
    
    // Check if CONFIG exists
    if (typeof CONFIG === 'undefined') {
        DEBUG.error('CONFIG object not found! Check if config.js is loaded.');
        return false;
    }
    
    // Check webhook URL
    if (!CONFIG.MAKE_WEBHOOK_URL) {
        DEBUG.error('MAKE_WEBHOOK_URL not configured in CONFIG object');
        return false;
    }
    
    // Validate webhook URL format
    try {
        new URL(CONFIG.MAKE_WEBHOOK_URL);
        DEBUG.success(`Webhook URL validated: ${CONFIG.MAKE_WEBHOOK_URL}`);
    } catch (e) {
        DEBUG.error(`Invalid webhook URL format: ${CONFIG.MAKE_WEBHOOK_URL}`);
        return false;
    }
    
    // Check if fetch is available
    if (typeof fetch === 'undefined') {
        DEBUG.error('fetch API not available in this browser');
        return false;
    }
    
    DEBUG.success('Configuration validation passed');
    return true;
}

// Form validation
function validateForm(form) {
    DEBUG.info('Validating form...');
    
    if (!form) {
        DEBUG.error('Form element is null or undefined');
        return false;
    }
    
    if (!(form instanceof HTMLFormElement)) {
        DEBUG.error('Element is not a form');
        return false;
    }
    
    // Check for required fields
    const requiredFields = ['name', 'email', 'phone', 'service'];
    const missingFields = [];
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field) {
            missingFields.push(fieldName);
        }
    });
    
    if (missingFields.length > 0) {
        DEBUG.error(`Missing required form fields: ${missingFields.join(', ')}`);
        return false;
    }
    
    DEBUG.success('Form validation passed');
    return true;
}

// Extract form data safely
function extractFormData(form) {
    DEBUG.info('Extracting form data...');
    
    const formData = new FormData(form);
    const data = {};
    
    // Extract all form fields
    formData.forEach((value, key) => {
        if (key !== 'bot-field' && key !== 'form-name') {
            data[key] = value.trim();
        }
    });
    
    // Add metadata
    data.timestamp = new Date().toISOString();
    data.source = 'website';
    data.submissionId = generateSubmissionId();
    data.userAgent = navigator.userAgent;
    data.url = window.location.href;
    
    DEBUG.info(`Form data extracted: ${JSON.stringify(data, null, 2)}`);
    return data;
}

// Send to Make.com webhook with extensive error handling
async function sendToMakeWebhook(data) {
    DEBUG.info('Sending to Make.com webhook...');
    
    if (!validateConfiguration()) {
        DEBUG.error('Configuration validation failed - cannot send webhook');
        return { success: false, error: 'Configuration invalid' };
    }
    
    const webhookUrl = CONFIG.MAKE_WEBHOOK_URL;
    
    try {
        // Prepare the request
        const requestBody = JSON.stringify(data);
        DEBUG.info(`Request body: ${requestBody}`);
        
        // Set up timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            DEBUG.error('Webhook request timed out after 15 seconds');
        }, 15000);
        
        // Make the request
        const startTime = Date.now();
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Lumina-Smiles-Website/1.0'
            },
            body: requestBody,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;
        
        DEBUG.info(`Webhook response received in ${duration}ms`);
        DEBUG.info(`Response status: ${response.status}`);
        DEBUG.info(`Response ok: ${response.ok}`);
        
        // Try to get response body for debugging
        let responseBody = '';
        try {
            responseBody = await response.text();
            if (responseBody) {
                DEBUG.info(`Response body: ${responseBody}`);
            }
        } catch (e) {
            DEBUG.warning('Could not read response body');
        }
        
        if (response.ok) {
            DEBUG.success('Webhook sent successfully to Make.com');
            return { success: true, response: responseBody };
        } else {
            DEBUG.error(`Webhook failed with status ${response.status}: ${responseBody}`);
            return { 
                success: false, 
                error: `HTTP ${response.status}`, 
                details: responseBody 
            };
        }
        
    } catch (error) {
        if (error.name === 'AbortError') {
            DEBUG.error('Webhook request timed out');
            return { success: false, error: 'Timeout' };
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
            DEBUG.error('Network error - possible CORS issue or network problem');
            return { success: false, error: 'Network error' };
        } else {
            DEBUG.error(`Webhook error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

// Send to Netlify for backup (optional)
async function sendToNetlify(form, data) {
    DEBUG.info('Sending backup to Netlify...');
    
    try {
        // Create a new FormData for Netlify
        const netlifyData = new FormData();
        netlifyData.append('form-name', 'contact');
        netlifyData.append('bot-field', '');
        
        // Add form fields (excluding metadata)
        Object.keys(data).forEach(key => {
            if (!['timestamp', 'source', 'submissionId', 'userAgent', 'url'].includes(key)) {
                netlifyData.append(key, data[key]);
            }
        });
        
        const response = await fetch('/', {
            method: 'POST',
            body: netlifyData
        });
        
        DEBUG.info(`Netlify response: ${response.status}`);
        return response.ok;
        
    } catch (error) {
        DEBUG.error(`Netlify backup failed: ${error.message}`);
        return false;
    }
}

// Main form submission handler - BULLETPROOF VERSION
async function submitForm(event) {
    DEBUG.info('=== FORM SUBMISSION STARTED ===');
    
    // CRITICAL: Prevent default form submission
    event.preventDefault();
    DEBUG.info('Default form submission prevented');
    
    const form = event.target;
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton ? submitButton.innerHTML : 'Submit';
    
    // Show loading state
    if (submitButton) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;
    }
    
    try {
        // Step 1: Validate form
        if (!validateForm(form)) {
            throw new Error('Form validation failed');
        }
        
        // Step 2: Check for honeypot
        const formData = new FormData(form);
        const botField = formData.get('bot-field');
        if (botField) {
            DEBUG.warning('Bot field detected - likely spam, silently ignoring');
            form.reset();
            return;
        }
        
        // Step 3: Extract form data
        const data = extractFormData(form);
        
        // Step 4: Show processing message
        showNotification('Processing your request...', 'info');
        
        // Step 5: Send to Make.com webhook FIRST (most important)
        DEBUG.info('Sending to Make.com webhook...');
        const webhookResult = await sendToMakeWebhook(data);
        
        if (webhookResult.success) {
            DEBUG.success('Make.com webhook successful!');
            showNotification('Automation triggered! Processing your request...', 'info');
        } else {
            DEBUG.error(`Make.com webhook failed: ${webhookResult.error}`);
            showNotification('Warning: Automation may not have triggered. Your form will still be processed.', 'warning');
        }
        
        // Step 6: Send backup to Netlify (optional)
        try {
            await sendToNetlify(form, data);
            DEBUG.info('Netlify backup sent');
        } catch (netlifyError) {
            DEBUG.warning(`Netlify backup failed: ${netlifyError.message}`);
        }
        
        // Step 7: Show success message
        if (webhookResult.success) {
            showNotification('Thank you! Your consultation request has been submitted and processed. We\'ll contact you within 24 hours.', 'success');
        } else {
            showNotification('Your form was submitted successfully! We\'ll contact you within 24 hours.', 'success');
        }
        
        // Step 8: Reset form
        form.reset();
        DEBUG.success('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');
        
    } catch (error) {
        DEBUG.error(`Form submission error: ${error.message}`);
        showNotification('There was an error submitting your form. Please try again.', 'error');
    } finally {
        // Restore submit button
        if (submitButton) {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
}

// Generate unique submission ID
function generateSubmissionId() {
    return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing validation classes
    field.classList.remove('valid', 'invalid');
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
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
            const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
            
        case 'service':
            if (!value) {
                isValid = false;
                errorMessage = 'Please select a service';
            }
            break;
    }
    
    // Apply validation styling
    if (isValid) {
        field.classList.add('valid');
    } else {
        field.classList.add('invalid');
    }
    
    // Show/hide error message
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement && !isValid) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentElement.appendChild(errorElement);
    }
    
    if (errorElement) {
        if (isValid) {
            errorElement.remove();
        } else {
            errorElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    DEBUG.info('DOM loaded - initializing form system...');
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize before/after slider
    initBeforeAfterSlider();
    
    // Find and set up the contact form
    const contactForm = document.querySelector('form[name="contact"], form[data-netlify="true"], #contact-form');
    
    if (contactForm) {
        DEBUG.info('Contact form found, setting up event listeners...');
        
        // Remove any existing event listeners by cloning the form
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // Add submit event listener
        newForm.addEventListener('submit', submitForm);
        DEBUG.success('Form submit event listener added');
        
        // Add real-time validation
        const inputs = newForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });
        
        DEBUG.success('Form validation listeners added');
        
    } else {
        DEBUG.error('No contact form found! Check form selectors.');
    }
    
    // Validate configuration
    if (!validateConfiguration()) {
        DEBUG.error('Configuration validation failed - webhook will not work!');
    }
    
    DEBUG.info('Form system initialization complete');
});

// Export functions for testing
window.submitForm = submitForm;
window.sendToMakeWebhook = sendToMakeWebhook;
window.validateConfiguration = validateConfiguration;
window.DEBUG = DEBUG;