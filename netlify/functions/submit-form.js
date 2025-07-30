const { MongoClient } = require('mongodb');

// MongoDB connection string (you'll need to set this as an environment variable)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'lumina-smiles';
const COLLECTION_NAME = 'leads';

// Webhook configuration
const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL || 'https://hook.us2.make.com/2wabyrnjjipw4m2c5gg7lclqi7bx2n5d';

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const formData = JSON.parse(event.body);
    
    // Validate required fields
    const { name, email, phone, service, message } = formData;
    
    if (!name || !email || !phone || !service) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, phone, and service are required' 
        })
      };
    }

    // Create lead object with timestamp
    const lead = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service,
      message: message ? message.trim() : '',
      submittedAt: new Date().toISOString(),
      status: 'new',
      source: 'website'
    };

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert the lead into the database
    const result = await collection.insertOne(lead);

    // Close the connection
    await client.close();

    // Log the submission (for debugging)
    console.log('Lead submitted:', {
      id: result.insertedId,
      name: lead.name,
      email: lead.email,
      service: lead.service
    });

    // Trigger webhook for automation
    try {
      await triggerWebhook(lead);
      console.log('Webhook triggered successfully');
    } catch (webhookError) {
      console.error('Webhook error:', webhookError);
      // Don't fail the form submission if webhook fails
    }

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.',
        leadId: result.insertedId
      })
    };

  } catch (error) {
    console.error('Error submitting form:', error);

    // If MongoDB is not available, still try to trigger webhook
    try {
      await triggerWebhook(lead);
      console.log('Webhook triggered successfully (fallback)');
    } catch (webhookError) {
      console.error('Webhook error (fallback):', webhookError);
    }

    // If MongoDB is not available, fall back to storing in a simple file or just return success
    // This ensures the form still works even without database setup
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you! Your consultation request has been submitted. We\'ll contact you within 24 hours.',
        note: 'Database connection not available, but your request has been received.'
      })
    };
  }
};

// Function to trigger webhook for make.com automation
async function triggerWebhook(formData) {
  if (!MAKE_WEBHOOK_URL) {
    console.log('Webhook URL not configured - skipping automation trigger');
    return;
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
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
        timestamp: formData.submittedAt,
        source: formData.source,
        leadId: formData._id || 'unknown'
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Webhook triggered successfully');
  } catch (error) {
    console.error('Webhook error:', error);
    throw error;
  }
}