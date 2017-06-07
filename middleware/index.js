var Campground    = require("../models/campground"),
    Comment       = require("../models/comment"),
    middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCampgroundAuthor  = function (req, res, next) {
        if(req.isAuthenticated()) {
          Campground.findById(req.params.id, function(err, campground) {
          if(err) {
              req.flash("error", "Campground not found!");
              res.redirect("back");
          } else {
              if (campground.author.id.equals(req.user._id)) {
                  next();
              } else {
                  req.flash("error", "You don't have permission to do that!");
                  res.redirect("back");
              }
          }
       });  
       } else {
           req.flash("error", "You have to login to do that!");
           res.redirect("back");
       }
    }

middlewareObj.checkCommentAuthor  = function (req, res, next) {
        if(req.isAuthenticated()) {
          Comment.findById(req.params.comment_id, function(err, comment) {
          if(err) {
              req.flash("error", "An error has occured!");
              res.redirect("back");
          } else {
              if (comment.author.id.equals(req.user._id)) {
                  next();
              } else {
                  req.flash("error", "You don't have permission to do that!");
                  res.redirect("back");
              }
          }
       });  
       } else {
           req.flash("error", "You have to login to do that!");
           res.redirect("back");
       }
    }

module.exports = middlewareObj;