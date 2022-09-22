const express = require("express");
const FeedbackQuestion = require("../models/feedbackQuestion");
const router = new express.Router();
const atob = require("atob");
const verify = require("../middleware/auth");
const User = require("../models/user");

//instruction

router.patch("/instruction", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;

    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec));
    console.log(dec);
    await User.findByIdAndUpdate(decode, {
      $set: {
        loginAt: new Date().toISOString().replace(/T/, " ").replace(/\..+/, ""),
        lang: req.body.lang,
      },
    });

    res.status(200).send({ msg: "Language added successfully", isVerified });
  } catch (err) {
    console.log(err);
    res.status(500).send("err");
  }
});

//feedback
router.post("/addfeedback", async (req, res) => {
  try {
    const { question, queryText } = await req.body;
    let feedbackques_create = new FeedbackQuestion({
      question,
      queryText,
      // options,
    });
    await feedbackques_create.save();
    res.status(201).send({
      msg: " Feedback Question added successfully",
      feedbackques_create,
    });
  } catch (error) {
    res.status(400).json(error);
  }
});

// delete an feedback id

router.delete("/feedback/:id", async (req, res) => {
  try {
    await FeedbackQuestion.findByIdAndDelete(req.params.id);
    res.status(200).json(" Feedback Question deleted");
  } catch (err) {
    return res.status(400).json(err);
  }
});

// Update a feedback question

router.patch("/feedback/:id", async (req, res) => {
  try {
    await FeedbackQuestion.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json(" Feedback Question got updated");
  } catch (err) {
    return res.status(400).json(err);
  }
});

// get all feedback question

router.get("/feed/seefeedbackques", async (req, res) => {
  try {
    const feedbackQuestionsData = await FeedbackQuestion.find();
    res.status(201).json(feedbackQuestionsData);
  } catch (err) {
    res.status(400).send(err);
  }
});

//login time
router.post("/logintime", async (req, res) => {
  try {
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec));
    console.log(dec);

    const time = await User.findById(decode._id, {
      loginAt: 1,
    });
    console.log(time);

    res.status(200).json(time);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//language selected
router.post("/langselected", async (req, res) => {
  try {
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec));
    console.log(dec);

    const language = await User.findById(decode._id, {
      lang: 1,
    });
    console.log(language);

    res.status(200).json(language);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
module.exports = router;
