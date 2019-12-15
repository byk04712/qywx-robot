const puppeteer = require('puppeteer')
const { zantao } = require('./config.json')

const delay = timeout => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(zantao.url)

  // await page.screenshot({ path: '1.png' })

  // page.on('load', async () => {
  //   const title = await page.$('title')
  //   console.log('loaded', title.innerText)
  // })
  // page.on('domcontentloaded', async () => {
  //   const title = await page.$('body')
  //   console.log('domcontentloaded', title.innerText)
  // })
  // 填入账号
  const account = await page.$('#account')
  await account.type(zantao.account, { delay: 300 })
  // 填入密码
  const password = await page.$('input[name="password"]')
  await password.type(zantao.password, { delay: 300 })
  // 提交登录
  const submitButton = await page.$('#submit')
  await submitButton.click()
  await delay(1000)
  // await page.screenshot({ path: '2.png' })
  const testNav = await page.$('li[data-id="qa"]')
  await testNav.click()
  await delay(1000)
  // await page.screenshot({ path: '3.png' })
  // 点击选择当前项目
  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  await delay(1000)
  // await page.screenshot({ path: '4.png' })
  // 当前项目切换至 “产品-报账系统2.0”
  try {
    const targetItem = await page.$('li[data-id="44"]')
    await targetItem.click()
    await delay(1000)
  } catch (e) {
    await page.screenshot({ path: '切换项目错误.png' })
    console.log('测试菜单页 -> 切换项目出错了')
  }

  // 点击搜索
  const bysearchTab = await page.$('#bysearchTab')
  await bysearchTab.click()
  await delay(1000)
  // await page.screenshot({ path: '6.png' })

  // 填入要搜索的信息
  const field1 = await page.$('#field1_chosen')
  await field1.click()
  await delay(1000)
  const chosenItem1 = await page.$('#field1_chosen li[title="指派给"]')
  await chosenItem1.click()
  await delay(1000)
  // await page.screenshot({ path: '7.png' })
  const operator1 = await page.$('#operator1')
  await operator1.click()
  await delay(1000)
  // await page.screenshot({ path: '8.png' })
  try {
    const chosenValue1 = await page.$('#value1_chosen')
    await delay(1000)
    await chosenValue1.click()
    await delay(1000)
    await page.screenshot({ path: '10.png' })
  } catch (e) {
    console.log('2出错了')
  }

  try {
    const value1 = await page.$page('#value1_chosen li[title="Q:秦真"]')
    // console.log('得到第一个选项值', value1)
    // await value1.click()
    // await delay(1000)
    // await page.screenshot({ path: '11.png' })
  } catch (e) {
    console.log('测试菜单页 -> 搜索 -> 填写第一个筛选值出错')
    await page.screenshot({ path: '填写第一个筛选值出错.png' })
  }

  // const eq1 = await page.$('#operator1 option[value="="]')
  // await eq1.click()
  // await page.screenshot({ path: '9.png' })
  // const chosenValue1 = await page.$('#value1_chosen')
  // await chosenValue1.click()
  // await delay(1000)
  // await page.screenshot({ path: '10.png' })
  // const chosenValue1 = await page.$('#value1_chosen')
  // await chosenValue1.click()
  // await delay(1000)
  // await page.screenshot({ path: '9.png' })

  // await page.$eval('#value1', async (node) => {
  //   node.click()
  // })
  // await browser.close()
})()
