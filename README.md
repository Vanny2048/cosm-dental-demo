# Lumina Smiles - Luxury Cosmetic Dentistry Website

A modern, premium cosmetic dental website for Lumina Smiles, featuring a luxury aesthetic with full contact form functionality and Netlify deployment.

## 🌟 Features

- **Luxury Design**: Clean, minimal aesthetic with soft gold/pearl gradients
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations, before/after sliders, and service toggles
- **Contact Form**: Fully functional lead capture form with spam protection
- **Netlify Integration**: Serverless functions for form processing and database storage
- **SEO Optimized**: Proper meta tags and semantic HTML structure

## 🚀 Quick Deploy to Netlify

### Option 1: Deploy Button (Recommended)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/lumina-smiles)

### Option 2: Manual Deployment

1. **Fork/Clone this repository**
   ```bash
   git clone https://github.com/yourusername/lumina-smiles.git
   cd lumina-smiles
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select this repository
   - Click "Deploy site"

3. **Configure Environment Variables** (Optional - for database storage)
   - In your Netlify dashboard, go to Site settings > Environment variables
   - Add: `MONGODB_URI` = your MongoDB connection string

## 📋 Form Functionality

The contact form includes:

- **Spam Protection**: Honeypot field to prevent bot submissions
- **Data Storage**: MongoDB integration via Netlify functions
- **Validation**: Client-side and server-side validation
- **Success/Error Handling**: User-friendly notifications
- **Lead Management**: Structured data for CRM integration

### Form Fields:
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Service Selection (required)
- Message (optional)

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ 
- Git

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lumina-smiles.git
   cd lumina-smiles
   ```

2. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

3. **Install function dependencies**
   ```bash
   cd netlify/functions
   npm install
   cd ../..
   ```

4. **Start local development server**
   ```bash
   netlify dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:8888`

## 🗄️ Database Setup (Optional)

For full lead storage functionality:

1. **Create MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Get connection string**
   - In your cluster, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Set environment variable**
   - In Netlify dashboard: Site settings > Environment variables
   - Add: `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/lumina-smiles?retryWrites=true&w=majority`

## 📱 Customization

### Colors & Branding
Edit `styles.css` to customize:
- Primary gold color: `#d4af37`
- Secondary colors in gradients
- Typography fonts (Playfair Display + Inter)

### Content Updates
- **Images**: Replace Unsplash URLs with your own images
- **Text**: Update all content in `index.html`
- **Services**: Modify service cards and pricing
- **Contact Info**: Update address, phone, email

### Form Integration
The form is ready for:
- **Twilio**: SMS notifications
- **ManyChat**: Chatbot integration
- **CRM Systems**: HubSpot, Salesforce, etc.
- **Email Marketing**: Mailchimp, ConvertKit, etc.

## 🔧 Technical Details

### File Structure
```
lumina-smiles/
├── index.html          # Main website
├── styles.css          # All styling
├── script.js           # JavaScript functionality
├── netlify.toml        # Netlify configuration
├── netlify/
│   └── functions/
│       ├── submit-form.js    # Form processing
│       └── package.json      # Function dependencies
└── README.md           # This file
```

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript**: Interactive functionality
- **Netlify Functions**: Serverless backend
- **MongoDB**: Database storage (optional)
- **Font Awesome**: Icons
- **Google Fonts**: Typography

## 📊 Analytics & Tracking

Ready for integration with:
- Google Analytics
- Facebook Pixel
- LinkedIn Insight Tag
- Hotjar
- Google Tag Manager

## 🔒 Security Features

- **Honeypot Protection**: Hidden field to catch bots
- **Input Validation**: Client and server-side validation
- **CORS Headers**: Proper cross-origin handling
- **HTTPS**: Automatic SSL with Netlify

## 📞 Support

For questions or customization requests:
- Email: hello@luminasmiles.com
- Phone: (310) 555-0123

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Lumina Smiles**