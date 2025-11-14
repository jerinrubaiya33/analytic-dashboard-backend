import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // load .env locally

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_JSON as string)
    ),
    ...(process.env.FIREBASE_DATABASE_URL
      ? { databaseURL: process.env.FIREBASE_DATABASE_URL }
      : {}),
  });
}

// Exports
export const firebaseAdmin = admin;
export const auth = admin.auth();
export const firestore = admin.firestore();
export const adminDb = admin.firestore();

export default admin;
