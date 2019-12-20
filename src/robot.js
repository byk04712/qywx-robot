const { qyweixin, zentao } = require('./config.json')
const axios = require('axios')
const fs = require('fs')
const md5 = require('md5')

const BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

// markdown消息类型
const markdownMsg = {
	msgtype: 'markdown',
	markdown: {
		content: `实时新增用户反馈<font color="warning">132例</font>，请相关同事注意。\n>类型:<font color="comment">用户反馈</font> \n>普通用户反馈:<font color="comment">117例</font> \n>VIP用户反馈:<font color="comment">15例</font>`
	}
}

// 将本地图片转为 base64
const bitmap = fs.readFileSync('report.png')
const md5Str = md5(bitmap)
const base64Str = Buffer.from(bitmap, 'binary').toString('base64')
const imagePrefix = 'data:image/png;base64,'

console.log('图片md5', md5Str)

// 图片消息类型
const imageMsg = {
    msgtype: 'image',
    image: {
        base64: imagePrefix + base64Str,
        md5: md5Str
    }
}

// 图文消息类型
const newsMsg = {
    msgtype: 'news',
    news: {
       articles : [
           {
               title: '截至目前为止BUG分布情况',
               description: '这些bug不解决掉，要留着过年嘛！',
               url: zentao.myBugUrl,
               picurl: 'http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png'
           },
           {
               title: '截至目前为止BUG分布情况',
               description: '这些bug不解决掉，要留着过年嘛！',
               url: zentao.myBugUrl,
               picurl: 'http://res.mail.qq.com/node/ww/wwopenmng/images/independent/doc/test_pic_msg1.png'
           },
        ]
    }
}

function sendMsg() {
	axios({
		url: BASE_URL + qyweixin.robotKeyTest,
		method: 'POST',
		data: imageMsg
	})
		.then(res => {
			console.log('发送结果', res.data)
		})
}

sendMsg()
