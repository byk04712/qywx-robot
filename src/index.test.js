/*
 * @Author: Do not edit
 * @Date: 2020-05-22 10:45:45
 * @LastEditTime: 2020-06-08 18:13:50
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \EggVueSSR\app\robot\index.test.js
 */
const md5 = require('md5');
const {
  robotKeyForTeam,
  robotKeyForTeam2,
  robotKeyForTest,
  robotKeyForTestAll,
  bugUrl
} = require('../robot/config');
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
const zentao = require('./zentao');
const cronParser = require('cron-parser');

const date = new Date();


try {
  var interval = cronParser.parseExpression('0 30 8,12,17 * * *');

  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
  console.log('Date: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)

  console.log('Date: ', interval.prev().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
  console.log('Date: ', interval.prev().toString()); // Sat Dec 29 2012 00:40:00 GMT+0200 (EET)
} catch (err) {
  console.log('Error: ' + err.message);
}


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