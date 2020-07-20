/*
 * @Author: Do not edit
 * @Date: 2020-05-22 10:45:24
 * @LastEditTime: 2020-07-20 10:28:50
 * @LastEditors: 秦真
 * @Description: 
 * @FilePath: \qywx-robot\src\zentao.js
 */
const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');
const fs = require('fs');
const {
  loginUrl,
  username,
  password,
  myBugUrl
} = require('./config');
const {
  delay,
  dateFormat
} = require('./utils');

module.exports = (() => {
  let browser = null;
  const platform = os.platform();
  const isLinux = platform === 'linux'
  console.log(`当前系统是：${platform}`);

  async function launchBrowser() {
    const defaultOptions = {
      product: 'chrome', // chrome / firefox
      // 默认视窗宽高
      defaultViewport: {
        width: 1366,
        height: 768,
      },
      // devtools: true, // 是否是否为每个选项卡自动打开 DevTools 面板，如果这个选项是 true 的话, headless 选项将被设置为 false
      headless: isLinux, // 是否打开无头模式
      slowMo: 20, // 操作间隔时间
      dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中
    };
    // 如果在 linux 系统，linux上需安装 google-chrome 浏览器
    if (isLinux) {
      defaultOptions.executablePath = path.resolve(__dirname, '../chrome-linux/chrome');
      defaultOptions.args = ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'];
    } else {
      defaultOptions.args = ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage'];
    }
    const browser = await puppeteer.launch(defaultOptions);

    console.log(`启动了 Puppeteer ，进程ID是: ${browser.process().pid}`);

    browser.on('disconnected', launchBrowser);

    return browser;
  }

  /**
   * 登录
   */
  async function doLogin(page) {
    // 访问的页面地址是登录页面才进行登录操作
    if (page.url() === loginUrl) {
      await delay(500);
      // 填入账号
      const usernameInput = await page.$('#account');
      await usernameInput.type(username);
      // 填入密码
      const passwordInput = await page.$('input[name="password"]');
      await passwordInput.type(password);
      // 提交登录
      const submitButton = await page.$('#submit');
      await submitButton.click();
      console.log(`账号：[${username}] 登录禅道`);
    }
  }

  /**
   * 切换分页
   */
  async function doSwitchPagination(page) {
    const recPerPage = await page.$('#_recPerPage');
    await delay(300);
    if (recPerPage) {
      await recPerPage.click();
      const thousand2 = await page.$('.dropdown.dropup.open ul li:last-child')
      await thousand2.click()
      console.log('切换每页显示2000条数据')
    }
  }

  /**
   * 跳转页面
   */
  async function doGoto(page, url) {
    const result = await page.goto(url);
    const title = await page.title();
    console.log(`跳转到 [${title}]`);
    return {
      title: title.indexOf('::') > -1 ? title.split('::')[0] : title,
      result,
    };
  }

  /**
   * 查询条件
   */
  async function doConditions(
    page, {
      fieldId,
      fieldValue,
      operator,
      valueId,
      valueValue,
    }
  ) {
    await delay(1000);
    console.log('\t条件筛选开始');
    const field1 = await page.$(`#${fieldId}_chosen`);
    await field1.click();
    await delay(500);
    const field1Val = await field1.$(`li[title="${fieldValue}"]`);
    await field1Val.click();
    await delay(500);
    await page.type('#operator1', operator); // 立即输入
    await delay(500);
    let value1 = null;
    // 判断是下拉选择框还是文本输入框
    const value1Display = await page.$eval(`#${valueId}`, node => node.style.getPropertyValue('display'));
    if (value1Display === 'none') {
      value1 = await page.$(`#${valueId}_chosen`);
      await value1.click();
      const value1Val = await value1.$(`li[title="${valueValue}"]`);
      await value1Val.click();
    } else {
      value1 = await page.$(`#${valueId}`);
      await value1.type(valueValue);
    }
    console.log('\t条件筛选结束');
  }

  /**
   * 批量抓取数据
   * @param {Page} page puppeteer Page实例对象
   * @param {Array} queryParams 查询条件对象
   */
  async function batchFetch(page, queryParams = []) {
    const data = {};
    for (let i = 0, len = queryParams.length; i < len; i++) {
      const {
        resultKey,
        conditions,
        getColumnIndex,
      } = queryParams[i];
      // 选择查询条件
      for (let j = 0; j < conditions.length; j++) {
        await doConditions(page, conditions[j]);
      }
      const submit = await page.$('#submit');
      await submit.click();
      console.log('点击搜索按钮')
      await delay(6000);
      // 获取内容区域
      const bugList = await page.$('#bugList tbody')
      if (bugList) {
        // 获取所有被指派的人
        data[resultKey] = await bugList.$$eval(`tr td:nth-of-type(${getColumnIndex})`, tds => tds.map(td => td.innerText));
      } else {
        data[resultKey] = [];
      }
      await delay(3000);
    }
    return data;
  }

  /**
   * 统计分析开发人员bug量
   * @param {Date} date 统计日期
   * @param {String} bugUrl 项目URL地址
   */
  async function analyseDeveloperBug(date, bugUrl) {
    if (!browser) {
      browser = await launchBrowser();
    }
    if (!date) {
      throw new Error(`date is required!`);
    }
    const page = await browser.newPage();
    await doGoto(page, loginUrl);
    await doLogin(page);
    await delay(3000);
    const {
      title
    } = await doGoto(page, bugUrl);
    await delay(3000);
    // 切换分页
    await doSwitchPagination(page);
    await delay(8000);
    const data = await batchFetch(
      page,
      [{
          resultKey: 'waiting',
          conditions: [{
            fieldId: 'field1',
            fieldValue: 'Bug状态',
            operator: '=',
            valueId: 'value1',
            valueValue: '激活',
          }],
          getColumnIndex: 6,
        },
        {
          resultKey: 'resolved',
          conditions: [{
            fieldId: 'field1',
            fieldValue: '解决日期',
            operator: '=',
            valueId: 'value1',
            valueValue: dateFormat(date, 'yyyy-MM-dd'),
          }],
          getColumnIndex: 7,
        },
      ]
    );
    // console.log('获取到开发人员的bug', data);
    await page.close();
    return {
      title,
      data,
      bugUrl,
      myBugUrl,
    };
  }

  /**
   * 统计分析测试人员提交bug量
   * @param {Date} date 统计日期
   * @param {String} bugUrl 项目URL地址
   */
  async function analyseTesterBug(date, bugUrl) {
    if (!browser) {
      browser = await launchBrowser();
    }
    if (!date) {
      throw new Error(`date is required!`);
    }
    const page = await browser.newPage();
    await page.goto(loginUrl);
    console.log(`跳转禅道登录页面 ${loginUrl}`);
    await doLogin(page);
    await delay(3000);
    const {
      title
    } = await doGoto(page, bugUrl);
    await delay(3000);
    // 切换分页
    await doSwitchPagination(page);
    await delay(8000);
    const data = await batchFetch(
      page,
      [{
          resultKey: 'creator',
          conditions: [{
            fieldId: 'field1',
            fieldValue: '创建日期',
            operator: '=',
            valueId: 'value1',
            valueValue: dateFormat(date, 'yyyy-MM-dd'),
          }],
          getColumnIndex: 5,
        },
        {
          resultKey: 'validate',
          conditions: [{
            fieldId: 'field1',
            fieldValue: 'Bug状态',
            operator: '=',
            valueId: 'value1',
            valueValue: '已解决',
          }],
          getColumnIndex: 5,
        },
        {
          resultKey: 'closed',
          conditions: [{
            fieldId: 'field1',
            fieldValue: '关闭日期',
            operator: '=',
            valueId: 'value1',
            valueValue: dateFormat(date, 'yyyy-MM-dd'),
          }],
          getColumnIndex: 5,
        },
      ]
    );
    // console.log('获取到开发人员的bug', data);
    await page.close();
    return {
      title,
      data,
    };
  }

  /**
   * 抓取数据截图
   */
  async function screenshotTesterReport(dirName, date) {
    if (!browser) {
      browser = await launchBrowser();
    }
    if (!date) {
      throw new Error(`date is required!`);
    } else if (date instanceof Date) {
      date = dateFormat(date);
    }
    const page = await browser.newPage();
    await doGoto(page, `http://127.0.0.1:3000/output/report/${dirName}/${date}.html`);
    await delay(1000);
    const table = await page.$('.report');
    if (!table) {
      throw new Error('访问生成的报表页面失败！');
    }
    const dir = path.resolve(__dirname, `../output/images/${dirName}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }  
    const filepath = path.resolve(__dirname, `../output/images/${dirName}/${date}.png`);
    const imageBase64 = await table.screenshot({
      path: filepath,
      encoding: 'binary'
    });
    console.log(`截图完成，图片路径存放在 ${filepath}`);
    await page.close();
    return imageBase64;
  }

  return {
    analyseDeveloperBug,
    analyseTesterBug,
    screenshotTesterReport,
  };
})();