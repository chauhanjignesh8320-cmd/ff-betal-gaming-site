import { initializeApp, getApps, getApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDEXZUX0TpnN1FJqsvM7SM0I7pprMtg96Q",
  authDomain: "ff-betal-2026.firebaseapp.com",
  databaseURL: "https://ff-betal-2026-default-rtdb.firebaseio.com",
  projectId: "ff-betal-2026",
  storageBucket: "ff-betal-2026.firebasestorage.app",
  messagingSenderId: "405809213360",
  appId: "1:405809213360:web:ce20e92aded63d33133075"
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getDatabase(app)
