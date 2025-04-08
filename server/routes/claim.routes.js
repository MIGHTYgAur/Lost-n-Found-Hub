const express = require('express');
const prisma = require('../prisma/client'); // Adjust the path to your Prisma client
const claimRouter = express.Router();

// Create a new claim
claimRouter.post('/', async (req, res) => {
  const { userId, itemId, message } = req.body;

  if (!userId || !itemId || !message) {
    return res.status(400).json({ error: 'Missing required fields: userId, itemId, or message' });
  }

  try {
    const claim = await prisma.claim.create({
      data: {
        userId,
        itemId,
        message,
        status: 'PENDING', // Default status for a new claim
      },
    });
    res.status(201).json(claim);
  } catch (error) {
    console.error('Error creating claim:', error);
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

module.exports = claimRouter;