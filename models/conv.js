var mongoose = require("mongoose");

var convSchema = new mongoose.Schema({
    parts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
});

module.exports = mongoose.model("conv", convSchema);