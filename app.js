var express = require("express"), 
	app = express(), 
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"), 
	flash = require("connect-flash"),
	passport = require("passport"), 
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"), 
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);
app.use(flash());
// seedDB();

// PASSPORT CONFIG

app.use(require("express-session")({
	secret: "Peach is so cute oh wow!", 
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("The YelpCamp Server has started!");
});
