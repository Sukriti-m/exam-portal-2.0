const Question = require("../models/question");
const Answer = require("../models/answer");
const User = require("../models/user");
const express = require("express");
const verify = require("../middleware/auth");
const atob = require("atob");
const router = new express.Router();

// router.patch("/quesansdata", verify, async (req, res) => {
//   try {
//     const isVerified = true;
//     const token = req.body.cookie_token;
//     const dec = token.split(".")[1];
//     const decode = JSON.parse(atob(dec)); //contains Userid
//     console.log(dec);

//     // const findAns = await Answer.find({ userId: decode });
//     const finadcalAns = await Answer.find({ userId: decode });
//     // set for unique quesIDs

//     // let quesIDs = new Set();
//     // for (let i = 0; i < findAns.length; i++) {
//     //   quesIDs.add(findAns[i].Qid.valueOf());
//     // }

//     for (let i = 0; i < finadcalAns.length; i++) {
//       // let ques = await Question.findById(e);
//       // let findcorrectAns = await Answer.find({ Qid: e, userId: decode._id });
//       // let finadcalAns = findcorrectAns[findcorrectAns.length - 1];
//       if (
//         finadcalAns[i].category === "HTML" ||
//         finadcalAns[i].category === "html"
//       ) {
//         if (
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
//         ) {
//           NumHtml += 1;
//         }
//       } else if (
//         finadcalAns[i].category === "CSS" ||
//         finadcalAns[i].category === "css"
//       ) {
//         if (
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
//         ) {
//           NumCss += 1;
//         }
//       } else if (
//         finadcalAns[i].category === "SQL" ||
//         finadcalAns[i].category === "sql"
//       ) {
//         if (
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
//         ) {
//           NumSql += 1;
//         }
//       } else if (
//         finadcalAns[i].category === "APTITUDE" ||
//         finadcalAns[i].category === "aptitude"
//       ) {
//         if (
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
//         ) {
//           NumAptitude += 1;
//         }
//       } else if (
//         finadcalAns[i].category === "C" ||
//         finadcalAns[i].category === "C++" ||
//         finadcalAns[i].category === "JAVA" ||
//         finadcalAns[i].category === "PYTHON"
//       ) {
//         if (
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 1) ||
//           (finadcalAns[i].isCorrect === true && finadcalAns[i].ansid === 3)
//         ) {
//           NumLang += 1;
//         }
//       }

//       TotalNum = NumHtml + NumCss + NumAptitude + NumSql + NumLang;
//       let today = new Date();
//       let date =
//         today.getDate() +
//         "/" +
//         (today.getMonth() + 1) +
//         "/" +
//         today.getFullYear();
//       let time =
//         today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//       await User.findByIdAndUpdate(decode._id, {
//         $set: {
//           logoutAt: time + " " + date,
//           userNumCount: {
//             NumHtml: NumHtml,
//             NumCss: NumCss,
//             NumSql: NumSql,
//             NumAptitude: NumAptitude,
//             NumLang: NumLang,
//             TotalNum: TotalNum,
//           },
//         },
//       });
//     }
//     res.status(200).send({ msg: "Total sum added", isVerified });
//     (NumHtml = 0),
//       (NumCss = 0),
//       (NumSql = 0),
//       (NumAptitude = 0),
//       (NumLang = 0),
//       (TotalNum = 0);
//   } catch (err) {
//     res.status(400).send(`err ${err}`);
//   }
// });

router.get("/leaderboard", async (req, res) => {
  try {
    const leader = await User.find()
      .populate("results")
      .sort({ "userNumCount": -1 });
    res.status(200).send(leader);
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

router.post("/score", verify, async (req, res) => {
  try {
    const token = req.body.cookie_token;
    const dec = token.split(".")[1];
    const decode = JSON.parse(atob(dec)); //contains Userid
    const finduserAns = await Answer.find({ userId: decode });
    let Num = 0;
    for (let i = 0; i < finduserAns.length; i++) {
      // console.log(finuserAns[i]);
      const AnsByQid = await Question.findById(finduserAns[i].Qid);
      // console.log(AnsByQid.options);
      for (let j = 0; j < 4; j++) {
        if (
          finduserAns[i].userAnswer == AnsByQid.options[j].Oid &&
          AnsByQid.options[j].isCorrect === true
        ) {
          Num++;
        }
      }
    }

    User.findOneAndUpdate({ _id: decode }, {
      $set: {
        userNumCount: Num,
        hasAppeared: true,
        logoutAt: new Date().toISOString().replace(/T/, " ").replace(/\..+/, "")
      }
    }, (err, docs) => {
      if (err)
        console.log(err);
      else
        console.log(docs);
    });

    console.log(Num);
    res.status(200).send({
      message: "User score saved successfullly",
    });
  } catch (err) {
    res.status(400).send(`err ${err}`);
  }
});

module.exports = router;
