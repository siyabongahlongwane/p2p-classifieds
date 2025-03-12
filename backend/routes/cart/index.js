const express = require('express');
const { cart } = require('../../controllers');
const router = express.Router();

router.post('/add-cart-item', cart.addToCart);
router.get('/fetch-cart', cart.fetchCart);
router.delete('/remove-cart-item/:cart_item_id', cart.removeFromCart);

module.exports = router;