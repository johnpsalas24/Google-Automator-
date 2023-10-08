const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';
const slack = new WebClient(process.env.SLACK_API_TOKEN);

async function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
        const token = await authenticate({
            keyfilePath: TOKEN_PATH,
            scopes: SCOPES,
            client_id: oAuth2Client._clientId
        });
        oAuth2Client.setCredentials(token);
        callback(oAuth2Client);
    } catch (err) {
        console.error('Error getting new token:', err);
    }
}

async function sendSlackAlert(action, event) {
    try {
        const message = `Event ${action}: ${event.summary} at ${event.start.dateTime}`;
        await slack.chat.postMessage({
            channel: process.env.SLACK_CHANNEL_ID,
            text: message
        });
        console.log(`Slack alert sent: ${message}`);
    } catch (error) {
        console.error('Error sending Slack alert:', error);
    }
}

async function createEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });
        sendSlackAlert('created', event);
}

async function updateEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });    
    sendSlackAlert('updated', event);
}

async function deleteEvent(auth) {
    const calendar = google.calendar({ version: 'v3', auth });    
    sendSlackAlert('deleted', event);
}

// Load client secrets from a file and create an OAuth client
const credentials = require('./credentials.json');

// Assuming you have a variable `action` indicating the operation (create, update, or delete)
const action = 'create'; // Change this to 'update' or 'delete' as needed

authorize(credentials, auth => {
    if (action === 'create') {
        createEvent(auth);
    } else if (action === 'update') {
        updateEvent(auth);
    } else if (action === 'delete') {
        deleteEvent(auth);
    } else {
        console.log('Invalid action.');
    }
});
