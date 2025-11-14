// src/firebaseAdmin.ts
import fs from "fs";
import path from "path";
import admin from "firebase-admin";
import dotenv from "dotenv";
// import serviceAccount from "./serviceAccountKey.json";

// Make sure you have your service account JSON
// e.g., process.env.FIREBASE_ADMIN_JSON = JSON.stringify(serviceAccount)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_ADMIN_JSON as string)
    ),
  });
}


dotenv.config(); // load .env locally

const dbUrl = process.env.FIREBASE_DATABASE_URL;

// If GOOGLE_APPLICATION_CREDENTIALS env is set to a filepath, read it.
const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let serviceAccount: admin.ServiceAccount | undefined;

if (credPath) {
  const resolved = path.resolve(credPath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Firebase service account file not found at ${resolved}`);
  }
  const raw = fs.readFileSync(resolved, "utf8");
  serviceAccount = JSON.parse(raw);
} else {
  throw new Error(
    "Missing GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON file."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount!),
    ...(dbUrl ? { databaseURL: dbUrl } : {}),
  });
}

export const firebaseAdmin = admin;
export const auth = admin.auth();
export const firestore = admin.firestore();
export const adminDb = admin.firestore()
export default admin;
