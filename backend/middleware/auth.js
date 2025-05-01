const jwt = require('jsonwebtoken');
const { models } = require('../db_models');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ err: 'No token provided, please log in' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('DECODED USER', decoded);
        req.user = decoded; // Attach user payload to request
        next();
    } catch (err) {
        return res.status(401).json({ err: 'Invalid or expired token, please log in' });
    }
}


const authorizeParent = (req, res, next) => {
    if (req.user?.roles?.includes('3')) {
        next();
    } else {
        return res.status(403).json({ err: 'Unauthorized to perform action' });
    }
}


/**
 * Middleware to check if the logged-in user is the owner of a resource
 * 
 * @param {string} modelName - Sequelize model name (e.g., 'Order', 'Product', 'Shop')
 * @param {string} resourceIdParam - Request parameter name (e.g., 'orderId', 'productId')
 * @param {string} ownerKey - The field in the model that references user_id (e.g., 'user_id' or 'owner_id')
 */
const authorizeResourceOwner = (modelName, resourceIdParam, ownerKey = 'user_id') => {
    console.log({ modelName, resourceIdParam })
    return async (req, res, next) => {
        try {
            const { user_id } = req.user; // Decoded from your auth middleware
            const resourceId = req.params[resourceIdParam] || user_id;

            const Model = models[modelName];
            if (!Model) {
                return res.status(500).json({ err: `Model ${modelName} not found` });
            }

            const resource = await Model.findByPk(resourceId);

            if (!resource) {
                return res.status(404).json({ err: `${modelName} not found` });
            }

            if (resource[ownerKey] !== user_id) {
                return res.status(403).json({ err: `Forbidden: You do not own this ${modelName}` });
            }

            // Attach resource to request if you want downstream access
            req.resource = resource;

            next();
        } catch (error) {
            console.error('Authorization Error:', error);
            res.status(500).json({ err: 'Server error during authorization' });
        }
    };
};


const authorizeAdmin = (req, res, next) => {
    if (req.user?.roles?.includes('1')) {
        next();
    } else {
        return res.status(403).json({ err: 'Unauthorized to perform action' });
    }
}

module.exports = { authMiddleware, authorizeParent, authorizeAdmin, authorizeResourceOwner };