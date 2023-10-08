const { google } = require('googleapis');
const { auth } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const PROJECT_NAME = 'MyNewProject';
const BILLING_ACCOUNT_ID = 'your-billing-account-id'; // Replace with your billing account ID
const credentials = require('./path/to/your/service-account-key.json');

async function createProject() {
    try {
        const authClient = await auth.getClient({
            credentials: credentials,
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const resourcemanager = google.cloudresourcemanager({
            version: 'v1',
            auth: authClient,
        });

        const project = await resourcemanager.projects.create({
            requestBody: {
                name: PROJECT_NAME,
                billingAccountName: `billingAccounts/${BILLING_ACCOUNT_ID}`,
            },
        });

        console.log(`Project created: ${project.data.name}`);
    } catch (error) {
        console.error('Error creating project:', error.message);
    }
}

createProject();
