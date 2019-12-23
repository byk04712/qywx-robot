const { qyweixin, zentao } = require('./config.json')
const axios = require('axios')
const fs = require('fs')
const md5 = require('md5')

const BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='

// markdown消息类型
const markdownMsg = {
	msgtype: 'markdown',
	markdown: {
		content: `#### 当前BUG共计 <font color="warning">132</font> 个 ，请及时[处理](http://113.108.117.211:19979/zentao/my-bug.html)。
		\n>张三        **21**个 \n>空本给     **20**个 \n>张三张三 **20**个 \n>张三        **20**个 \n>张三        **20**个
		`
	}
}


function sendMsg() {
	axios({
		url: BASE_URL + qyweixin.robotKeyTest,
		method: 'POST',
		data: markdownMsg
	})
		.then(res => {
			console.log('发送结果', res.data)
		})
}

sendMsg()
