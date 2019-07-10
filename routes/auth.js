const express = require("express");
const models = require("../models/index");
const bcrypt = require("bcrypt-nodejs");
const router = express.Router();

router.post("/register", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  const passwordComfirm = req.body.passwordComfirm;

  if (!login || !password || !passwordComfirm) {
    const fields = [];
    if (!login) fields.push("login");
    if (!password) fields.push("password");
    if (!passwordComfirm) fields.push("passwordComfirm");

    res.json({
      ok: false,
      error: "Всі поля повинні бути заповнені!",
      fields
    });
  } else if (!/^[a-zA-Z0-9]*$/.test(login)) {
    res.json({
      ok: false,
      error: `login ${login} містить заборонені символи!`,
      fields: ["login"]
    });
  } else if (login.length < 3 || login.length > 14) {
    res.json({
      ok: false,
      error: "Довжина логіна від 3 до 14 символів!",
      fields: ["login"]
    });
  } else if (password.length < 5) {
    res.json({
      ok: false,
      error: "Мінімальна довжина пароля 5 символів!",
      fields: ["password"]
    });
  } else if (passwordComfirm != password) {
    res.json({
      ok: false,
      error: "Паролі не співпадають!",
      fields: ["password", "passwordComfirm"]
    });
  } else {
    const user = await models.user.findOne({ login });

    if (!user) {
      bcrypt.hash(password, null, null, async function(err, hesh) {
        const newuser = await models.user.create({
          login,
          password: hesh
        });
        if (newuser) {
          console.log(newuser);
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.json({
            ok: true
          });
        } else {
          console.log(newuser.errors);
          res.json({
            ok: false,
            error: "Error"
          });
        }
      });
    } else {
      res.json({
        ok: false,
        error: `Користувач з логіном ${login} існує!`,
        fields: ["login"]
      });
    }
  }
});

router.post("/login", async (req, res) => {
  const login = req.body.login;
  const password = req.body.password;

  const user = await models.user.findOne({ login });

  if (!login && !password) {
    res.json({
      ok: false,
      error: "Всі поля повинні бути заповнені!",
      fields: ["login", "password"]
    });
  } else {
    if (user) {
      bcrypt.compare(password, user.password, function(err, result) {
        if (!result) {
          res.json({
            ok: false,
            error: "Некорректний пароль!",
            fields: ["passwords"]
          });
        } else {
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.json({
            ok: true
          });
        }
      });
    } else {
      res.json({
        ok: false,
        error: `Невірні дані!`,
        fields: ["login"]
      });
    }
  }
});

router.get("/logout", async (req, res) => {
  if (req.session) {
    await req.session.destroy();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

module.exports = router;
