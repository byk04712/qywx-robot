const puppeteer = require('puppeteer')
const { zentao, qyweixin } = require('./config.json')

const sleep = (timeout = 500) => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

const unresolvedBug = async () => {
  const brower = await puppeteer.launch({
    defaultViewport: {
      width: 1200,
      height: 700
    },
    headless: true,
    slowMo: 20
  })
  const page = await brower.newPage()
  console.log('打开浏览器新页面')

  await page.goto(zentao.url)
  console.log(`打开地址：${zentao.url}`)

  // 填入账号
  const account = await page.$('#account')
  await account.type(zentao.account)
  console.log(`填入账号：${zentao.account}`)

  // 填入密码
  const password = await page.$('input[name="password"]')
  await password.type(zentao.password)
  console.log(`填入密码：${zentao.password.replace(/./g, '*')}`)

  // 提交登录
  const submitButton = await page.$('#submit')
  await submitButton.click()
  console.log('点击登录')

  await sleep()
  // const testNav = await page.$('li[data-id="qa"]')
  // await testNav.click()
  // console.log('登录成功，点击 “测试” 菜单栏')
  await page.goto(zentao.bugPageUrl)
  console.log('登录成功，跳转 “测试” 页面')

  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  console.log('点击进行切换当前项目')

  await sleep(1000)
  const targetItem = await page.$('#defaultMenu li[data-id="44"]')
  await targetItem.click()
  console.log('切换当前项目为： 产品-报账系统2.0')

  await sleep()
  // const unresolvedTab = await page.$('#unresolvedTab')
  // await unresolvedTab.click()
  // console.log('点击 “未解决” 栏目')
  await page.goto(zentao.unresolvedTabPageUrl)
  console.log('跳转到“未解决” 栏目')

  const recPerPage = await page.$('#_recPerPage')
  await recPerPage.click()
  console.log('点击右下角切换每页显示数据量')

  const thousand2 = await page.$('.dropdown.dropup.open ul li:last-child')
  await thousand2.click()
  console.log('点击切换每页显示2000条数据')

  await sleep(1000)
  // 获取内容区域
  const datatableBugList = await page.$('#datatable-bugList .flexarea tbody')
  await sleep()
  // 获取所有被指派的人
  const tdTextArray = await datatableBugList.$$eval('td[data-index="7"]', tds => tds.map(td => td.innerText))
  console.log('获取到数据', tdTextArray)

  // setTimeout(() => {
  //   process.exit(0)
  // }, 3000)

  // 处理数据
  return handleData(tdTextArray)
}

function handleData (arr = []) {
  console.log('before ', arr.length)
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
  unresolvedBug
}
