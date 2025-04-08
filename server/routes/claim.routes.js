import express from 'express';
import { PrismaClient } from '@prisma/client'; // Uncomment if using Prisma Client directly

const claimRouter = express.Router();
const prisma = new PrismaClient();
// Create a new claim
claimRouter.post('/', async (req, res) => {
  const { userId, itemId, secretDetails, contactInfo } = req.body;

  if (!userId || !itemId || !secretDetails || !contactInfo) {
    return res.status(400).json({ error: 'Missing required fields: userId, itemId, or message' });
  }
  //check if a claim already exists for this item and user
    const existingClaim = await prisma.claim.findFirst({
        where: {
        foundItemId: itemId,
        claimantId: userId,
        },
    });
    if (existingClaim) {
        return res.status(400).json({ error: 'Claim already exists for this item and user' });
    }
  try {
    const claim = await prisma.claim.create({
      data: {
        foundItemId: itemId,
        claimantId: userId,
        contactInfo,
        details: secretDetails,
        status: 'PENDING', // Default status for a new claim
        claimDate: new Date(), // Set the claim date to now
    },
    });
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get claims for a specific user
claimRouter.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const claims = await prisma.claim.findMany({
        where: { claimantId: userId },
        include: {
          foundItem: true, // Include details of the found item
        },
      });
  
      if (!claims || claims.length === 0) {
        return res.status(404).json({ error: 'No claims found for this user' });
      }
  
      res.json(claims);
    } catch (error) {
      console.error('Error fetching user claims:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Get claims for items reported by the founder
claimRouter.get('/founder/:founderId', async (req, res) => {
    const { founderId } = req.params;
  
    try {
      const claims = await prisma.claim.findMany({
        where: {
          foundItem: {
            // the found item has user reference
            userId: founderId, // Filter claims for items reported by this founder
          },
        },
        include: {
          foundItem: true, // Include details of the found item
          claimant: true,  // Include details of the claimant
        },
      });
  
      const filteredClaims = claims.map((claim) => ({
        ...claim,
        contactInfo: claim.status === 'APPROVED' ? claim.contactInfo : null, // Hide contact info if not approved
      }));
  
      if (!filteredClaims || filteredClaims.length === 0) {
        return res.status(404).json({ error: 'No claims found for items reported by this founder' });
      }
  
      res.json(filteredClaims);
    } catch (error) {
      console.error('Error fetching claims for founder:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

// Get all claims
claimRouter.get('/', async (req, res) => {
  try {
    const claims = await prisma.claim.findMany({
      include: {
        user: true, // Include user details
        item: true, // Include item details
      },
    });
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific claim by ID
claimRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        user: true,
        item: true,
      },
    });

    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a claim's status
claimRouter.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: { status },
    });

    res.json(updatedClaim);
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a claim
claimRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.claim.delete({
      where: { id },
    });

    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default claimRouter;