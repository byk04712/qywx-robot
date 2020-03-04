/*
 * @Author: Do not edit
 * @Date: 2019-12-30 08:31:45
 * @LastEditTime: 2020-03-04 09:09:56
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \qywx-robot\src\schedule.js
 */
const schedule = require('node-schedule')
const { main } = require('./send-dept')

console.log('正在运行定时任务中...')


const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = [9, 18];
rule.minute = 30;
rule.second = 0;
schedule.scheduleJob(rule, function() {
  const t = new Date()
  console.log('定时运行运行', t.toLocaleDateString() + ' ' + t.toLocaleTimeString());
  main();
});
