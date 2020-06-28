/*
 * @Author: Do not edit
 * @Date: 2020-05-22 10:45:45
 * @LastEditTime: 2020-06-28 21:48:47
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: /qywx-robot/src/index.test.js
 */
const md5 = require('md5');
const fs = require('fs');
const {
  robotKeyForTeam,
  robotKeyForTeam2,
  robotKeyForTest,
  robotKeyForTestAll,
  bugUrl,
  bugUrlLJXD
} = require('./config');
const {
  sendTextMsg,
  sendMarkdownMsg,
  sendImageMsg,
  sendNewsMsg
} = require('./wechat');
const {
  formatMarkdown,
  writeBugReport
} = require('./formatMsg');
const { analyseDeveloperBug } = require('./zentao');
const cronParser = require('cron-parser');
const Schedule = require('node-schedule')

const date = new Date();

const schedule6 = new Schedule.RecurrenceRule();
schedule6.dayOfWeek = [0, new Schedule.Range(1, 5)];
// schedule6.hour = [12, 18, 21];
schedule6.minute = 49;
schedule6.second = 0;
schedule6.executeMethod = async () => {
  const result = await analyseDeveloperBug(new Date(), bugUrlLJXD);
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

schedule6.executeMethod();


// sendMarkdownMsg(robotKeyForTest, `[点我查看网页版](http://192.168.0.234:7001/report/20200522) <font color="comment">(只支持公司内网查看哦)</font>`);


// zentao.analyseDeveloperBug(date, bugUrl)
//   .then(res => {
//     console.log('\n\n禅道上获取到的数据', res);
//     const formatMsg = formatMarkdown(res);
//     console.log('\n\n加工后的数据', formatMsg);
//     sendMarkdownMsg(robotKeyForTeam, formatMsg);
//   });


// zentao.analyseTesterBug(date)
//   .then(res => {
//     console.log('\n\n禅道上获取到的数据', res);
//     writeBugReport(date, res)
//       .then(resp => {
//         console.log('已生成网页', resp.filepath);
//         zentao.screenshotTesterReport(resp.date)
//           .then(image => {
//             console.log('\n已生成图片\n');
//             sendImageMsg(robotKeyForTest, image.toString('base64'), md5(image));
//           })
//       })
//   });