const express = require("express");
const router = new express.Router();
const Answer = require("../models/answer");
const Question = require("../models/question");
const User = require("../models/user");
const jwtDecode = require("jwt-decode");
const verify = require("../middleware/auth");

const mongoose = require("mongoose");

router.put("/set-answer", verify, async ({ body }, res) => {
  try {
    const { question, userAnswer, ansid, Qid, cookie_token, category } = body;
    const userId = jwtDecode(cookie_token);
    const { _id } = userId;
    const answer = await Answer.findOneAndUpdate(
      {
        $and: [{ userId: _id }, { Qid: Qid }],
      },
      { $set: { ansid: ansid, userAnswer: userAnswer } }
    );
    if (!answer) {
      new Answer({
        question: question,
        category: category,
        userId: userId,
        Qid: new mongoose.Types.ObjectId(Qid),
        userAnswer: userAnswer,
        ansid: ansid,
      }).save();
    }
    res.status(200).send("Answer added/updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

// router.put("/submit/answer", verify, async ({ body }, res) => {
//   try {
//     const userId = jwtDecode(body.cookie_token);
//     const { _id } = userId;
//     res.status(200).send(_id);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.put("/answer", verify, async (req, res) => {
//   try {
//     // const userId = jwtDecode(body.cookie_token);
//     // const { _id } = userId;
//     const isVerified = true;
//     const token = req.body.cookie_token;
//     const dec = token.split(".")[1];
//     const decode = JSON.parse(atob(dec)); //contains Userid
//     console.log(dec);
//     const { question, category, userAnswer, ansid, Qid } = req.body;

//     const existAns = await Answer.find({ Qid: Qid, userId: decode._id });
//     if (existAns.length != 0) {
//       await Answer.findOneAndUpdate(
//         {
//           _id: existAns[0]._id,
//         },
//         {
//           $set: {
//             ansid: ansid,
//             userAnswer: userAnswer,
//           },
//         }
//       );
//       console.log(existAns[0]._id);
//       const quesFound = await Question.findById(Qid);

//       if (quesFound) {
//         for (let i = 0; i < 4; i++) {
//           if (userAnswer == quesFound.options[i].Oid) {
//             const selopt = quesFound.options[i].value;
//             await Answer.findOneAndUpdate(
//               {
//                 _id: existAns[0]._id,
//               },
//               {
//                 $set: {
//                   selectedOpt: selopt,
//                 },
//               }
//             );

//             if (quesFound.options[i].isCorrect === true) {
//               await Answer.findOneAndUpdate(
//                 {
//                   _id: existAns[0]._id,
//                 },
//                 {
//                   $set: {
//                     isCorrect: true,
//                   },
//                 }
//               );
//               console.log("Correct answer");
//             }
//           }
//         }
//       }
//       // change
//       const Foundans = await Answer.findById(existAns[0]._id);
//       const selopt = Foundans.selectedOpt;

//       let msg = "Answer added successfully";
//       if (ansid === 1 && selopt != "") {
//         msg = "Answer saved successfully";
//       } else if (ansid === 3 && selopt != "") {
//         msg = "marked and review successfully added";
//       } else if ((ansid == 1 || ansid == 3) && selopt == "") {
//         msg = "attempted but not answer";
//       }
//       res.status(201).send({ msg, ansid, selopt, isVerified });
//     } else {
//       let answer_create = new Answer({
//         userId: decode,
//         question,
//         category,
//         userAnswer,
//         ansid,
//         Qid,
//       });
//       await answer_create.save();

//       await User.findOneAndUpdate(
//         {
//           _id: answer_create.userId,
//         },
//         {
//           $push: { results: answer_create._id },
//         }
//       );

//       const quesFound = await Question.findById(Qid);

//       if (quesFound) {
//         for (let i = 0; i < 4; i++) {
//           if (userAnswer == quesFound.options[i].Oid) {
//             const selopt = quesFound.options[i].value;
//             await Answer.findOneAndUpdate(
//               {
//                 _id: answer_create._id,
//               },
//               {
//                 $set: {
//                   selectedOpt: selopt,
//                 },
//               }
//             );

//             if (quesFound.options[i].isCorrect === true) {
//               await Answer.findOneAndUpdate(
//                 {
//                   _id: answer_create._id,
//                 },
//                 {
//                   $set: {
//                     isCorrect: true,
//                   },
//                 }
//               );
//               console.log("Correct answer");
//             }
//           }
//         }
//       }
//       // change
//       const Foundans = await Answer.findById(answer_create._id);
//       const selopt = Foundans.selectedOpt;

//       let msg = "Answer added successfully";
//       if (ansid === 1 && selopt != "") {
//         msg = "Answer saved successfully";
//       } else if (ansid === 3 && selopt != "") {
//         msg = "marked and review successfully added";
//       } else if ((ansid == 1 || ansid == 3) && selopt == "") {
//         msg = "attempted but not answer";
//       }
//       res.status(201).send({ msg, ansid, selopt, isVerified });
//     }
//   } catch (error) {
//     res.status(500).send(`err ${error}`);
//   }
// });

router.put("/seeanswer", async (req, res) => {
  try {
    const userId = req.body.userId;

    const AnswerData = await Answer.find({ userId: userId }).populate(
      "userId",
      "name studentNum branch score loginAt"
    );
    res.status(201).send(AnswerData);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

module.exports = router;
