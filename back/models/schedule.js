const mongoose = require("mongoose");
const ScheduleItemSchema = new mongoose.Schema(
  {
    start: {
      type: Number,
    },
    id: {
      type: String,
      require: true,
    },
    end: {
      type: Number,
    },
    date: {
      type: Number,
    },
    title: {
      type: String,
      require: true,
    },
    url: {
      type: String,
    },
  },
  { timestamps: true }
);

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
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
    (ele) => ele.start >= start || ele.end <= end
  );
  return periodList;
};

module.exports =
  mongoose.models.Schedule || mongoose.model("Schedule", ScheduleSchema);
