// IMPORTANT: You need to install Firebase and EmailJS SDKs if you want to use the real versions.
// Run: npm install firebase @emailjs/browser
// For now, this uses localStorage to mock the database until you configure the real keys.

import { notify } from "./notifications";

// --- CONFIGURATION ---
// 1. Get these from https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";

// 2. Get these from https://console.firebase.google.com/
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if keys are set (so it doesn't crash before you configure them)
const isFirebaseConfigured = FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
const isEmailJSConfigured = EMAILJS_SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID";

export interface VisitorRecord {
  id: string;
  name: string;
  email: string;
  timestamp: string;
  userAgent: string;
}

// --- DATABASE FUNCTIONS (Visitors) ---
export async function saveVisitor(name: string, email: string): Promise<void> {
  const visitor: VisitorRecord = {
    id: crypto.randomUUID(),
    name,
    email,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  if (isFirebaseConfigured) {
    // REAL FIREBASE CODE (Uncomment when you install firebase)
    /*
    import { initializeApp } from "firebase/app";
    import { getFirestore, collection, addDoc } from "firebase/firestore";
    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    await addDoc(collection(db, "visitors"), visitor);
    */
    console.log("Saved to real Firebase!");
  } else {
    // MOCK DATABASE USING LOCAL STORAGE
    const existing = JSON.parse(localStorage.getItem("divyos_visitors") || "[]");
    existing.push(visitor);
    localStorage.setItem("divyos_visitors", JSON.stringify(existing));
    console.log("Saved to local storage (Firebase not configured)", visitor);
  }
}

export async function getVisitors(): Promise<VisitorRecord[]> {
  if (isFirebaseConfigured) {
    // REAL FIREBASE CODE (Uncomment when you install firebase)
    /*
    import { initializeApp } from "firebase/app";
    import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";
    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    const q = query(collection(db, "visitors"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitorRecord));
    */
    return [];
  } else {
    // MOCK DATABASE
    const existing = JSON.parse(localStorage.getItem("divyos_visitors") || "[]");
    return existing.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

// --- EMAIL FUNCTIONS ---
export async function sendWelcomeEmail(name: string, email: string): Promise<void> {
  if (!isEmailJSConfigured) {
    console.log("EmailJS not configured. Would have sent email to:", email);
    return;
  }

  try {
    // We can use the REST API so we don't even need to install the NPM package!
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_name: name,
          to_email: email,
          message: `Hello ${name},\n\nThank you for visiting my personal operating system portfolio! I hope you enjoyed exploring the projects and the terminal.\n\nBest regards,\nDivy`
        }
      })
    });

    if (response.ok) {
      console.log("Email sent successfully!");
    } else {
      console.error("Failed to send email", await response.text());
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
