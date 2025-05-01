import express from 'express';
import  prisma, { login,registerUser } from '../middlewares/user.js';
import { me } from '../middlewares/user.js';
import cors from 'cors';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed HTTP methods
  credentials: true // Enable cookies if needed
}));

app.use(express.json());

// User routes
app.post('/login',login)


app.get('/me',me)


app.post('/signup',registerUser)
export default app;
