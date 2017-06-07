var User = require("../models/user"),
    passport = require("passport"),
    express = require("express"),
    router  = express.Router();

router.get("/", function(req, res) {
   res.render("landing"); 
});

router.get("/register", function(req, res) {
   res.render("register"); 
});

router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user) {
       if(err) {
           return res.render("register", {"error": err.message});
       }
       passport.authenticate("local") (req, res, function() {
          res.redirect("/campgrounds"); 
       });
   });
});

router.get("/login", function(req, res) {
   res.render("login"); 
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/campgrounds';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
});

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/campgrounds");
});

module.exports = router;
