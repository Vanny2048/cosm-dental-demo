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
      source: 'website',
      submissionId: formData.submissionId || `func_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    let dbResult = null;

    // Try to connect to MongoDB (optional - won't fail if not available)
    try {
      const client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // 5 second timeout
        connectTimeoutMS: 5000
      });
      
      await client.connect();
      const db = client.db(DB_NAME);
      const collection = db.collection(COLLECTION_NAME);

      // Insert the lead into the database
      dbResult = await collection.insertOne(lead);
      await client.close();

      console.log('Lead saved to database:', {
        id: dbResult.insertedId,
        name: lead.name,
        email: lead.email,
        service: lead.service
      });
    } catch (dbError) {
      console.log('Database not available, continuing without database storage:', dbError.message);
      // Continue without database - this is not a critical failure
    }

    // Trigger webhook for automation (with timeout)
    let webhookSuccess = false;
    try {
      webhookSuccess = await triggerWebhookWithTimeout(lead);
      console.log('Webhook result:', webhookSuccess ? 'success' : 'failed');
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
        leadId: dbResult ? dbResult.insertedId : null,
        webhookSuccess: webhookSuccess,
        submissionId: lead.submissionId
      })
    };

  } catch (error) {
    console.error('Error submitting form:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: 'There was an error processing your request. Please try again.'
      })
    };
  }
};

// Function to trigger webhook with timeout
async function triggerWebhookWithTimeout(formData) {
  if (!MAKE_WEBHOOK_URL) {
    console.log('Webhook URL not configured - skipping automation trigger');
    return false;
  }

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

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
        submissionId: formData.submissionId,
        leadId: formData._id || null
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Webhook triggered successfully');
    return true;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Webhook timeout');
    } else {
      console.error('Webhook error:', error);
    }
    return false;
  }
}