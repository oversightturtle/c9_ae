var express = require("express");
var router = express.Router();

router.get("/", function(req,res){
    res.render("pages/index");
});

router.get("*", function(req, res) {
    res.render("pages/404");
});

module.exports = router;