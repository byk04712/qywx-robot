/*
 * @Author: Do not edit
 * @Date: 2019-12-30 08:31:45
 * @LastEditTime: 2020-04-09 09:47:36
 * @LastEditors: 秦真
 * @Description: 发送消息统计到部门群
 * @FilePath: \qywx-robot\src\send-dept.js
 */
const { sendMsg } = require('./robot')
const { unresolvedBug } = require('./unresolved-bug')

async function main () {
  const bugs = await unresolvedBug()
  console.log('当前bug情况', bugs)
  const total = bugs.reduce((acc, item) => (acc += item.count), 0)
  const content = bugs.map(({ name, count }) => {
    return `\n>${name.padEnd(14 - name.length * 2)}${' '.repeat((3 - String(count).length) * 2)}**${count}**个`;
  }).join('')
  const msg = {
    msgtype: 'markdown',
    markdown: {
      content: `当前 [产品-报账系统2.0](http://113.108.117.211:19979/zentao/bug-browse-44-0-unresolved-0.html) 还有未解决的BUG共计 <font color="warning">${total}</font> 个 ，请以下同学及时[处理](http://113.108.117.211:19979/zentao/my-bug.html)。
      ${content}
      `
    }
  }
	const res = await sendMsg(msg)
	console.log('发送结果', res.data)
}

module.exports = {
  main
}
