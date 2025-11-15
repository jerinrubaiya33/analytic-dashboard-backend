// src/index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { adminDb } from "./firebaseAdmin";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration
const config = {
  user: {
    email: process.env.ADMIN_EMAIL || "admin@example.com",
    password: process.env.ADMIN_PASSWORD || "password123",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "default_secret",
    expiresIn: "24h"
  },
  cors: {
    origins: [
      "http://localhost:3000",
      "https://analytic-dashboard-frontend.vercel.app",
      "https://analytic-dashboard-frontend-5kao8fv57.vercel.app",
      "https://analytic-dashb-git-55e11f-jerinrubaiyakhan11-gmailcoms-projects.vercel.app",
      "https://analytic-dashboard-frontend-git-main-jerinrubaiyakhan11-gmailcoms-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
  }
};

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.cors.origins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
}));

app.use(express.json());
app.use(cookieParser());

// Request logging middleware (optional for production)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  let token = req.cookies.token;
  
  const authHeader = req.headers.authorization;
  if (!token && authHeader?.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as { email: string };
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
  }
}

// Utility functions
const createAuthToken = (email: string): string => {
  return jwt.sign({ email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const setAuthCookie = (res: Response, token: string): void => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

// Routes

// Health check
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Backend is running!" });
});

// Authentication routes
app.post("/api/login", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (email === config.user.email && password === config.user.password) {
    const token = createAuthToken(config.user.email);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful",
      user: { email: config.user.email },
      token,
    });
  }

  return res.status(401).json({ message: "Invalid email or password" });
});

app.get("/api/me", authenticateToken, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ email: user.email });
});

app.post("/api/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
});

// Products routes
app.get("/api/products", authenticateToken, async (req: Request, res: Response) => {
  try {
    const snapshot = await adminDb.collection("products").get();
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

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

    res.status(201).json({ id: docRef.id });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

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

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Global error handler:", err);
  
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS policy violation" });
  }
  
  res.status(500).json({ message: "Internal server error" });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Environment:", process.env.NODE_ENV || "development");
});
