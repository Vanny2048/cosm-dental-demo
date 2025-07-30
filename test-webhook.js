#!/usr/bin/env node

// Simple webhook test script
const webhookUrl = 'https://hook.us2.make.com/2wabyrnjjipw4m2c5gg7lclqi7bx2n5d';

async function testWebhook() {
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        service: 'consultation',
        message: 'This is a test message from the webhook test script',
        timestamp: new Date().toISOString(),
        source: 'webhook-test-script',
        submissionId: `script-test-${Date.now()}`
    };

    console.log('Testing webhook with data:', JSON.stringify(testData, null, 2));

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const startTime = Date.now();
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const endTime = Date.now();
        const duration = endTime - startTime;

        console.log(`Response received in ${duration}ms`);
        console.log(`Status: ${response.status}`);
        console.log(`OK: ${response.ok}`);

        if (response.ok) {
            console.log('✅ Webhook test successful!');
            
            // Try to get response body
            try {
                const responseText = await response.text();
                if (responseText) {
                    console.log('Response body:', responseText);
                }
            } catch (e) {
                console.log('No response body available');
            }
        } else {
            console.log('❌ Webhook test failed');
            console.log('Response status:', response.status);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ Webhook test timed out after 10 seconds');
        } else {
            console.log('❌ Webhook test error:', error.message);
        }
    }
}

// Run the test
console.log('Starting webhook test...');
testWebhook();