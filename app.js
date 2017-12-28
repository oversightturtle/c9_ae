const express     = require("express");
const app         = express();
const mongoose    = require("mongoose");
const passport    = require("passport");
const bodyParser  = require ('body-parser');
const passport_local  = require("passport-local");
const passport_local_mongoose     = require("passport-local-mongoose");
const method_override     =require("method-override");
const user        = require("./models/user");
const conv        = require("./models/conv");
const msg         = require("./models/msg");

mongoose.connect("mongodb://localhost/new");

app.use(require("express-session")({
    secret:"pick a few random sentences",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));
app.use(method_override("_method"));

passport.use(new passport_local(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use(express.static(__dirname + '/public')); // redirect CSS bootstrap

const peopleRoutes = require("./routes/user");
const indexRoutes = require("./routes/index");

app.use(peopleRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log(" >>> server started <<< ");
});