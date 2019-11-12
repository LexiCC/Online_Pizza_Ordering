const express = require('express');
const db = require('../db');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Pizza 330' ,customer: req.session.user});
});

module.exports = router;
