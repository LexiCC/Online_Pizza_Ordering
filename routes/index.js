const express = require('express');
const db = require('../db');

const router = express.Router();


// -------- Menu
router.get('/', async (req, res) => {
  const query = "SELECT * FROM products WHERE category <> 'BYO'";
  const params = [];
  const result = await db.query(query, params);

  // -------- Customize
  const queryC = 'SELECT * FROM customizations';
  const paramsC = [];
  const resultC = await db.query(queryC, paramsC);

  res.render('index', {
    customer: req.session.user, title: 'Pizza 330', rows: result.rows, rowsC: resultC.rows, cartCount: req.session.cartCount,
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

// -----------Remove
router.delete('/cart/:id', async (req, res) => {
  for (let i = 0; i < req.session.cart.length; i += 1) {
    if (req.session.cart[i].cart_id == req.params.id) {
      req.session.cartCount -= req.session.cart[i].quantity;
      req.session.cart.splice(i, 1);
      break;
    }
  }
  res.json({ cartCount: req.session.cartCount, cart: req.session.cart });
});

router.delete('/cart', (req,res) => {
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.nextCartId = 1;
  res.json({cart: req.session.cart, cartCount: req.session.cartCount});
});

// -----------update quantity
router.put('/cart/:id', async (req,res) => {
  const cart_id = req.params.id;
  const cart = req.session.cart;
  for(let i=0; i < cart.length; i++) {
      if(cart[i].cart_id == cart_id){
          const num = cart[i].quantity;
          req.session.cartCount += req.body.quantity - num;
          cart[i].quantity = req.body.quantity;
          break;
      }
  }
  res.json({cart: req.session.cart, cartCount: req.session.cartCount});
});
