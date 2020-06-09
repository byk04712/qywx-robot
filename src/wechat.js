/*
 * @Author: Do not edit
 * @Date: 2020-05-22 10:45:33
 * @LastEditTime: 2020-05-27 14:37:44
 * @LastEditors: 秦真
 * @Description: 企业微信群聊机器人发送消息
 * @FilePath: \EggVueSSR\app\robot\wechat.js
 */
const Axios = require('axios');

/**
 * 发送消息
 * @param {String} key 发送到的群机器人KEY
 * @param {Object} data 消息内容
 */
function send(key, data) {
  return Axios({
    url: `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${key}`,
    method: 'POST',
    data
  });
}

/**
 * 发送文本类型消息
 * @param {String} key 发送到的群机器人KEY
 * @param {String} content 文本内容，最长不超过2048个字节，必须是utf8编码
 * @param {Array|String} mentioned_list userid的列表，提醒群中的指定成员(@某个成员)，@all表示提醒所有人，如果开发者获取不到userid，可以使用mentioned_mobile_list
 * @param {Array|String} mentioned_mobile_list 手机号列表，提醒手机号对应的群成员(@某个成员)，@all表示提醒所有人
 */
function sendTextMsg(key, content, mentioned_list, mentioned_mobile_list) {
  return send(key, {
    msgtype: 'text',
    text: {
      content,
      mentioned_list,
      mentioned_mobile_list,
    }
  });
}

/**
 * 发送图片类型消息
 * @param {String} key 发送到的群机器人KEY
 * @param {String} base64 图片内容的base64编码
 * @param {String} md5 图片内容（base64编码前）的md5值
 */
function sendImageMsg(key, base64, md5) {
  return send(key, {
    msgtype: 'image',
    image: {
      base64,
      md5,
    }
  });
}

/**
 * 发送图文类型消息
 * @param {String} key 发送到的群机器人KEY
 * @param {Array} articles 图文消息列表
 * articles: {
 *    title       标题，不超过128个字节，超过会自动截断
 *    description 描述，不超过512个字节，超过会自动截断
 *    url         点击后跳转的链接。
 *    picurl      图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图 1068*455，小图150*150。
 * }
 */
function sendNewsMsg(key, articles) {
  return send(key, {
    msgtype: 'news',
    news: {
      articles,
    }
  });
}

/**
 * 发送markdown类型消息
 * @param {String} key 发送到的群机器人KEY
 * @param {String} content markdown内容，最长不超过4096个字节，必须是utf8编码
 */
function sendMarkdownMsg(key, content) {
  return send(key, {
    msgtype: 'markdown',
    markdown: {
      content,
    }
  });
}

module.exports = {
  sendTextMsg,
  sendImageMsg,
  sendNewsMsg,
  sendMarkdownMsg,
};