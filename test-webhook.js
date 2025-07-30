#!/usr/bin/env node

// Test script for webhook functionality
// Using built-in fetch (available in Node.js 18+)

// Webhook URL from config
const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/2wabyrnjjipw4m2c5gg7lclqi7bx2n5d';

// Test data
const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1234567890',
    service: 'teeth-whitening',
    message: 'This is a test webhook from Node.js script',
    timestamp: new Date().toISOString(),
    source: 'node-test-script',
    testId: `node-test-${Date.now()}`
};

async function testWebhook() {
    console.log('🔧 Testing webhook functionality...');
    console.log('Webhook URL:', MAKE_WEBHOOK_URL);
    console.log('Test data:', JSON.stringify(testData, null, 2));
    
    try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (response.ok) {
            const responseText = await response.text();
            console.log('✅ Webhook test successful!');
            console.log('Response body:', responseText);
        } else {
            console.log('❌ Webhook test failed!');
            console.log('Error status:', response.status);
            const errorText = await response.text();
            console.log('Error body:', errorText);
        }
    } catch (error) {
        console.log('❌ Webhook test error:', error.message);
    }
}

// Run the test
testWebhook();