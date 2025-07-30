# Lumina Smiles - Luxury Cosmetic Dentistry Website

A modern, premium dental website designed to showcase luxury cosmetic dentistry services with integrated lead automation workflows using Twilio and ManyChat.

## ✨ Features

### Design & UX
- **Luxury Aesthetic**: Clean, minimal design with soft gold/pearl gradients
- **Premium Typography**: Playfair Display (serif) + Inter (sans-serif) font combination
- **Responsive Design**: Fully responsive across all devices
- **Smooth Animations**: Subtle animations and hover effects
- **Modern UI**: Card-based layouts with elegant shadows and borders

### Pages & Sections
1. **Hero Section**: Eye-catching hero with CTA for free consultation
2. **About Section**: Dr. Jane Doe's bio with credentials
3. **Services**: Interactive service cards with pricing and details
4. **Gallery**: Before/After slider with interactive comparison
5. **Testimonials**: Patient success stories with photos
6. **Contact Form**: Lead capture form with validation

### Interactive Features
- **Sticky Navigation**: Transparent navbar with scroll effects
- **Service Toggle**: Expandable service cards with details
- **Before/After Slider**: Interactive image comparison
- **Form Validation**: Real-time validation with error messages
- **Smooth Scrolling**: Seamless navigation between sections
- **Mobile Menu**: Hamburger menu for mobile devices

## 🚀 Quick Start

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Customize** the content, images, and styling as needed

## 📁 File Structure

```
lumina-smiles/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## 🎨 Customization

### Colors
The website uses a luxury gold color scheme:
- Primary Gold: `#d4af37`
- Light Gold: `#f4e4bc`
- Text: `#333`
- Secondary Text: `#666`

### Fonts
- **Headings**: Playfair Display (serif)
- **Body Text**: Inter (sans-serif)

### Images
Replace the Unsplash image URLs with your own high-quality images:
- Hero background
- Doctor profile photo
- Before/After images
- Testimonial photos

## 🔗 Integration Setup

### Twilio Integration

1. **Sign up for Twilio** at [twilio.com](https://www.twilio.com)
2. **Get your credentials**:
   - Account SID
   - Auth Token
   - Phone number

3. **Update the form submission** in `script.js`:

```javascript
// Replace the setTimeout with actual Twilio API call
function submitForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Send SMS notification
    fetch('/api/send-sms', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: '+1234567890', // Your office number
            message: `New consultation request from ${formObject.name} (${formObject.phone}) for ${formObject.service}`,
            ...formObject
        })
    });
}
```

### ManyChat Integration

1. **Create a ManyChat account** at [manychat.com](https://www.manychat.com)
2. **Set up a webhook** in ManyChat
3. **Update the form submission**:

```javascript
// Add ManyChat webhook call
fetch('https://webhook.manychat.com/your-webhook-url', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        subscriber: {
            phone: formObject.phone,
            email: formObject.email,
            first_name: formObject.name.split(' ')[0],
            last_name: formObject.name.split(' ').slice(1).join(' ')
        },
        custom_fields: {
            service_interest: formObject.service,
            message: formObject.message
        }
    })
});
```

### Backend Setup (Optional)

For production use, create a simple backend to handle form submissions:

```javascript
// Example Node.js/Express backend
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;
    
    // Send SMS via Twilio
    await twilio.messages.create({
        body: `New consultation request from ${name} (${phone}) for ${service}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.OFFICE_PHONE_NUMBER
    });
    
    // Send to ManyChat
    await fetch(process.env.MANYCHAT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message })
    });
    
    res.json({ success: true });
});
```

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- **Mobile phones** (320px+)
- **Tablets** (768px+)
- **Desktop** (1200px+)

## 🎯 Lead Capture Features

### Form Fields
- **Name**: Required, minimum 2 characters
- **Email**: Required, email validation
- **Phone**: Required, phone number validation
- **Service**: Required dropdown selection
- **Message**: Optional text area

### Automation Triggers
- **Form submission** triggers SMS notification
- **Lead data** sent to ManyChat for follow-up sequences
- **Email confirmation** sent to customer
- **Office notification** via SMS/email

## 🔧 Technical Details

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- Optimized images and assets
- Minimal JavaScript footprint
- CSS animations for smooth performance
- Lazy loading for better page speed

## 📞 Support & Customization

For customization or integration help:
1. **Review the code comments** for guidance
2. **Test the form submission** in browser console
3. **Update API endpoints** with your actual URLs
4. **Customize colors and fonts** in `styles.css`

## 🚀 Deployment

### Static Hosting
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Push to a GitHub repository

### Custom Domain
- Update the contact information in `index.html`
- Configure your domain in your hosting provider
- Update any absolute URLs if needed

## 📈 Analytics & Tracking

Add Google Analytics or Facebook Pixel:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🎨 Design System

### Spacing
- **Section padding**: 100px vertical
- **Card padding**: 2rem
- **Button padding**: 15px 30px

### Shadows
- **Cards**: `0 10px 30px rgba(0,0,0,0.05)`
- **Buttons**: `0 10px 30px rgba(212, 175, 55, 0.3)`
- **Hover effects**: `0 20px 40px rgba(212, 175, 55, 0.1)`

### Border Radius
- **Cards**: 20px
- **Buttons**: 50px
- **Form inputs**: 10px

---

**Built with ❤️ for luxury dental practices**