const { google } = require('googleapis');
const { authenticate } = require('@google-cloud/local-auth');
const dotenv = require('dotenv');
dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'];
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

async function saveSheetToDrive(auth) {
    const sheets = google.sheets({ version: 'v4', auth });
    const drive = google.drive({ version: 'v3', auth });

    // Define the spreadsheet ID you want to save to Google Drive
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';

    try {
        const { data } = await sheets.spreadsheets.get({
            spreadsheetId,
            includeGridData: false,
        });

        const fileMetadata = {
            name: 'My Google Sheet Backup',
            mimeType: 'application/vnd.google-apps.spreadsheet',
        };

        const media = {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            body: JSON.stringify(data),
        };

        await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        console.log('Google Sheet saved to Google Drive.');
    } catch (error) {
        console.error('Error saving Google Sheet to Google Drive:', error);
    }
}

// Load client secrets from a file and create an OAuth client
const credentials = require('./credentials.json');
authorize(credentials, saveSheetToDrive);
