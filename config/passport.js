const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//load tests model
//const Test = mongoose.model('tests');

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            //Here substring() removes the ? sign and all the chars after it so we put in our db onli the adress of the image without other parameters.
            const newTest = {
                //stuff we are putting in our DB
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            };
console.log(profile);
            //check for existing user
            /*Test.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    //If the user exists we return user
                    done(null, user);
                } else {
                    //if not, create user and return it.
                    new User(newTest)
                        .save()
                        .then(user => done(null, user));
                }
            });*/
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });

};