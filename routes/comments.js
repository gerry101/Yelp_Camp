var Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware"),
    express = require("express"),
    router  = express.Router();

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(err) {
           req.flash("error", "Campground not found!");
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
});

router.post("/campgrounds/:id/comments", function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
      if(err) {
          req.flash("error", "Campground not found!");
          res.redirect("/campgrounds");
      } else{
          Comment.create(req.body.comment, function(err, comment) {
              if(err) {
                  req.flash("error", "Comment not created!");
              } else {
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  campground.comments.unshift(comment);
                  campground.save();
                  req.flash("success", "Comment added successfuly");
                  res.redirect("/campgrounds/" + req.params.id);
              }
          });
      }
   }); 
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentAuthor, function(req, res) {
   Comment.findById(req.params.comment_id, function(err, comment) {
       if(err) {
           res.redirect("back");
       } else {
           res.render("comments/edit", {comment: comment, campground_id: req.params.id});
       } 
   });
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthor, function(req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
      if(err) {
          req.flash("error", "An error has occured!");
          res.redirect("back");
      } else {
          req.flash("success", "Comment eddited successfuly");
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentAuthor, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
      if(err) {
          req.flash("error", "An error has occured!");
          res.redirect("back");
      } else {
          req.flash("success", "Comment removed");
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});

module.exports = router;