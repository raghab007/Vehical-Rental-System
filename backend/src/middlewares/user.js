import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const SECRET_KEY = 'Alish';
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Hash a password
async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

// Verify a password against a hash
async function verifyPassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (err) {
    console.error('Error verifying password:', err);
    throw err;
  }
}

// Register a new user
export async function registerUser(req, res) {
  const { email, password, firstName, lastName, address, contactNumber } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        address,
        contactNumber,
      },
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// User login
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ token: null, message: 'Invalid credentials 1' });
    }

    console.log(user.password)
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ token: null, message: 'Invalid credentials 2' });
    }
    const token = jwt.sign({ email: user.email }, SECRET_KEY);

    res.status(200).json({
      token,
      message: 'Login successful',
      role: user.role.toUpperCase(),    
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Get current user information
export async function me(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findFirst({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = user.role.toUpperCase();
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
}

export default prisma;
