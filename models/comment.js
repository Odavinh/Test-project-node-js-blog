const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    body: {
      type: String,
      require: true
    },
    post:{
        type: Schema.Types.ObjectId,
        ref:"post"
    },
    parent:{
        type: Schema.Types.ObjectId,
        ref:"comment"
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user"
    },
    children:[
        {
            type: Schema.Types.ObjectId,
            ref:"comment"
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
  },
  {
    timestemps: false
  }
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("comment", schema);
