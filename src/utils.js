/*
 * @Author: Do not edit
 * @Date: 2020-03-02 16:28:38
 * @LastEditTime: 2020-06-09 10:31:32
 * @LastEditors: 秦真
 * @Description: 工具类
 * @FilePath: \qywx-robot\src\utils.js
 */
/**
 * 延时执行
 * @param {Number} ms 延迟时间(单位:毫秒)
 */
const delay = (ms = 500) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

/**
 * 日期格式化
 * @param {Date} date 日期
 * @param {String} pattern 格式，默认yyyyMMdd
 */
const dateFormat = (date = new Date(), pattern = 'yyyyMMdd') => {
  if (date instanceof Date) {
    const o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(pattern)) {
      pattern = pattern.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return pattern;
  }
  return '';
}

/**
 * 数组转对象
 * @param {*} arr 数组
 */
function arrayCount(arr) {
  if (Array.isArray(arr)) {
    return arr.reduce((acc, item) => {
      acc[item] = (acc[item] ? acc[item] + 1 : 1);
      return acc;
    }, {});
  }
  return {};
}

/**
 * 对象转数组
 * @param {Object} obj 对象
 * @param {String} key 对象转数组后的键名称
 * @param {String} value 对象转数组后的值名称
 */
function object2Array(obj, key = 'key', value = 'value') {
  const arr = [];
  for (const [k, v] of Object.entries(obj)) {
    arr.push({
      [key]: k,
      [value]: v,
    })
  }
  return arr;
}

/**
 * 分组统计数据
 * @param {Object} source 源数据
  before: 
    {
      waiting: [ '张三', '李四', '张三', '张三', '赵六', '孙七' ],
      resolved: [ '李四', '李四', '王五', '孙七', '李四' ]
    }
  after: 
    [
      {name: "张三", waiting: 3}
      {name: "李四", waiting: 1, resolved: 3}
      {name: "赵六", waiting: 1}
      {name: "孙七", waiting: 1, resolved: 1}
      {name: "王五", resolved: 1}
    ]
 */
function countObj(source) {
  const combineObj = [];
  for (const [key, value] of Object.entries(source)) {
    value.forEach((name) => {
      const obj = combineObj.find(e => e.name === name);
      if (obj) {
        obj[key] = (obj[key] ? obj[key] + 1 : 1);
      } else {
        combineObj.push({
          name,
          [key]: 1
        });
      }
    });
  }
  return combineObj;
}

module.exports = {
  delay,
  dateFormat,
  arrayCount,
  object2Array,
  countObj,
};