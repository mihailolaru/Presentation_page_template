const express = require('express');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');
const AdminBroMongoose = require('admin-bro-mongoose');

const mongoose = require('mongoose');

//Register adapter
AdminBro.registerAdapter(AdminBroMongoose);

//Pass resources to AdminBro.
const adminBro = new AdminBro({
  //Here we pass a resource to adminBro so since we will use our db we pass the 
  //mongoose.
  databases: [mongoose],
  rootPath: '/admin',
});

// The environmental vars for the login test. We define an admin object with email and password.
const ADMIN = {
  email: process.env.ADMIN_EMAIL || 'mihai_olaru@ymail.com',
  password: process.env.ADMIN_PASSWORD || 'password'
}

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  cookieName: process.env.ADMIN_COOKIE_NAME || 'admin-bro',
  cookiePassword: process.env.ADMIN_COOKIE_PASS || 'supersecret-password',
  authenticate: async (email, password) => {
// in the real situation you would createa a user and put it in an db and after authenticate it against a password.
//In our case we will just create some environmental variables.
    if(email === ADMIN.email && password === ADMIN.password) {
      return ADMIN;
    } else {
      return null;
    }
  }
});

module.exports = router;