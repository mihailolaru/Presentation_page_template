const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('general_body_components/welcomePage');
});

router.get('/webDev', ensureGuest, (req, res) => {
    res.render('general_body_components/webDev');
});

router.get('/photographer', ensureGuest, (req, res) => {
    res.render('general_body_components/photographer');
});

router.get('/about', (req, res) => {
    res.render('general_body_components/about');
});

module.exports = router;