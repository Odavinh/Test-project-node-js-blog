const mongoose = require("mongoose");
const URLSlugs = require("mongoose-url-slugs");
const tr = require("transliter");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    body: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    commentCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

schema.statics = {
  incCommentCount(postId) {
    return this.findByIdAndUpdate(
      postId,
      {$inc: {commentCount: 1}},
      {new: true, useFindAndModify: false}
    );
  }
};

schema.plugin(
  URLSlugs("title", {
    field: "url",
    update: true,
    generator: text => tr.slugify(text)
  })
);

schema.set("toJSON", {virtuals: true});

module.exports = mongoose.model("post", schema);
