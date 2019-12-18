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

/**
 * 填充查询条件
 * @param {Array} employees 要查询的员工(需在系统中存在的员工)
 * @returns Promise
 */
const fillSearchConditions = (page, employees = []) => employees.map(async (employee, index) => {
  const order = index + 1
  try {
    const field = await page.$(`#field${order}_chosen}`)
    await field.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件出错了`
    console.log(error)
    await page.screenshot({ path: `${error}.png` })
  }
  try {
    const chosenItem = await page.$(`#field${order}_chosen li[title="指派给"]`)
    await chosenItem.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件逻辑符出错了`
    console.log(error)
    await page.screenshot({ path: `${error}.png` })
  }
  try {
    const operator = await page.$(`#operator${order}`)
    await operator.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件逻辑符点击`
    console.log(error)
    await page.screenshot({ path: `${error}.png` })
  }
  try {
    const chosenValue = await page.$(`#value${order}_chosen`)
    await delay(1000)
    await chosenValue.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择框点击出错了`
    console.log(error)
    await page.screenshot({ path: `${error}.png` })
  }
  try {
    const value = await page.$(`#value1_chosen li[title="${employee}]`)
    await value.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择框输入${employee}出错了`
    console.log(error)
    await page.screenshot({ path: `${error}.png` })
  }
})

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(zentao.url)

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
  await account.type(zentao.account, { delay: 300 })
  // 填入密码
  const password = await page.$('input[name="password"]')
  await password.type(zentao.password, { delay: 300 })
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

  // 点击搜索 tab panel
  const bysearchTab = await page.$('#bysearchTab')
  await bysearchTab.click()
  await delay(1000)
  // await page.screenshot({ path: '6.png' })

  // 填入要搜索的信息
  await Promise.all(fillSearchConditions(page, zentao.employees))

  // 点击搜索
  try {
    const submit = await page.$('#submit')
    await submit.click()
    await delay(1000)
    await page.screenshot({ path: '12.png' })
  } catch (e) {
    console.log('测试菜单页 -> 搜索 -> 点击搜索按钮出错')
    await page.screenshot({ path: '点击搜索按钮出错.png' })
  }
})()
