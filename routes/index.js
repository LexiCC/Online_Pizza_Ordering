const express = require('express');
const db = require('../db');

const router = express.Router();


//-------- Menu
router.get('/', async (req, res) =>{
  let query = 'SELECT * FROM products';
  const params = [];
  const result = await db.query(query, params);

  console.log(req.session.customer, result);
  res.render('index', {customer: req.session.user, title:'Pizza 330', rows: result.rows});
});
  
//-------- Add to cart
router.post('/cart', async (req, res) =>{
  let query = 'SELECT * FROM products WHERE id = $1';
  const params = [
    req.body.product_id
  ];
  const result = await db.query(query, params);

  const itemToAdd ={
    cart_id : req.session.nextCartId,
    product_id: req.body.product_id,
    name: result.rows[0].name,
    quantity: req.body.quantity
  };

  req.session.cart.push(itemToAdd);
  req.session.nextCartId += 1;
  req.session.cartCount += req.body.quantity;

  res.json({cartCount: req.session.cartCount, cart:req.session.cart});
});

//-------- Customize
router.get('/', async (req, res) =>{
  let query = 'SELECT * FROM customizations';
  const params = [];
  const result = await db.query(query, params);

  console.log(req.session.customize, result);
  res.render('index', {customize: req.session.user, rows: result.rows});
});

router.post('/cart', async (req, res) =>{
  let query = 'SELECT * FROM customizations WHERE id = $1';
  const params = [
    req.body.product_id
  ];
  const result = await db.query(query, params);

  const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');

  const itemToAdd ={
    cart_id : req.session.nextCartId,
    product_id: req.body.product_id,
    name: checkedBoxes[0].value,
    quantity: req.body.quantity
  };

  req.session.cart.push(itemToAdd);
  req.session.nextCartId += 1;
  req.session.cartCount += req.body.quantity;

  res.json({cartCount: req.session.cartCount, cart:req.session.cart});

  res.json({cartCount: req.session.cartCount, cart:req.session.cart});
});

module.exports = router;
