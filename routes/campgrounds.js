var Campground = require("../models/campground"),
    middleware = require("../middleware"),
    express = require("express"),
    router  = express.Router();

router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log("Error occured");
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});   
        }
    })  
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res) {
    Campground.create(req.body.campground, function(err, campground) {
        if(err) {
            req.flash("error", "An error occured creating your campground!");
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            req.flash("success", "Campground successfuly created");
            res.redirect("/campgrounds");
        }
    })
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new"); 
});

router.get("/campgrounds/:id", function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
      if(err) {
          req.flash("error", "Campground not found!");
      } else {
          res.render("campgrounds/show", {campground: campground});
      }
   });
});

router.get("/campgrounds/:id/edit", middleware.checkCampgroundAuthor, function(req, res) {
      Campground.findById(req.params.id, function(err, campground) {
          res.render("campgrounds/edit", {campground: campground}); 
      });
});

router.put("/campgrounds/:id", middleware.checkCampgroundAuthor, function(req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
      if(err) {
          req.flash("error", "Campground not updated!");
      } else {
          req.flash("success", "Campground eddited successfuly");
          res.redirect("/campgrounds/" + req.params.id);
      }
   }); 
});

router.delete("/campgrounds/:id", middleware.checkCampgroundAuthor, function(req, res) {
   Campground.findByIdAndRemove(req.params.id, function(err) {
       if(err) {
           req.flash("error", "Campground not removed!");
       } else {
           req.flash("success", "Campground removed");
           res.redirect("/campgrounds");
       }
   });
});

module.exports = router;