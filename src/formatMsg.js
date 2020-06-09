/*
 * @Author: Do not edit
 * @Date: 2020-05-19 10:47:22
 * @LastEditTime: 2020-06-09 18:38:44
 * @LastEditors: 秦真
 * @Description: 格式话展示消息内容
 * @FilePath: \qywx-robot\src\formatMsg.js
 */
const fs = require('fs');
const path = require('path');
const {
  dateFormat,
  countObj
} = require('./utils');

/**
 * 转换
 * @param {Array}} arr 数据
 */
function parse(arr = []) {
  // 统计bug数量
  const group = arr.reduce((acc, item) => {
    if (acc[item]) {
      acc[item]++;
    } else {
      acc[item] = 1;
    }
    return acc;
  }, {});
  // 转成数据后并降序排序
  return Object.entries(group)
    .map(([name, count]) => ({
      name,
      count
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 转换成数据列表形式
 * @param {Object} data 数据
 */
function parseTableList(data) {
  let result = [];
  for (const [field, list] of Object.entries(data)) {
    result = result.concat(
      parse(list)
      .map(({
        name,
        count
      }) => ({
        name,
        [field]: count
      }))
    );
  }
  const tableData = {};
  result.forEach((item) => {
    if (tableData[item.name]) {
      Object.assign(tableData[item.name], item);
    } else {
      tableData[item.name] = item;
    }
  })
  return Object.values(tableData);
}

/**
 * 计算总计
 * @param {Array} arr 数据
 */
function countTableList(arr) {
  return arr.reduce((acc, item) => {
    acc.creator += (item.creator || 0);
    acc.validate += (item.validate || 0);
    acc.closed += (item.closed || 0);
    return acc;
  }, {
    creator: 0,
    validate: 0,
    closed: 0
  });
}

/**
 * 格式话展示markdown消息
 * @param {Object} source 数据
 */
function formatMarkdown(source) {
  const result = countObj(source.data);
  const total = result.reduce((acc, {
    waiting = 0,
    resolved = 0
  }) => {
    acc.waiting += waiting;
    acc.resolved += resolved;
    return acc;
  }, {
    waiting: 0,
    resolved: 0
  });
  const items = result
    .sort(({
      waiting: waitA = 0,
      resolved: resolvedA = 0
    }, {
      waiting: waitB = 0,
      resolved: resolvedB = 0
    }) => {
      if (waitA === waitB) {
        return resolvedB - resolvedA;
      }
      return waitB - waitA;
    })
    .map(({
      name,
      waiting,
      resolved
    }) => {
      const waitingStr = waiting ? `${' '.repeat((3 - String(waiting).length) * 2)}**${waiting}**个` : '    -    ';
      const resolvedStr = resolved ? `${' '.repeat((3 - String(resolved).length) * 2)}**${resolved}**个` : '    -    ';
      return `\n>${name.padEnd(14 - name.length * 2)}${waitingStr}     ${resolvedStr}`;
    });
  if (total.waiting <= 0) {
    // return `**恭喜参与 [${source.title}](${source.bugUrl}) 的成员**
    // <font color="info">你们的Bug清零了，请继续保持。</font>`;
    return '';
  }
  return `当前[${source.title}](${source.bugUrl}) 还有待解决的Bug共计 <font color="warning">${total.waiting}</font> 个，今日已解决共计 <font color="info">${total.resolved}</font> 个，请以下同学及时[处理](${source.myBugUrl}) \n>姓名        待解决      已解决${items.join('')}`;
}

/**
 * 生成静态页面
 * @param {*} date 
 * @param {*} source 
 */
async function writeBugReport(date, source) {
  if (date instanceof Date) {
    date = dateFormat(date);
  }
  const {
    title,
    data
  } = source;
  const tableBodyData = parseTableList(data);
  const tableFootData = countTableList(tableBodyData);
  const tbodyTemplate = tableBodyData.map(
    ({
      name,
      creator = '',
      validate = '',
      closed = ''
    }) => `
      <tr>
        <td>${name}</td>
        <td>${creator}</td>
        <td>${validate}</td>
        <td>${closed}</td>
      </tr>
      `).join('');

  const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - ${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}</title>
  <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" name="viewport" />
  <style>
    .report { width: 470px; margin: 0 auto; margin-top: 50px; padding: 10px;}
    .header {display: flex;justify-content: space-between;height: 30px;}
    .header-left {font-size: 14px;font-weight: bold;}
    .header-right {font-size: 13px;color: #555;}
    table {margin: 0 auto;}
    thead {background: #0089d1;color: #FFF;}
    tfoot {background: #EEE;}
    td {text-align: center;width: 25%;height: 30px;line-height: 30px;}
  </style>
</head>
  <body>
    <div class="report">
      <div class="header">
        <div class="header-left">${title} Bug检验情况</div>
        <div class="header-right">${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}</div>
      </div>
      <table cellspacing="0" cellpadding="10" border="1">
        <thead>
          <tr>
            <td>测试人员</td>
            <td>今日提交bug</td>
            <td>待验证bug</td>
            <td>关闭bug</td>
          </tr>
        </thead>
        <tbody>${tbodyTemplate}</tbody>
        <tfoot>
          <tr>
            <td>总计</td>
            <td>${tableFootData.creator}</td>
            <td>${tableFootData.validate}</td>
            <td>${tableFootData.closed}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </body>
</html>
  `;
  const filepath = path.resolve(__dirname, `../output/report/${date}.html`);
  return new Promise((resolve, reject) => {
    fs.writeFile(
      filepath,
      template,
      'utf8',
      err => err ? reject(err) : resolve({
        date,
        filepath,
        template,
        source,
      })
    );
  });
}



module.exports = {
  formatMarkdown,
  writeBugReport,
};