import path from 'path';
import admin from "firebase-admin";

const serviceAccountPath = path.resolve('src/Config/serviceKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    storageBucket: process.env.FIREBASE_BUCKET_URL
})

const bucket = admin.storage().bucket();

export default bucket;
