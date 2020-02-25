/*
 * @Author: Do not edit
 * @Date: 2019-12-30 08:31:45
 * @LastEditTime: 2020-02-25 17:53:13
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \qywx-robot\src\schedule.js
 */
const schedule = require('node-schedule')
const { main } = require('./send-dept')

console.log('正在运行定时任务中...')


const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = [8, 17];
rule.minute = 30;
schedule.scheduleJob(rule, function() {
  const t = new Date()
  console.log('早上8点半和下午6点半运行', t.toLocaleDateString() + ' ' + t.toLocaleTimeString());
  main();
});
