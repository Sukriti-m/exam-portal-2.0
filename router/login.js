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

    const userCheck = await User.findOne({ studentNum: studentNum });
    if (!userCheck) {
      res.status(400).send({ msg: "User not registred" });
    }
    if (userCheck) {
      const matchUser_password = await bcrypt.compare(
        password,
        userCheck.password
      );
      // const matchAdmin_password = await bcrypt.compare(
      //   password,
      //   userCheck.adminPassword
      // );
      const pay_load = { _id: userCheck._id };
      const cookie_token = jwt.sign(pay_load, process.env.TOKEN_SECRET_KEY);
      // const cookie_token = await userCheck.generateAuthToken();
      // console.log(cookie_token);

      //add cookie
      res.cookie("jwt_csi", cookie_token, {
        secure: true,
        expires: new Date(Date.now() + 10800),
        httpOnly: false,
      });
      // if (matchAdmin_password) {
      //   return res.status(200).send({
      //     isAdmin: userCheck.isAdmin,
      //     cookie_token: `${cookie_token}`,
      //   });
      //
      if (matchUser_password) {
        return res.status(200).send({
          message: "User logged in successfully",
          cookie_token: cookie_token,
          isAdmin: userCheck.isAdmin,
          hasAppeared: userCheck.hasAppeared,
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