import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/jwt.js';

const prisma = new PrismaClient();

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        vizNo: user.vizNo,
        designation: user.designation,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, contactNumber, vizNo, designation } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        contactNumber: contactNumber || null,
        vizNo: vizNo || null,
        designation: designation || null,
      },
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        vizNo: user.vizNo,
        designation: user.designation,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { name, email, contactNumber, vizNo, designation } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        contactNumber: contactNumber || null,
        vizNo: vizNo || null,
        designation: designation || null,
      },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      vizNo: user.vizNo,
      designation: user.designation,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};
