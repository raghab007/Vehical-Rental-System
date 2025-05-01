import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const Secret_KEY = 'Alish';
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    
    // Verify token
    console.log(token)
    const decoded =  jwt.verify(token, Secret_KEY);
    console.log("decoded:"+decoded.email)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'ADMIN' || req.user.role==="admin")) {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};

export { auth, admin };