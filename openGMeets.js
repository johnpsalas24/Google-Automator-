const { google } = require('googleapis');
const open = require('open');
const { authenticate } = require('@google-cloud/local-auth');
const dotenv = require('dotenv');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

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

async function handleEvent(event) {
    // Your code to handle Google Calendar events
    console.log(`Event Name: ${event.summary}`);
    console.log(`Event Start Time: ${event.start.dateTime}`);

    // Calculate the time difference between the current time and the event start time
    const eventStartTime = new Date(event.start.dateTime).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = eventStartTime - currentTime;

    // If the event starts within the next 2 minutes, open the meeting link
    if (timeDifference > 0 && timeDifference <= 120000) {
        console.log('Opening the meeting link...');
        open(event.hangoutLink);
    }
}

// Load client secrets from a file and create an OAuth client
const credentials = require('./credentials.json');

authorize(credentials, auth => {
    // Assuming you have a function to fetch events from Google Calendar
    const events = getEventsFromCalendar(auth);

    // Process each event and check if it's time to open the meeting link
    events.forEach(event => {
        handleEvent(event);
    });
});
