// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { adminDb } from "./lib/firebaseAdmin"; // admin SDK
import admin from "firebase-admin";
import { adminDb } from "./firebaseAdmin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// -------------------- MIDDLEWARE -------------------- //
const allowedOrigins = [
  "http://localhost:3000",
  "https://analytic-dashboard-frontend.vercel.app",
  "https://analytic-dashboard-frontend-5kao8fv57.vercel.app", 
  "https://analytic-dashb-git-55e11f-jerinrubaiyakhan11-gmailcoms-projects.vercel.app",
  "https://analytic-dashboard-frontend-git-main-jerinrubaiyakhan11-gmailcoms-projects.vercel.app",
  "https://analytic-dashboard-frontend.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());


// -------------------- HARD-CODED USER -------------------- //
const user = {
  email: process.env.ADMIN_EMAIL || "admin@example.com",
  password: process.env.ADMIN_PASSWORD || "password123",
};

const JWT_SECRET: string = process.env.JWT_SECRET || "default_secret";

// -------------------- JWT AUTHENTICATION MIDDLEWARE -------------------- //
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}

// -------------------- ROUTES -------------------- //

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});

// Debug cookies endpoint
app.get("/api/debug-cookies", (req: Request, res: Response) => {
  res.json({
    cookies: req.cookies,
    headers: req.headers,
  });
});

// Login route
app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (email === user.email && password === user.password) {
    const payload = { email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

   res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
});


    return res.status(200).json({
      message: "Login successful",
      user: { email: user.email },
      token,
    });
  }

  return res.status(401).json({ message: "Invalid email or password" });
});

// Get current user info
app.get("/api/me", authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ email: user.email });
});

// Logout route
app.post("/api/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
});

// // Protected route example
// app.get("/api/protected", authenticateToken, (req: Request, res: Response) => {
//   const user = (req as any).user;
//   res.json({ message: "This is protected data", user });
// });
app.get("/api/protected", authenticateToken, (req: Request, res: Response) => {
  res.json({
    message: "Access granted",
    user: (req as any).user,
  });
});
// Test products route
app.get("/api/products-test", authenticateToken, (req: Request, res: Response) => {
  const products = [
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
  ];
  const user = (req as any).user;
  res.json({
    message: `Hello ${user.email}, here are your products`,
    products,
  });
});

// -------------------- FIREBASE ADMIN PRODUCTS ROUTES -------------------- //

// Get all products
app.get("/api/products", authenticateToken, async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection("products").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product
app.post("/api/products", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const docRef = await adminDb.collection("products").add({
      name,
      price: Number(price),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error("Error creating product:", err);
    return res.status(500).json({ error: "Failed to create product" });
  }
});

// Delete product
app.delete("/api/products/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminDb.collection("products").doc(id).delete();
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// -------------------- STEP 4: ADDITIONAL PRODUCT ROUTES -------------------- //

// Create Product
app.post("/api/products", async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const docRef = await adminDb.collection("products").add({
      name,
      price,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newProduct = await docRef.get();

    res.status(201).json({ id: docRef.id, ...newProduct.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Delete Product
app.delete("/api/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminDb.collection("products").doc(id).delete();
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// -------------------- START SERVER -------------------- //
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("=== Available Routes ===");
  console.log("GET  /");
  console.log("GET  /api/debug-cookies");
  console.log("POST /api/login");
  console.log("GET  /api/me (protected)");
  console.log("POST /api/logout");
  console.log("GET  /api/protected (protected)");
  console.log("GET  /api/products-test (protected)");
  console.log("GET  /api/products (protected)");
  console.log("POST /api/products (protected)");
  console.log("DELETE /api/products/:id (protected)");
});
