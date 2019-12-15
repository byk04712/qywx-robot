const axios = require('axios')

const BASE_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key='
const ROBOT_KEY = 'd9323df8-930e-467b-9253-4db62f2dd1aa'


function sendMsg() {
	axios({
		url: BASE_URL + ROBOT_KEY,
		method: 'POST',
		data: {
			msgtype: 'text',
			text: {
				content: 'Hello World'
			}
		}
	})
		// .then(res => res.response())
		.then(res => {
			console.log('发送结果', res.data)
		})
}

sendMsg()
