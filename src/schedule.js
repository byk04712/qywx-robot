const schedule = require('node-schedule')
const { main } = require('./send-dept')

schedule.scheduleJob('35 8,13,22 * * *', () => {
  const t = new Date()
  console.log('每天早上8点35分，下午13点35分，晚上22点35分运行', t.toLocaleDateString() + ' ' + t.toLocaleTimeString())
  main()
})
