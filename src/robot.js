const axios = require('axios')
const fs = require('fs')
const md5 = require('md5')
const { qyweixin } = require('./config.json')

const BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

// 文本类型消息
const textMsg = {
	msgtype: 'text',
	text: {
		content: '各位小伙伴们好，我是你们的助手，小爱同学',
		mentioned_list: ['@all']
	}
}

// const imageBuffer = fs.readFileSync('../output/report.png')
// console.log(imageBuffer.toString('base64'))
// const imageBase64 = `data:image/png;base64,${imageBuffer.toString('base64')}`
// 图片类型消息
// const imageMsg = {
// 	msgtype: 'image',
// 	image: {
// 		base64: imageBuffer.toString('base64'), // 图片内容的base64编码
// 		md5: md5(imageBuffer) // 图片内容（base64编码前）的md5值
// 	}
// }

// 图文类型
const newsMsg = {
	msgtype: 'news',
	news: {
		articles: [
			{
				title: '中秋节礼品领取',
				description: '今年中秋节公司有豪礼相送',
				url: 'https://fol.ztessc.com.cn/',
				picurl: 'http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png'
			},
			{
				title: '国庆放假通知',
				description: '根据国务院节假办安排',
				url: 'http://fssc.csztessc.com.cn:10243/',
				picurl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1577301119181&di=bd3c1d163909bd9b669c56ea422d7621&imgtype=0&src=http%3A%2F%2Fphoto.16pic.com%2F00%2F04%2F41%2F16pic_441027_b.jpg'
			}
		]
	}
}

// markdown消息类型
const markdownMsg = {
	msgtype: 'markdown',
	markdown: {
		content: `#### 当前BUG共计 <font color="warning">132</font> 个 ，请及时[处理](http://113.108.117.211:19979/zentao/my-bug.html)。
		\n>张三         **21**个 \n>猪八戒     **18**个 \n>齐天大圣 **15**个 \n>王五         **10**个 \n>李四           **2**个
		`
	}
}

const sendMsg = data =>
	axios({
		url: BASE_URL + qyweixin.robotKeyProduct,
		method: 'POST',
		data
	})

// sendMsg(imageMsg)

module.exports = {
	sendMsg
}
