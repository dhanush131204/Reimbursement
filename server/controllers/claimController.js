import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// @desc    Get all claims (Admin) or User's claims (Employee)
// @route   GET /api/claims
// @access  Private
export const getClaims = async (req, res) => {
  try {
    let claims;
    if (req.user.role === 'ADMIN') {
      claims = await prisma.claim.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      claims = await prisma.claim.findMany({
        where: { userId: req.user.id },
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
  const { category, purpose, totalAmount, amountSpentOn, notes, expenseDate } = req.body;

  try {
    const claim = await prisma.claim.create({
      data: {
        vizNo: `VIZ-${Date.now()}`,
        userId: req.user.id,
        category,
        purpose,
        totalAmount: Number(totalAmount),
        amountSpentOn,
        notes,
        expenseDate: new Date(expenseDate),
      },
    });
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating claim' });
  }
};

// @desc    Update claim status
// @route   PATCH /api/claims/:id/status
// @access  Private (Admin)
export const updateClaimStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const updatedClaim = await prisma.claim.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updatedClaim);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating claim' });
  }
};
