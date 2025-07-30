# 🔧 Make.com Webhook Troubleshooting Guide

## 🚨 Quick Diagnosis Steps

1. **Open the debug page**: `form-debug.html`
2. **Check the debug console** (green box in top-right)
3. **Test configuration** - Click "Test Configuration"
4. **Test webhook directly** - Click "Test Webhook Direct"
5. **Submit the form** - Watch the debug logs

## 🔴 Problem Categories & Solutions

### Category 1: Form Setup Errors

#### ❌ Form action isn't set to Make.com webhook
**Symptoms**: Form submits to Netlify only, no webhook triggered
**Solution**: 
- The form should NOT have an action attribute
- Let JavaScript handle the submission
- Ensure `data-netlify="true"` is present for Netlify backup

#### ❌ Form is submitting to Netlify or nowhere
**Symptoms**: Page refreshes, no webhook logs
**Solution**:
- Check that `event.preventDefault()` is called
- Ensure form has proper `name="contact"` attribute
- Verify JavaScript is loading without errors

#### ❌ Netlify hijacks the form
**Symptoms**: Form submits before JavaScript can intercept
**Solution**:
- Remove any `action` attributes from the form
- Use `data-netlify="true"` instead of `action="/"`
- Ensure JavaScript loads before form submission

#### ❌ Form uses GET instead of POST
**Symptoms**: Make.com receives query string instead of JSON
**Solution**:
- Ensure form has `method="POST"` or no method (defaults to GET)
- JavaScript will override this with POST to webhook

#### ❌ Form name is missing
**Symptoms**: Netlify rejects form, webhook may not trigger
**Solution**:
- Add `name="contact"` to the form
- Add `<input type="hidden" name="form-name" value="contact">`

#### ❌ Missing required input name attributes
**Symptoms**: Empty data sent to webhook
**Solution**:
- Ensure all inputs have `name` attributes: `name="name"`, `name="email"`, etc.
- Check for typos in field names

### Category 2: JavaScript Errors

#### ❌ JS isn't executing at all
**Symptoms**: No debug logs, form submits normally
**Solution**:
- Check browser console for JavaScript errors
- Ensure `script.js` is loaded after `config.js`
- Verify script tags are in the correct order

#### ❌ DOM hasn't loaded yet
**Symptoms**: "Form not found" errors
**Solution**:
- Script now uses `DOMContentLoaded` event
- Form is found using multiple selectors
- Debug logs will show if form is found

#### ❌ Wrong form ID
**Symptoms**: "No contact form found" error
**Solution**:
- Script looks for: `form[name="contact"]`, `form[data-netlify="true"]`, `#contact-form`
- Ensure your form matches one of these selectors

#### ❌ Syntax error in script
**Symptoms**: JavaScript fails to load
**Solution**:
- Check browser console for syntax errors
- Use the debug page to test script loading
- Look for missing brackets, semicolons, etc.

#### ❌ Not preventing default submit behavior
**Symptoms**: Page refreshes before webhook sends
**Solution**:
- `event.preventDefault()` is now called immediately
- Debug logs will show "Default form submission prevented"

#### ❌ JavaScript fails silently
**Symptoms**: No visible errors but webhook doesn't work
**Solution**:
- Debug logging is now enabled by default
- Check the debug console for detailed logs
- All errors are now logged with timestamps

### Category 3: Make.com Webhook Setup

#### ❌ Make scenario not running
**Symptoms**: Webhook returns 200 but no automation triggers
**Solution**:
- Go to Make.com and check if scenario is ON
- Click "Run once" to test the scenario
- Check scenario logs for errors

#### ❌ Webhook URL expired
**Symptoms**: 404 or 410 errors from webhook
**Solution**:
- Get fresh webhook URL from Make.com
- Update `config.js` with new URL
- Test with debug page

#### ❌ Webhook URL has typo
**Symptoms**: Network errors or 404 responses
**Solution**:
- Copy webhook URL exactly from Make.com
- Check for extra spaces or characters
- Use debug page to test URL

#### ❌ Webhook expects different format
**Symptoms**: 400 errors or data not parsed correctly
**Solution**:
- Current format: JSON with `name`, `email`, `phone`, `service`, `message`
- Check Make.com webhook settings
- Verify data mapping in Make scenario

#### ❌ CORS or spam filter blocking
**Symptoms**: Network errors in browser console
**Solution**:
- Test from deployed site, not localhost
- Check browser privacy settings
- Try different browser or incognito mode

### Category 4: Netlify Interference

#### ❌ Netlify intercepts form before JS
**Symptoms**: Form submits to Netlify, no webhook logs
**Solution**:
- Remove any `action` attributes
- Use `data-netlify="true"` for backup only
- JavaScript handles primary submission

#### ❌ Testing locally
**Symptoms**: Netlify forms don't work on localhost
**Solution**:
- Deploy to Netlify for testing
- Use debug page to test webhook directly
- Check if webhook works from localhost

#### ❌ Site is cached
**Symptoms**: Old code running despite updates
**Solution**:
- Hard refresh (Ctrl+F5)
- Clear browser cache
- Test in incognito mode

#### ❌ Form redirects before JS runs
**Symptoms**: Page redirects immediately
**Solution**:
- Remove any `action="/success"` attributes
- Let JavaScript handle all form processing
- No redirects until after webhook success

### Category 5: CORS / Fetch Issues

#### ❌ Missing Content-Type header
**Symptoms**: Make.com doesn't parse data correctly
**Solution**:
- Headers now include `Content-Type: application/json`
- Also includes `Accept: application/json`
- Debug logs show request headers

#### ❌ Not stringifying JSON
**Symptoms**: Network errors or malformed data
**Solution**:
- `JSON.stringify()` is now used consistently
- Debug logs show the exact JSON being sent
- Request body is logged for verification

#### ❌ Make returns error but not logged
**Symptoms**: Webhook appears to fail silently
**Solution**:
- Response body is now logged
- HTTP status codes are logged
- All errors are captured and displayed

#### ❌ Browser privacy settings
**Symptoms**: Works in some browsers but not others
**Solution**:
- Check browser privacy/security settings
- Try incognito/private mode
- Test on different browsers

### Category 6: Human Error

#### ❌ Wrong form being submitted
**Symptoms**: Multiple forms on page, wrong one targeted
**Solution**:
- Ensure correct form has `name="contact"`
- Check form selectors in debug logs
- Remove or rename other forms

#### ❌ Testing on wrong build
**Symptoms**: Changes don't appear to work
**Solution**:
- Check if you're on the right deployment
- Verify changes are deployed
- Clear cache and hard refresh

#### ❌ Webhook scenario not connected
**Symptoms**: Webhook succeeds but no automation
**Solution**:
- Check Make.com scenario connections
- Ensure webhook is connected to next module
- Test scenario manually

#### ❌ Webhook in wrong form
**Symptoms**: Hidden form being submitted instead
**Solution**:
- Ensure webhook code is on the visible form
- Check for hidden forms that might be submitting
- Verify form selectors target correct form

## 🛠️ Debug Tools

### 1. Debug Page (`form-debug.html`)
- Real-time debug console
- Configuration testing
- Direct webhook testing
- Form submission simulation

### 2. Browser Console
- JavaScript errors
- Network requests
- Console.log outputs

### 3. Network Tab
- Check if webhook request is sent
- View request/response details
- Check for CORS errors

### 4. Make.com Logs
- Scenario execution logs
- Webhook reception logs
- Error messages

## 🔍 Step-by-Step Debugging

1. **Open debug page** and check configuration
2. **Test webhook directly** - if this fails, it's a Make.com issue
3. **Submit form** and watch debug logs
4. **Check browser console** for errors
5. **Check network tab** for webhook request
6. **Check Make.com** for scenario execution

## 🚀 Quick Fixes

### If webhook works directly but not from form:
- Check form selectors
- Verify JavaScript is loading
- Check for JavaScript errors

### If webhook doesn't work at all:
- Verify webhook URL is correct
- Check Make.com scenario is ON
- Test from deployed site, not localhost

### If form submits but no webhook:
- Check `event.preventDefault()` is called
- Verify form has correct name attribute
- Ensure JavaScript loads before form submission

### If webhook succeeds but no automation:
- Check Make.com scenario connections
- Verify data mapping in Make scenario
- Test scenario manually

## 📞 Getting Help

If you're still having issues:

1. **Collect debug logs** from the debug page
2. **Screenshot browser console** errors
3. **Check Make.com scenario logs**
4. **Test webhook directly** and note results
5. **Describe exactly what happens** when you submit the form

The debug page will show you exactly where the process is failing, making it much easier to identify and fix the issue.