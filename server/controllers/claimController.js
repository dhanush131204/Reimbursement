import { PrismaClient } from '@prisma/client';
import { sendMail } from '../utils/emailService.js';

const prisma = new PrismaClient();

// @desc    Get all claims (Admin) or User's claims (Employee)
// @route   GET /api/claims
// @access  Private
export const getClaims = async (req, res) => {
  try {
    let claims;
    if (req.user.role === 'ADMIN') {
      claims = await prisma.claim.findMany({
        include: {
          user: { select: { name: true, email: true, contactNumber: true, vizNo: true, designation: true } },
          receipts: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      claims = await prisma.claim.findMany({
        where: { userId: req.user.id },
        include: {
          user: { select: { name: true, email: true, contactNumber: true, vizNo: true, designation: true } },
          receipts: true,
        },
        orderBy: { createdAt: 'desc' }
      });
    }
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching claims' });
  }
};

// @desc    Create a new claim
// @route   POST /api/claims
// @access  Private (Employee)
export const createClaim = async (req, res) => {
  const { category, purpose, totalAmount, amountSpentOn, notes, expenseDate, vizNo, receiptUrl, personalDetails, contactNumber } = req.body;

  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Not authorized to create claim' });
    }

    if (!category || !purpose || totalAmount === undefined || totalAmount === null || !expenseDate) {
      return res.status(400).json({ message: 'Please complete all required expense details' });
    }

    const parsedAmount = Number(totalAmount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'Please enter a valid amount' });
    }

    const parsedExpenseDate = new Date(expenseDate);
    if (Number.isNaN(parsedExpenseDate.getTime())) {
      return res.status(400).json({ message: 'Please select a valid request date' });
    }

    const submittedContactNumber = (contactNumber || personalDetails?.contact || '').trim();

    if (submittedContactNumber) {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { contactNumber: submittedContactNumber },
      });
    }

    const claim = await prisma.claim.create({
      data: {
        vizNo: String(vizNo || `VIZ-${Date.now()}`),
        userId: req.user.id,
        category,
        purpose,
        totalAmount: parsedAmount,
        amountSpentOn: amountSpentOn || null,
        notes: notes || null,
        expenseDate: parsedExpenseDate,
      },
    });

    if (receiptUrl) {
      await prisma.receipt.create({
        data: {
          claimId: claim.id,
          fileUrl: receiptUrl
        }
      });
    }
    res.status(201).json(claim);
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ message: error?.message || 'Server Error creating claim' });
  }
};

// @desc    Update claim status
// @route   PATCH /api/claims/:id/status
// @access  Private (Admin)
export const updateClaimStatus = async (req, res) => {
  const { status, notes } = req.body;
  const { id } = req.params;

  try {
    const updatedClaim = await prisma.claim.update({
      where: { id: Number(id) },
      data: {
        status,
        ...(notes && { notes })
      },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (status === 'APPROVED' || status === 'REJECTED' || status === 'PAID') {
      await sendMail(updatedClaim.user.email, updatedClaim.user.name, status.toLowerCase(), notes);
    }

    res.json(updatedClaim);
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ message: 'Server Error updating claim' });
  }
};

// @desc    Delete claim
// @route   DELETE /api/claims/:id
// @access  Private (Admin)
export const deleteClaim = async (req, res) => {
  const { id } = req.params;

  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admins can delete claims' });
    }

    const claim = await prisma.claim.findUnique({ where: { id: Number(id) } });

    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    // Delete related records first to avoid foreign key constraints
    await prisma.payment.deleteMany({ where: { claimId: Number(id) } });
    await prisma.receipt.deleteMany({ where: { claimId: Number(id) } });

    await prisma.claim.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Claim removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting claim' });
  }
};
