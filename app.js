var Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    methodOverride   = require("method-override"),
    LocalStrategy    = require("passport-local"),
    flash            = require("connect-flash"),
    User             = require("./models/user"),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    passport         = require("passport"),
    express          = require("express"),
    app              = express();

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes    = require("./routes/comments"),
    indexRoutes      = require("./routes/index");
  
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://yelpyelpcamp:chatinter@ds111882.mlab.com:11882/yelpcamp");

app.locals.moment = require("moment");
app.use(require("express-session")({
    secret: "Yelp Camp Group Camp Yelp Secret",
    resave: false,
    saveUninitialized: false
}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
app.set("view engine", "ejs");


app.listen(3000, function() {
   console.log("Server started..."); 
});