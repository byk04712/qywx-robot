const puppeteer = require('puppeteer')
const { zentao } = require('./config.json')

puppeteer.launch({
  defaultViewport: {
    width: 1200,
    height: 700
  },
  headless: false,
  slowMo: 200
}).then(async brower => {
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

  // const testNav = await page.$('li[data-id="qa"]')
  // await testNav.click()
  // console.log('登录成功，点击 “测试” 菜单栏')
  await page.goto('http://113.108.117.211:19979/zentao/bug-browse.html')
  console.log('登录成功，跳转 “测试” 页面')

  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  console.log('点击进行切换当前项目')

  const targetItem = await page.$('#defaultMenu li[data-id="44"]')
  await targetItem.click()
  console.log('切换当前项目为： 产品-报账系统2.0')

  const unresolvedTab = await page.$('#unresolvedTab')
  await unresolvedTab.click()
  console.log('点击 “未解决” 栏目')

  const recPerPage = await page.$('#_recPerPage')
  await recPerPage.click()
  console.log('点击右下角切换每页显示数据量')

  const thousand2 = await page.$('.dropdown.dropup.open ul li:last-child')
  await thousand2.click()
  console.log('点击切换每页显示2000条数据')

  const datatableBugList = await page.$eval('#datatable-bugList', el => {
    // const trs = el.querySelectorAll('.datatable-rows .flexarea table tbody tr')
    console.log('trs ', el.querySelector)
    // return trs
    return {}
  })

  console.log('datatableBugList ', datatableBugList)
  await page.screenshot({ path: 'a.png' })
  process.exit(0)
})
