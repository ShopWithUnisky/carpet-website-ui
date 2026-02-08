import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";

// authDomain: use projectId.firebaseapp.com for OAuth to work.
// For production mobile: if Google sign-in redirect fails (user not logged in after redirect),
// host the app on Firebase Hosting with a custom domain and set authDomain to that domain
// so the auth iframe is same-origin. See: https://firebase.google.com/docs/auth/web/redirect-best-practices
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Must complete before redirect sign-in so auth state persists when user returns (critical on mobile).
export const authReady = setPersistence(auth, browserLocalPersistence);

export default app;
