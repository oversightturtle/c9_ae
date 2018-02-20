const express = require("express");
const router = express.Router();
const user = require("../models/user");
const conv = require("../models/conv");
const msg = require("../models/msg");
const passport = require("passport");
const multer = require("multer");
const path = require("path");

function onlyLOGIN(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

router.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

const storage = multer.diskStorage({
    destination: './public/img/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).single("image");

router.get("/upload_img", onlyLOGIN, (req, res) => {res.render("pages/upload_img");});

router.post("/upload_img", onlyLOGIN, (req,res) => { upload(req, res, (err) => {
        res.redirect("/p/"+ req.user.username);
        user.findByIdAndUpdate(req.user.id, {profile: "/img/" + req.file.filename}, {new: true}, (err) => {})
    })
})

//////////////////////////////////
router.get("/c/:id", onlyLOGIN, (req, res) => {  // << SHOW CONV
    msg.find({conv_id: req.params.id}, (err, msg) => {
        res.render("pages/c_show", {msg:msg})
    });
});

router.get("/m/:id", onlyLOGIN, (req, res) => { res.render("pages/m_create",{newid: req.params.id});}); // << CSHOW MSG OF A CONV

router.post("/m/:id",onlyLOGIN, (req,res) => { // << CREATE MSG
    conv.findOne({parts:[req.params.id, req.user.id]},(err,iconv) => {// conv meam diff things
        if (!iconv){ conv.create({ parts:[req.params.id, req.user.id]}); console.log("TRIGGER")};
    }); 
    conv.findOne({parts:[req.params.id, req.user.id]},(err,iconv) => {// conv meam diff things
        console.log(iconv);
        console.log(req.user.id);
        msg.create({ sender: req.user.id, content: req.body.content, conv_id: iconv.id})
    })
    res.redirect("/");
})

router.put("/p/:id", (req, res) => {
    user.findByIdAndUpdate(req.params.id, req.body, (err, update) => {
        res.redirect("/p/" + req.params.id);
    })
});

router.get("/p/:username", (req, res) => {
    user.findOne({username: req.params.username}, (err, user) => {
        res.render("pages/p_show",{user: user});
    })
});

router.get("/p", (req, res) => {
    user.find({}, (err, user) => { res.render("pages/p_index", {user:user});});
});

router.get("/p/:id/edit", (req,res) => {
    user.findById(req.params.id, (err, user) => {
        res.render("pages/p_edit", {user:user});
    });
});

router.delete("/p/:id", (req,res) => {
    user.findByIdAndRemove(req.params.id, (err, user) => { });
    res.redirect("/p");
});

router.get("/login", function(req, res) {
    res.render("pages/login");
});

router.post("/login",passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }), (req, res) => {}
);

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// router.get("/secret", onlyLOGIN , function(req,res){
//     conv.find({parts:req.user.id}, function(err, conv){
//         conv.parts.forEach(function(person_id){
//             if (person_id != req.user.id){ // only the personid of the person you are talking to selected
//                 user.findOne({id: person_id},function(err, uname){
//                     res.render("pages/secret", {id_conv:conv, uname: uname});  
//                 })
//             }
//         })
//     })
// });

router.get("/secret", onlyLOGIN , (req,res) => {
    conv.find({parts:req.user.id}).populate("parts").exec((err, conv)=>{
        res.render("pages/secret", {id_conv:conv});
    })
});

// router.get("/secret", onlyLOGIN , (req,res) => {
//     conv.find({parts:req.user.id}, (err, conv) => {
//         res.render("pages/secret", {id_conv:conv});
//     })
// });

router.get("/signup", (req, res) => {
    res.render("pages/signup");
});

router.post("/signup", (req,res) => {
    user.register(new user({username: req.body.username, location: req.body.location,
        name: req.body.name}), req.body.password, (err,user) => {
        if (err) { console.log(err);
        } else {
            passport.authenticate("local")(req, res, () => {res.redirect("/secret");})
        }
    });
});

module.exports = router;

// router.post("/m/:id",onlyLOGIN, (req,res) => {
//     conv.findOne({parts:[req.params.id, req.user.id]},"_id",(err,iconv) => {// conv meam diff things
//         if (!iconv){ conv.create({ parts:[req.params.id, req.user.id]}); console.log("TRIGGER")};
//     }); 
//     conv.findOne({parts:[req.params.id, req.user.id]},"_id",(err,iconv) => {// conv meam diff things
//         console.log(iconv);
//         console.log(req.user.id);
//         msg.create({ sender: req.user.id, content: req.body.content, conv_id: iconv.id})
//     })
//     res.redirect("/");
// })