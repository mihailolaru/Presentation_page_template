//This function checks if it is authenticated then return next() else it redirects to '/'.
// For now this is just for test. The function s will be activated after integration of user login system.

module.exports = {
    /*ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },*/
    
    ensureGuest: function(req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect('/dashboard');
        } else {
            return next();
        }
    }
};