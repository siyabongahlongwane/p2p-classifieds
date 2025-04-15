const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ err: 'No token provided, please log in' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user payload to request
        next();
    } catch (err) {
        return res.status(401).json({ err: 'Invalid or expired token, please log in' });
    }
}


const authorizeParent = (req, res, next) => {
    if (req.user?.roles?.includes('2')) {
        next();
    } else {
        return res.status(403).json({ err: 'Unauthorized to perform action' });
    }
}

const authorizeAdmin = (req, res, next) => {
    if (req.user?.roles?.includes('1')) {
        next();
    } else {
        return res.status(403).json({ err: 'Unauthorized to perform action' });
    }
}

module.exports = { authMiddleware, authorizeParent, authorizeAdmin };