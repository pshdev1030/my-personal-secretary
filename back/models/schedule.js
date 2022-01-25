const mongoose = require("mongoose");

// 개별 일정 모델
const ScheduleItemSchema = new mongoose.Schema(
  {
    //시작일
    start: {
      type: Number,
    },
    //일정 아이디
    id: {
      type: String,
      require: true,
    },
    //끝
    end: {
      type: Number,
    },
    //날짜(시작일과 끝이 같을 경우)
    date: {
      type: Number,
    },
    //제목
    title: {
      type: String,
      require: true,
    },
    // url(클릭시 이동)
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

//유저별 일정을 저장하는 모델

const ScheduleSchema = new mongoose.Schema({
  userId: {
    //유저 아이디
    type: String,
    require: true,
  },
  // 유저 일정 목록, _id를 false로 하고 커스텀 id속성으로 탐색함
  scheduleList: [ScheduleItemSchema, { _id: false }],
});

ScheduleSchema.methods.addSchedule = function (data) {
  this.scheduleList.push(data);
  return this.save();
};

ScheduleSchema.methods.removeSchedule = function (data) {
  const idx = this.scheduleList.findIndex((ele) => ele.id === data);
  this.scheduleList.splice(idx, 1);
  return this.save();
};

ScheduleSchema.methods.replaceSchedule = function (data) {
  const idx = this.scheduleList.findIndex((ele) => ele.id === data.id);
  this.scheduleList[idx] = data;
  return this.save();
};

ScheduleSchema.methods.searchSchedule = function (start, end) {
  const periodList = this.scheduleList.filter(
    (ele) =>
      (ele.start >= start && ele.start <= end) ||
      (ele.end >= start && ele.end <= end)
  );
  return periodList;
};

module.exports =
  mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);
