const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const storage = new Storage({
    keyFilename: 'path/to/your/service-account-key.json', // Path to your service account JSON key file
});

const bucketName = 'your-bucket-name'; // Replace with your Google Cloud Storage bucket name

async function uploadFile(filePath, destinationFileName) {
    try {
        await storage.bucket(bucketName).upload(filePath, {
            destination: destinationFileName,
        });

        console.log(`File uploaded to ${bucketName}/${destinationFileName}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

// Example usage
const filePath = 'path/to/your/file'; // Path to the file you want to upload
const destinationFileName = 'uploaded-file.txt'; // Name for the file in Google Cloud Storage

uploadFile(filePath, destinationFileName);
