var mongoose = require("mongoose");

var msgSchema = new mongoose.Schema({
    sender: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    conv_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "conv"
    }],
    content: String,

});

module.exports = mongoose.model("msg", msgSchema);