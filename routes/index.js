const express = require('express');
const db = require('../db');

const router = express.Router();


// -------- Menu
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM products';
  const params = [];
  const result = await db.query(query, params);

  // -------- Customize
  const queryC = 'SELECT * FROM customizations';
  const paramsC = [];
  const resultC = await db.query(queryC, paramsC);

  res.render('index', {
    customer: req.session.user, title: 'Pizza 330', rows: result.rows, rowsC: resultC.rows,
  });
});

// -------- Add to cart
router.post('/cart', async (req, res) => {
  const query = 'SELECT * FROM products WHERE id = $1';
  const params = [
    req.body.product_id,
  ];
  const result = await db.query(query, params);

  const itemToAdd = {
    cart_id: req.session.nextCartId,
    product_id: req.body.product_id,
    name: result.rows[0].name,
    quantity: req.body.quantity,
  };

  if (req.body.customizations) {
    itemToAdd.customizations = [];
    for (i = 0; i < req.body.customizations.length; i++) {
      const query2 = 'SELECT * FROM customizations WHERE id = $1';
      const params2 = [req.body.customizations[i]];

      const result2 = await db.query(query2, params2);
      itemToAdd.customizations.push({ id: req.body.customizations[i], name: result2.rows[0].name });
    }
  }

  req.session.cart.push(itemToAdd);
  req.session.nextCartId += 1;
  req.session.cartCount += req.body.quantity;

  res.json({ cartCount: req.session.cartCount, cart: req.session.cart });
});

module.exports = router;

// -----------cart summary
router.get('/cart', async (req, res) => {
  res.render('cart', { cart: req.session.cart, customer: req.session.customer, cartCount: req.session.cartCount });
});
