/*
 * @Author: Do not edit
 * @Date: 2020-03-02 16:28:38
 * @LastEditTime: 2020-03-03 14:32:27
 * @LastEditors: 秦真
 * @Description: 工具类
 * @FilePath: \qywx-robot\src\utils.js
 */
const { qyweixin } = require('./config.json');

/**
 * 延时执行
 * @param {*} ms 延迟时间(单位:毫秒)
 */
const delay = (ms = 500) => new Promise(resolve => {
  setTimeout(resolve, ms)
});

/**
 * 统计数据
 * @param {*} arr 未统计之前的数据
 */
const countBugs = (arr = []) => {
  // 获取到统计的用户
  var obj = arr
    .filter(e => qyweixin.rdEmployees.includes(e))
    .reduce((acc, item) => {
      if (acc[item]) {
        acc[item]++
      } else {
        acc[item] = 1
      }
      return acc
    }, {})
  return Object.entries(obj).map(item => ({ name: item[0], count: item[1] })).sort((a, b) => b.count - a.count)
}

module.exports = {
  delay,
  countBugs,
};
