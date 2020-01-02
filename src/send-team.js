
const md5 = require('md5')
const { sendMsg } = require('./robot')
const { unresolvedBugReport } = require('./unresolved-bug-report')

async function main () {
  const imageBuffer = await unresolvedBugReport()

  const msg = {
    msgtype: 'image',
    image: {
      base64: imageBuffer.toString('base64'), // 图片内容的base64编码
      md5: md5(imageBuffer) // 图片内容（base64编码前）的md5值
    }
  }
	const res = await sendMsg(msg)
	console.log('发送结果', res.data)
}

// main()

module.exports = {
  main
}
