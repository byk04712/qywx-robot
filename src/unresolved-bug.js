const puppeteer = require('puppeteer')
const { zentao } = require('./config.json')

/**
 * 延迟
 * @param {Number} timeout 延迟时间，默认1000，单位毫秒
 * @returns Promise
 */
const delay = (timeout = 1000) => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

puppeteer.launch({
  defaultViewport: {
    width: 1200,
    height: 700
  }
}).then(async brower => {
  const page = await brower.newPage()
  console.log('打开浏览器新页面')

  await page.goto(zentao.url)
  console.log(`打开地址：${zentao.url}`)

  // 填入账号
  const account = await page.$('#account')
  await account.type(zentao.account, { delay: 300 })
  await delay(500)
  console.log(`填入账号：${zentao.account}`)

  // 填入密码
  const password = await page.$('input[name="password"]')
  await password.type(zentao.password, { delay: 300 })
  await delay(500)
  console.log(`填入密码：${zentao.password.replace(/./g, '*')}`)

  // 提交登录
  const submitButton = await page.$('#submit')
  await submitButton.click()
  await delay(500)
  console.log('点击登录')

  const testNav = await page.$('li[data-id="qa"]')
  await testNav.click()
  await delay(1000)
  console.log('登录成功，点击 “测试” 菜单栏')

  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  await delay(1000)
  console.log('点击进行切换当前项目')

  const targetItem = await page.$('li[data-id="44"]')
  await targetItem.click()
  await delay(1000)
  console.log('切换当前项目为： 产品-报账系统2.0')
})
