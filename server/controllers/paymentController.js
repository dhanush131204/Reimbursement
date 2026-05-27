import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys are not configured');
  }

  return { keyId, keySecret };
};

const razorpayRequest = async (path, options = {}) => {
  const { keyId, keySecret } = getRazorpayConfig();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch(`${RAZORPAY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.description || 'Razorpay request failed');
  }

  return data;
};

const getApprovedClaims = async (claimIds) => {
  const claims = await prisma.claim.findMany({
    where: {
      id: { in: claimIds },
      status: 'APPROVED',
    },
  });

  if (claims.length !== claimIds.length) {
    throw new Error('Only approved unpaid claims can be paid');
  }

  return claims;
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { keyId } = getRazorpayConfig();
    const claimIds = Array.isArray(req.body.claimIds) ? req.body.claimIds.map(Number).filter(Boolean) : [];

    if (!claimIds.length) {
      return res.status(400).json({ message: 'Select at least one approved claim to pay' });
    }

    const claims = await getApprovedClaims(claimIds);
    const amount = Math.round(claims.reduce((total, claim) => total + Number(claim.totalAmount || 0), 0) * 100);

    if (amount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be greater than zero' });
    }

    const order = await razorpayRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount,
        currency: process.env.RAZORPAY_CURRENCY || 'INR',
        receipt: `claims_${Date.now()}`,
        notes: {
          claimIds: claimIds.join(','),
          processedById: String(req.user.id),
        },
      }),
    });

    res.status(201).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      claimIds,
      name: 'Third Vizion',
      description: `${claims.length} reimbursement payment${claims.length > 1 ? 's' : ''}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create Razorpay order' });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { keySecret } = getRazorpayConfig();
    const { claimIds = [], razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const numericClaimIds = Array.isArray(claimIds) ? claimIds.map(Number).filter(Boolean) : [];

    if (!numericClaimIds.length || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment verification details' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const claims = await getApprovedClaims(numericClaimIds);
    const expectedAmount = Math.round(claims.reduce((total, claim) => total + Number(claim.totalAmount || 0), 0) * 100);
    const order = await razorpayRequest(`/orders/${razorpay_order_id}`);

    if (order.amount !== expectedAmount || order.currency !== (process.env.RAZORPAY_CURRENCY || 'INR')) {
      return res.status(400).json({ message: 'Payment amount verification failed' });
    }

    await prisma.$transaction(
      claims.map((claim) =>
        prisma.claim.update({
          where: { id: claim.id },
          data: {
            status: 'PAID',
            payment: {
              upsert: {
                create: {
                  amount: claim.totalAmount,
                  processedById: req.user.id,
                },
                update: {
                  amount: claim.totalAmount,
                  processedById: req.user.id,
                  dateProcessed: new Date(),
                },
              },
            },
          },
        }),
      ),
    );

    res.json({ message: 'Payment verified and claims marked as paid' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to verify Razorpay payment' });
  }
};
