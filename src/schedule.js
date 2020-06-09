/*
 * @Author: Do not edit
 * @Date: 2019-12-30 08:31:45
 * @LastEditTime: 2020-06-09 17:46:24
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \qywx-robot\src\schedule.js
 */
const Schedule = require('node-schedule')
const md5 = require('md5');
const {
  bugUrl,
  bugUrlGXB3,
  bugUrl630,
  bugUrlSN,
  bugUrlGSXT,
  robotKeyForTeam2,
  robotKeyForTeam,
  robotKeyForGXB,
  robotKeyForSN,
  robotKeyForShop,
  robotKeyForTest,
  robotKeyForTestAll,
} = require('./config');
const {
  sendImageMsg,
  sendMarkdownMsg,
} = require('./wechat');
const {
  writeBugReport,
  formatMarkdown,
} = require('./formatMsg');
const {
  analyseTesterBug,
  screenshotTesterReport,
  analyseDeveloperBug,
} = require('./zentao');
const {
  dateFormat
} = require('./utils');

console.log('正在运行定时任务中...')

// 产品报账2.0.5-15版本
const schedule1 = new Schedule.RecurrenceRule();
schedule1.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule1.hour = [8, 12, 17];
schedule1.minute = 35;
schedule1.second = 0;
schedule1.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrl);
  const noticeList = [robotKeyForTeam, robotKeyForTeam2];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 产品报账630版
const schedule2 = new Schedule.RecurrenceRule();
schedule2.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule2.hour = [8, 12, 17];
schedule2.minute = 40;
schedule2.second = 0;
schedule2.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrl630);
  const noticeList = [robotKeyForTeam, robotKeyForTeam2, robotKeyForShop];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 产品-工时系统2020
const schedule3 = new Schedule.RecurrenceRule();
schedule3.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule3.hour = [8, 12, 17];
schedule3.minute = 50;
schedule3.second = 0;
schedule3.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlGSXT);
  const noticeList = [robotKeyForTeam, robotKeyForTeam2];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 工信部
const schedule4 = new Schedule.RecurrenceRule();
schedule4.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule4.hour = [9, 13, 18];
schedule4.minute = 0;
schedule4.second = 0;
schedule4.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlGXB3);
  const noticeList = [robotKeyForTeam, robotKeyForGXB];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 申能
const schedule5 = new Schedule.RecurrenceRule();
schedule5.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule5.hour = [9, 13, 18];
schedule5.minute = 10;
schedule5.second = 0;
schedule5.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlSN);
  const noticeList = [robotKeyForSN];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

const schedule6 = new Schedule.RecurrenceRule();
schedule6.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule6.hour = [23];
schedule6.minute = 0;
schedule6.second = 0;
schedule6.executeMethod = async () => {
  const today = new Date();
  const result = await analyseTesterBug(today, bugUrl);
  await writeBugReport(today, result);
  const imageBuffer = await screenshotTesterReport(today);
  const noticeList = [robotKeyForTeam, robotKeyForTeam2];
  noticeList.forEach(robotKey => {
    sendMarkdownMsg(robotKey, `[点我查看网页版](http://192.168.0.234:3000/output/report/${dateFormat(today)}.html) <font color="comment">(只支持研发中心内网查看哦)</font>`);
    sendImageMsg(robotKey, imageBuffer.toString('base64'), md5(imageBuffer));
  });
};


const scheduleList = [schedule1, schedule2, schedule3, schedule4, schedule5, schedule6];


scheduleList.forEach((item, index) => {
  Schedule.scheduleJob(item, async function () {
    const t = new Date();
    const fmtTime = `${t.getFullYear()}-${`0${t.getMonth() + 1}`.slice(-2)}-${`0${t.getDate()}`.slice(-2)} ${`0${t.getHours()}`.slice(-2)}:${`0${t.getMinutes()}`.slice(-2)}:${`0${t.getSeconds()}`.slice(-2)}`;
    await item.executeMethod();
    console.log(`${fmtTime} 定时任务 ${index + 1} 运行完毕 `);
  });
});