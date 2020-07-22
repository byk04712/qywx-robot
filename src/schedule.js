/*
 * @Author: Do not edit
 * @Date: 2019-12-30 08:31:45
 * @LastEditTime: 2020-07-22 08:51:22
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \qywx-robot\src\schedule.js
 */
const Schedule = require('node-schedule')
const md5 = require('md5');
const {
  bugUrl,
  bugUrlGXB1,
  bugUrlGXB3,
  bugUrl630,
  bugUrlSN,
  bugUrlGSXT,
  bugUrlLJXD,
  bugUrlMALL,
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

console.log('正在运行定时任务中...')

// 产品报账2.0.5-15版本
const schedule1 = new Schedule.RecurrenceRule();
schedule1.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule1.hour = [8, 12, 17];
schedule1.minute = 30;
schedule1.second = 0;
schedule1.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrl);
  const noticeList = [robotKeyForTeam];
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
  const noticeList = [robotKeyForShop];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 产品-采购商城
const schedule3 = new Schedule.RecurrenceRule();
schedule3.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule3.hour = [8, 12, 17];
schedule3.minute = 50;
schedule3.second = 0;
schedule3.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlMALL);
  const noticeList = [robotKeyForTeam];
  const markdown = formatMarkdown(result);
  if (markdown) {
    noticeList.forEach(robotKey => {
      sendMarkdownMsg(robotKey, markdown);
    });
  } else {
    console.log(`${result.title}没有bug了`);
  }
};

// 工信部630
const schedule4_1 = new Schedule.RecurrenceRule();
schedule4_1.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule4_1.hour = [8, 12, 17];
schedule4_1.minute = 35;
schedule4_1.second = 0;
schedule4_1.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlGXB1);
  const noticeList = [robotKeyForGXB];
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
  const noticeList = [robotKeyForGXB];
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

// 砺剑行动开发人员bug
const schedule6 = new Schedule.RecurrenceRule();
schedule6.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule6.hour = [12, 18, 21];
schedule6.minute = 0;
schedule6.second = 0;
schedule6.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlLJXD);
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

// 产品-报账2.0-5.15版本（2020）测试提交bug情况
// const schedule101 = new Schedule.RecurrenceRule();
// schedule101.dayOfWeek = [0, new Schedule.Range(1, 5)];
// schedule101.hour = [21];
// schedule101.minute = 0;
// schedule101.second = 0;
// schedule101.executeMethod = async () => {
//   const projectId = '116';
//   const today = new Date();
//   const result = await analyseTesterBug(today, bugUrl);
//   await writeBugReport(projectId, today, result);
//   const imageBuffer = await screenshotTesterReport(projectId, today);
//   const noticeList = [robotKeyForTeam];
//   noticeList.forEach(robotKey => {
//     sendMarkdownMsg(robotKey, `[点我查看历史记录](http://192.168.0.234:3000/output/report/${projectId}) <font color="comment">(只支持研发中心内网查看哦)</font>`);
//     sendImageMsg(robotKey, imageBuffer.toString('base64'), md5(imageBuffer));
//   });
// };


// 砺剑行动 测试提交bug情况
const schedule102 = new Schedule.RecurrenceRule();
schedule102.dayOfWeek = [0, new Schedule.Range(1, 5)];
schedule102.hour = 21;
schedule102.minute = 3;
schedule102.second = 0;
schedule102.executeMethod = async () => {
  const projectId = '120';
  const today = new Date();
  const result = await analyseTesterBug(today, bugUrlLJXD);
  await writeBugReport(projectId, today, result);
  const imageBuffer = await screenshotTesterReport(projectId, today);
  const noticeList = [robotKeyForTeam2];
  noticeList.forEach(robotKey => {
    sendMarkdownMsg(robotKey, `[点我查看历史记录](http://192.168.0.234:3000/output/report/${projectId}) <font color="comment">(只支持研发中心内网查看哦)</font>`);
    sendImageMsg(robotKey, imageBuffer.toString('base64'), md5(imageBuffer));
  });
};


const scheduleList = [schedule1, schedule2, schedule3, schedule4, schedule4_1, schedule5, schedule6, /*schedule101,*/ schedule102];


scheduleList.forEach((item, index) => {
  Schedule.scheduleJob(item, async function () {
    const t = new Date();
    const fmtTime = `${t.getFullYear()}-${`0${t.getMonth() + 1}`.slice(-2)}-${`0${t.getDate()}`.slice(-2)} ${`0${t.getHours()}`.slice(-2)}:${`0${t.getMinutes()}`.slice(-2)}:${`0${t.getSeconds()}`.slice(-2)}`;
    await item.executeMethod();
    console.log(`${fmtTime} 定时任务 ${index + 1} 运行完毕 `);
  });
});