const router = require("express").Router();
const Schedule = require("../models/schedule");
const User = require("../models/user");
const mongoose = require("mongoose");
const authenticateToken = require("../modules/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    let userItemList = await Schedule.findOne().where("userId").equals(userId);
    if (!userItemList) {
      if (User.findUser(userId)) {
        res.status(401).json("존재하지 않는 사용자입니다.");
      }
      userItemList = await Schedule.create({ userId, scheduleList: [] });
    }
    return res.status(200).json(userItemList.scheduleList);
  } catch (e) {
    console.error(e);
  }
});

router.get("/period", authenticateToken, async (req, res) => {
  try {
    const start = Number(req.query.start);
    const end = Number(req.query.end);
    const { userId } = req.body;
    let userItemList = await Schedule.findOne().where("userId").equals(userId);

    const periodList = userItemList.searchSchedule(start, end);

    if (!userItemList) {
      if (User.findUser(userId)) {
        res.status(401).json("존재하지 않는 사용자입니다.");
      }
      userItemList = await Schedule.create({ userId, scheduleList: [] });
    }

    return res.status(200).json(periodList);
  } catch (e) {
    console.error(e);
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { newEvent, userId } = req.body;
    newEvent.id = mongoose.Types.ObjectId();
    let userItemList = await Schedule.findOne().where("userId").equals(userId);

    if (!userItemList) {
      if (User.findUser(userId)) {
        res.status(401).json("존재하지 않는 사용자입니다.");
      }
      userItemList = await Schedule.create({ userId, data: [] });
    }

    userItemList.addSchedule(newEvent);

    return res.status(200).json(newEvent);
  } catch (e) {
    console.error(e);
  }
});

router.put("/", authenticateToken, async (req, res) => {
  try {
    const { newEvent, userId } = req.body;
    let userItemList = await Schedule.findOne().where("userId").equals(userId);

    if (!userItemList) {
      res.status(500).json("잘못된 접근입니다.");
    }
    userItemList.replaceSchedule(newEvent);

    return res.status(200).json(newEvent);
  } catch (e) {
    console.error(e);
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const { scheduleId, userId } = req.body;
    let userItemList = await Schedule.findOne().where("userId").equals(userId);

    if (!userItemList) {
      res.status(500).json("잘못된 접근입니다.");
    }

    userItemList.removeSchedule(scheduleId);

    return res.status(200).json(scheduleId);
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
