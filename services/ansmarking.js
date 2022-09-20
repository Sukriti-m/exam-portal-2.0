const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");
const express = require("express");
const verify = require("../middleware/auth");
const atob = require("atob");

const router = new express.Router();
let NumHtml = 0,
  NumCss = 0,
  NumSql = 0,
  NumAptitude = 0,
  NumLang = 0,
  TotalNum = 0;

router.patch("/quesansdata", verify, async (req, res) => {
  try {
    const isVerified = true;
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    console.log(dec);

    // const findAns = await Answer.find({ userId: decode });
    const finadcalAns = await Answer.find({ userId: decode });
    // set for unique quesIDs

    // let quesIDs = new Set();
    // for (let i = 0; i < findAns.length; i++) {
    //   quesIDs.add(findAns[i].Qid.valueOf());
    // }

    for (let i = 0; i < finadcalAns.length; i++) {
      // let ques = await Question.findById(e);
      // let findcorrectAns = await Answer.find({ Qid: e, userId: decode._id });
      // let finadcalAns = findcorrectAns[findcorrectAns.length - 1];
      if (
        finadcalAns[i].category === "HTML" ||
        finadcalAns[i].category === "html"
      ) {
        if (
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
        ) {
          NumHtml += 1;
        }
      } else if (
        finadcalAns[i].category === "CSS" ||
        finadcalAns[i].category === "css"
      ) {
        if (
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
        ) {
          NumCss += 1;
        }
      } else if (
        finadcalAns[i].category === "SQL" ||
        finadcalAns[i].category === "sql"
      ) {
        if (
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
        ) {
          NumSql += 1;
        }
      } else if (
        finadcalAns[i].category === "APTITUDE" ||
        finadcalAns[i].category === "aptitude"
      ) {
        if (
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
        ) {
          NumAptitude += 1;
        }
      } else if (
        finadcalAns[i].category === "C" ||
        finadcalAns[i].category === "C++" ||
        finadcalAns[i].category === "JAVA" ||
        finadcalAns[i].category === "PYTHON"
      ) {
        if (
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
          (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
        ) {
          NumLang += 1;
        }
      }

      TotalNum = NumHtml + NumCss + NumAptitude + NumSql + NumLang;
      let today = new Date();
      let date =
        today.getDate() +
        "/" +
        (today.getMonth() + 1) +
        "/" +
        today.getFullYear();
      let time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      await User.findByIdAndUpdate(decode._id, {
        $set: {
          logoutAt: time + " " + date,
          userNumCount: {
            NumHtml: NumHtml,
            NumCss: NumCss,
            NumSql: NumSql,
            NumAptitude: NumAptitude,
            NumLang: NumLang,
            TotalNum: TotalNum,
          },
        },
      });
    }
    res.status(200).send({ msg: "Total sum added", isVerified });
    (NumHtml = 0),
      (NumCss = 0),
      (NumSql = 0),
      (NumAptitude = 0),
      (NumLang = 0),
      (TotalNum = 0);
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leader = await User.find()
      .populate("results")
      .sort({ "userNumCount.TotalNum": -1 });
    res.status(200).send(leader);
  } catch (error) {
    res.status(500).send(error);
  }
});
router.put("/fetchanswer", async (req, res) => {
  try {
    const userId = req.body.userId;
    const ansdetails = await User.find({ _id: userId })
      .populate("results")
      .sort({ "userNumCount.TotalNum": -1 });
    const data = {
      name: ansdetails[0].name,
      studentNum: ansdetails[0].studentNum,
      Branch: ansdetails[0].branch,
      score: ansdetails[0].userNumCount.TotalNum,
      stTime: ansdetails[0].loginAt,
      enTime: ansdetails[0].logoutAt,
      AnswerRes: ansdetails[0].results,
    };
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
});

// get candidate details

router.get("/candidate", async (req, res) => {
  try {
    const details = await User.find(
      {},
      {
        name: 1,
        email: 1,
        studentNum: 1,
        rollNum: 1,
        mobileNum: 1,
        branch: 1,
        year: 1,
        gender: 1,
        isHosteler: 1,
        lang: 1,
        loginAt: 1,
        "userNumCount.TotalNum": 1,
      }
    );
    res.status(200).send(details);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
