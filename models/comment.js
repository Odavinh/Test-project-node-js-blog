const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const autoPopulate = require("mongoose-autopopulate");
const modelPost = require("./post");

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
        ref:"user",
        autopopulate: true
    },
    children:[
        {
            type: Schema.Types.ObjectId,
            ref:"comment",
            autopopulate: true
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

schema.pre('save', async function(next){
  if(this.isNew){
    await modelPost.incCommentCount(this.post);
  }
  next();
});

schema.plugin(autoPopulate);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("comment", schema);
