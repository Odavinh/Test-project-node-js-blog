const express = require("express");
const router = express.Router();
const path = require("path");
const config = require("../config");
const Sharp = require("sharp");
const mkdirp = require("mkdirp");
const models = require("../models/index");

const diskStorage = require("../utils/diskStorage");

const multer = require("multer");

const rs = () =>
  Math.random()
    .toString(36)
    .slice(-3);

const storage = diskStorage({
  destination: (req, file, cb) => {
    const dir = "/" + rs() + "/" + rs();
    req.dir = dir;
    mkdirp(config.DESTINATION + dir, err => cb(err, config.DESTINATION + dir));
    //cb(null, config.DESTINATION + dir);
  },
  filename: async (req, file, cb) => {
    const userId = req.session.userId;
    const fileName = Date.now().toString(36) + path.extname(file.originalname);
    const dir = req.dir;
    req.file_path = dir + "/" + fileName;
    try {
      const user = await models.user.findById(userId);
      const upload = await models.upload.create({
        owner: userId,
        path: dir + "/" + fileName
      });

      const uploads = user.uploads;
      uploads.push(upload.id);
      user.uploads = uploads;
      await user.save();

      rs.json({
        ok: true
      });
    } catch (error) {
      rs.json({
        ok: false
      });
    }

    cb(null, fileName);
  },
  sharp: (req, file, cb) => {
    const roundedCorners = Buffer.from(
      '<svg><rect x="0" y="0" width="1024" height="768" rx="50" ry="50"/></svg>'
    );

    const resizer = Sharp()
      .resize(1024, 768)
      .composite([
        {
          input: roundedCorners,
          blend: "dest-in"
        }
      ])
      .withMetadata()
      .toFormat("jpg")
      .jpeg({
        quality: 40,
        progressive: true
      });
    cb(null, resizer);
  }
});

const upload = multer({
  storage,
  limits: {fileSize: 2 * 1024 * 1024},
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      const err = new Error("Extention");
      err.code = "EXTENTION";
      return cb(err);
    }
    cb(null, true);
  }
}).single("file");

router.post("/image", (req, res) => {
  upload(req, res, err => {
    let error = "";
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        error = "Картинка не більше 2mb!";
      }
      if (err.code === "EXTENTION") {
        error = "Тільки jpeg и png!";
      }
    }
    res.json({
      ok: !error,
      file_path: req.file_path,
      error
    });
  });
});

module.exports = router;
