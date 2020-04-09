/*
 * @Author: Do not edit
 * @Date: 2020-03-02 10:07:36
 * @LastEditTime: 2020-04-07 17:34:24
 * @LastEditors: 秦真
 * @Description: 运行在 Linux 服务器端，需要在linux上安装 Google-Chrome 浏览器，同时指定可执行路径
 * @FilePath: \qywx-robot\src\linux.js
 */
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');
const path = require('path');
const { delay, countBugs } = require('./utils');
const { zentao } = require('./config.json');
const { sendMsg } = require('./robot')

console.log('路径 ' + path.resolve(__dirname, '../chrome-linux/chrome'));

const main = async() => {
  const options = {
    defaultViewport: {
      width: 1200,
      height: 700
    },
    // devtools: true, // 是否是否为每个选项卡自动打开 DevTools 面板，如果这个选项是 true 的话, headless 选项将被设置为 false
    headless: true, // 是否打开无头模式
    slowMo: 20,
    dumpio: true, // 是否将浏览器进程标准输出和标准错误输入到 process.stdout 和 process.stderr 中
    // 以下两行是linux服务器上需要，在linux上安装 google-chrome 浏览器
    executablePath: path.resolve(__dirname, '../chrome-linux/chrome'),
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();

  // 执行操作的步骤
  const procedures = [
    doLogin,
    doJumpTestPage,
    doSwitchProject,
    doJumpUnresolvedPage,
    doSwitchPagination,
    doFetchData,
  ];

  let fetchedData = null;
  
  // 监听页面 DOM 加载完毕事件
  page.on('domcontentloaded', async () => {
    if (procedures.length) {
      try {
        fetchedData = await procedures.shift()();
      } catch (e) {
        console.warn('执行出错了噢！', e);
      }
    }
    // 如果执行完
    if (!procedures.length) {
      console.log('执行完毕，关闭页面');
      page.close();
    }
  });

  // 监听浏览器关闭事件
  page.on('close', doSend);

  await page.goto(zentao.url);
  console.log(`访问地址：${zentao.url}`);

  // 登录操作
  async function doLogin() {
    // 填入账号
    const account = await page.$('#account');
    await account.type(zentao.account);
    console.log(`填入账号：${zentao.account}`);
  
    // 填入密码
    const password = await page.$('input[name="password"]');
    await password.type(zentao.password);
    console.log(`填入密码：${zentao.password.replace(/./g, '*')}`);
  
    // 提交登录
    const submitButton = await page.$('#submit');
    await submitButton.click();
    console.log('点击登录');
  }

  // 登录成功后跳转到“测试”页面
  async function doJumpTestPage() {
    await page.goto(zentao.bugPageUrl);
    console.log('登录成功，跳转 “测试” 页面');
  }

  // 切换当前项目为：产品-报账系统2.0
  async function doSwitchProject() {
    const currentItem = await page.$('#currentItem');
    await currentItem.click();
    console.log('点击进行切换当前项目');
    await delay(3000);
    const targetItem = await page.$('#defaultMenu li[data-id="44"]');
    await targetItem.click();
    console.log('切换当前项目为： 产品-报账系统2.0');
  }

  // 跳转到未解决页面
  async function doJumpUnresolvedPage() {
    await page.goto(zentao.unresolvedTabPageUrl);
    console.log('跳转到“未解决” 栏目');
  }

  // 切换每页显示2000条数据
  async function doSwitchPagination() {
    const recPerPage = await page.$('#_recPerPage');
    await recPerPage.click();
    console.log('点击右下角切换每页显示数据量');
  
    const thousand2 = await page.$('.dropdown.dropup.open ul li:last-child')
    await thousand2.click()
    console.log('点击切换每页显示2000条数据')
  }

  // 获取数据
  async function doFetchData() {
    // 获取内容区域
    const datatableBugList = await page.$('#datatable-bugList .flexarea tbody')
    // 获取所有被指派的人
    const tdTextArray = await datatableBugList.$$eval('td[data-index="7"]', tds => tds.map(td => td.innerText))
    // console.log('获取到数据', tdTextArray)
    return tdTextArray;
  }

  // 发送数据
  async function doSend() {
    const bugs = countBugs(fetchedData);
    const total = bugs.reduce((acc, item) => (acc += item.count), 0)
    const content = bugs.map(({ name, count }) => {
      return `\n>${name.padEnd(14 - name.length * 2)}${' '.repeat((3 - String(count).length) * 2)}**${count}**个`;
    }).join('')
    const msg = {
      msgtype: 'markdown',
      markdown: {
        content: `当前 [产品-报账系统2.0](http://113.108.117.211:19979/zentao/bug-browse-44-0-unresolved-0.html) 还有未解决的BUG共计 <font color="warning">${total}</font> 个 ，请以下同学及时[处理](http://113.108.117.211:19979/zentao/my-bug.html)。
        ${content}
        `
      }
    }
    const res = await sendMsg(msg)
    console.log('发送结果', res.data)
  }

  await doSend();
};

console.log('正在运行定时任务中...')

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = [8, 12, 17];
rule.minute = 30;
schedule.scheduleJob(rule, function() {
  const t = new Date()
  console.log('定时运行运行', t.toLocaleDateString() + ' ' + t.toLocaleTimeString());
  main();
});
