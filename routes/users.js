//------ Get users set up
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { title: 'Pizza 330' });
});

router.post('/register', async (req, res) => {
  const errors = [];

  if (req.body.password !== req.body.passwordConf) {
    errors.push('The provided passwords do not match.');
  }

  if (!(req.body.email && req.body.username && req.body.password && req.body.passwordConf)) {
    errors.push('All fields are required.');
  }

  const selectQuery = 'SELECT * FROM customers WHERE username = $1';
  const selectResult = await db.query(selectQuery, [req.body.username]);
  console.log(selectResult);

  if (selectResult.rows.length > 0) {
    errors.push('That username is already taken.');
  }

  if (!errors.length) {
    const insertQuery = 'INSERT INTO customers (username, name, email, password) VALUES ($1, $2, $3, $4)';
    const password = await bcrypt.hash(req.body.password, 10);
    await db.query(insertQuery, [req.body.username, req.body.name, req.body.email, password]);

    res.redirect('/');
  } else {
    res.render('register', { errors });
  }
});


router.get('/login', (req, res) => {
  res.render('login', { title: 'Express' });
});

router.post('/login', async (req, res) => {
  const errors = [];

  const selectQuery = 'SELECT * FROM customers WHERE username = $1';
  const selectResult = await db.query(selectQuery, [req.body.username]);

  if (selectResult.rows.length === 1) {
    const auth = await bcrypt.compare(req.body.password, selectResult.rows[0].password);

    if (auth) {
      [req.session.user] = selectResult.rows;
      req.session.cart = [];
      req.session.cartCount = 0;
      req.session.nextCartId = 1;
      console.log(req.session.user);
      res.redirect('/');
    } else {
      errors.push('Incorrect username/password');
      res.render('login', { errors });
    }
  } else {
    errors.push('Incorrect username/password');
    res.render('login', { errors });
  }
});

router.get('/change-password', (req, res) => {
  res.render('change');
});

router.post('/change-password', async (req, res) => {
  const error = [];
  if (req.body.password !== req.body.passwordConf) {
    error.push('Password do not match.');
  }
  if (error.length) {
    res.render('change', { error });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const query = 'UPDATE customers SET password = $1 WHERE id = $2';
    await db.query(query, [hashedPassword, req.session.user.id]);

    res.redirect('/customers/logout');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//-----------Save Order
router.get('/submit', async (req,res) => {
  const orderQuery = 'INSERT INTO orders (customer_id, created_at) VALUES ($1, NOW()) RETURNING id';
  const orderParameters = [req.session.user.id];
  const orderResult = await db.query(orderQuery, orderParameters);
  const orderId = orderResult.rows[0].id;

  for(let i = 0; i < req.session.cart.length; i++) {
      const myQuery = 'INSERT INTO order_lines (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id';
      const myParameter = [orderId, req.session.cart[i].product_id, req.session.cart[i].quantity];
      const myResult = await db.query(myQuery, myParameter);
      
      if(req.session.cart[i].customizations) {
          const myId = myResult.rows[0].id;
          for(let j = 0; j < req.session.cart[i].customizations.length; j++) {
              const myQuery2 = 'INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES ($1, $2)';
              const myParameter2 = [myId, req.session.cart[i].customizations[j].id];
              await db.query(myQuery2, myParameter2);
          }         
      }
  }
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.nextCartId = 1;
  res.render('saved', {login: true});
});

module.exports = router;
