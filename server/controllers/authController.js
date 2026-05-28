import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/jwt.js';
import { sendMail, newUserEmailHtml } from '../utils/sendMail.js';

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
        profileImageUrl: user.profileImageUrl || null,
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
  const { name, email, password, contactNumber, vizNo, designation, role } = req.body;

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
        role: role || 'EMPLOYEE',
      },
    });

    if (user) {
      try {
        const emailHtml = newUserEmailHtml({
          userName: user.name,
          userEmail: user.email,
          plainPassword: password,
        });
        await sendMail({
          to: user.email,
          subject: 'Your Account Has Been Created',
          html: emailHtml,
        });
      } catch (emailError) {
        console.error('Failed to send e email:', emailError);
      }

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber,
        vizNo: user.vizNo,
        designation: user.designation,
        profileImageUrl: user.profileImageUrl || null,
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
  const { name, email, contactNumber, vizNo, designation, profileImageUrl } = req.body;

  try {
    // Fetch the current user from db so we can fall back to existing values
    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedName = name || currentUser.name;
    const updatedEmail = email || currentUser.email;

    // Check if email is being changed and already in use by another user
    if (updatedEmail !== currentUser.email) {
      const existingUser = await prisma.user.findUnique({ where: { email: updatedEmail } });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    const updateData = {
      name: updatedName,
      email: updatedEmail,
      contactNumber: contactNumber !== undefined ? (contactNumber || null) : currentUser.contactNumber,
      vizNo: vizNo !== undefined ? (vizNo || null) : currentUser.vizNo,
      designation: designation !== undefined ? (designation || null) : currentUser.designation,
    };

    if (profileImageUrl !== undefined) {
      updateData.profileImageUrl = profileImageUrl || null;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      vizNo: user.vizNo,
      designation: user.designation,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server Error updating profile' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/auth/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        vizNo: true,
        designation: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server Error fetching users' });
  }
};

// @desc    Delete a user (Admin) — cascades all related data
// @route   DELETE /api/auth/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' });
    }

    // 1. Delete audit logs
    await prisma.auditLog.deleteMany({ where: { userId } });

    // 2. Delete notifications
    await prisma.notification.deleteMany({ where: { userId } });

    // 3. Delete payments processed by this user
    await prisma.payment.deleteMany({ where: { processedById: userId } });

    // 4. For each claim owned by this user, delete receipts and payments first
    const userClaims = await prisma.claim.findMany({ where: { userId }, select: { id: true } });
    const claimIds = userClaims.map((c) => c.id);

    await prisma.payment.deleteMany({ where: { claimId: { in: claimIds } } });
    await prisma.receipt.deleteMany({ where: { claimId: { in: claimIds } } });
    await prisma.claim.deleteMany({ where: { userId } });

    // 5. Finally delete the user
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: `User "${user.name}" and all associated data deleted successfully` });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error?.message || 'Server Error deleting user' });
  }
};
