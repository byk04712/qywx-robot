const schedule = require('node-schedule')

const j1 = schedule.scheduleJob('28 8/13/22 * * *', () => {
  const t = new Date()
  console.log('2 每天早上8点28分，下午13点28分，晚上22点28分运行', t.toLocaleDateString() + '' + t.toLocaleTimeString())
})
const j2 = schedule.scheduleJob('28 0/1/2/3/4/5/6/7/8/9/10/11/12/13/14/15/16/17/18/19/20/21/22/23 * * *', () => {
  const t = new Date()
  console.log('3 每小时的28分运行', t.toLocaleDateString() + '' + t.toLocaleTimeString())
})
const j3 = schedule.scheduleJob('28 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23 * * *', () => {
  const t = new Date()
  console.log('4 每小时的28分运行', t.toLocaleDateString() + '' + t.toLocaleTimeString())
})