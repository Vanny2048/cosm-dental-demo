// Configuration file for Lumina Smiles website
const CONFIG = {
    // Make.com webhook URL for automation
    // Replace this with your actual webhook URL from make.com
    MAKE_WEBHOOK_URL: 'YOUR_MAKE_COM_WEBHOOK_URL_HERE',
    
    // Form settings
    FORM_SETTINGS: {
        name: 'contact',
        honeypot: 'bot-field'
    },
    
    // Notification settings
    NOTIFICATIONS: {
        success: {
            message: 'Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.',
            duration: 5000
        },
        error: {
            message: 'There was an error submitting your form. Please try again.',
            duration: 5000
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}