const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Auth checker will be functional after implementing login system.
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('general_body_components/welcomePage');
});

router.get('/webDev', ensureGuest, (req, res) => {
    res.render('general_body_components/webDeveloper/webDev');
});

router.get('/photographer', ensureGuest, (req, res) => {
    res.render('general_body_components/photographer/photographer');
    //get answer form DB with the photos
});


//route for files uploading
//router.post('/upload', (req. res) => {
    //Here we are calling the upload function we defined in the app.js file.
    //upload(req, res, (err) => {
        //if(err){
            //res.render('index', {
                //msg: err
            //});
        //} else {
            //console.log(req.file);
            //res.send('test');
        //}
    //});
//});

module.exports = router;