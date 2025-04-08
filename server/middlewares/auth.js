import jwt from 'jsonwebtoken';

// Middleware to authenticate token
export const authenticateToken = (req, res, next) => {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to the request object
        req.user = verified;

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};
