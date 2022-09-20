require("dotenv").config();
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = new express.Router();

router.get("/admin", async (req, res) => {
  res.send("This is admin page");
});

// login route
router.post("/login", async (req, res) => {
  try {
    const {password, studentNum} = req.body;

    const user_check = await User.findOne({ studentNum: studentNum });
    if (!user_check) {
      res.status(400).send({ msg: "User not registred" });
    }
    if (user_check) {
      const matchUser_password = await bcrypt.compare(
        password,
        user_check.password
      );
      // const matchAdmin_password = await bcrypt.compare(
      //   password,
      //   user_check.adminPassword
      // );
      const pay_load = { _id: user_check._id };
      const cookie_token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
      // const cookie_token = await user_check.generateAuthToken();
      // console.log(cookie_token);

      //add cookie
      res.cookie("jwt_csi", cookie_token, {
        secure: true,
        expires: new Date(Date.now() + 10800),
        httpOnly: false,
      });
      // if (matchAdmin_password) {
      //   return res.status(200).send({
      //     isAdmin: user_check.isAdmin,
      //     cookie_token: `${cookie_token}`,
      //   });
      //
      if (matchUser_password) {
        return res.status(200).send({
          message: "User logged in successfully",
          cookie_token: cookie_token,
          isAdmin: user_check.isAdmin,
          hasAppeared: user_check.hasAppeared,
        });
      } else {
        res.status(400).send({ msg: "Wrong Password" });
      }
    } else {
      res.status(400).send({ msg: "Invalid details" });
    }
  } catch (err) {
    res.status(404).send(`err ${err}`);
    console.log(err);
  }
});

module.exports = router;