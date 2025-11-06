import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

// Initialize Express
const app = express()

// Connect to database
await connectDB()
await connectCloudinary()

// Allow both localhost (Vite) and your deployed frontend
const allowlist = [
  'http://localhost:5173',                                  // Vite dev
  'https://lms-frontend-black-kappa.vercel.app'             // Prod
];

// Optional: allow any Vercel preview like https://something.vercel.app
const vercelPreview = /\.vercel\.app$/;

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // non-browser or same-origin
    const ok =
      allowlist.includes(origin) ||
      vercelPreview.test(origin);
    return ok ? cb(null, true) : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept','X-Requested-With']
}));


// Middlewares
app.use(clerkMiddleware())

// Routes
app.get( '/',(req,res)=> res.send('API Working') )
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',  express.json(), educatorRouter)
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user', express.json(),userRouter)
app.post('/stripe',express.raw({type: 'application/json'}),stripeWebhooks)

// Port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`) )