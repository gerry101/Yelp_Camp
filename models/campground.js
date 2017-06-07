var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   price: Number,
   author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
       },
       username: String
   },
   comments: [
       {
           type: mongoose.Schema.Types.ObjectId,
           ref:  "Comment"
       }
   ],
   date: {
       type: Date,
       default: Date.now
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);