const router = require("express").Router();
const Schedule = require("../models/schedule");
const User = require("../models/user");
const mongoose = require("mongoose");
const authenticateToken = require("../modules/auth");

// 일정 받아오기

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

// 일정 받아오기(기간별)

router.get("/period", authenticateToken, async (req, res) => {
  try {
    const start = Number(req.query.start);
    const end = Number(req.query.end);
    const { userId } = req.body;
    let userItemList = await Schedule.findOne().where("userId").equals(userId);

    const periodList = userItemList.searchSchedule(start, end);

    // 전송하기 전에 정렬을 함
    periodList.sort(function (a, b) {
      if (a.start > b.start) return 1;
      if (a.start === b.start) return 0;
      if (a.start < b.start) return -1;
    });

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

// 일정 추가하기

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

// 일정 수정하기

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

// 일정 삭제하기

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
