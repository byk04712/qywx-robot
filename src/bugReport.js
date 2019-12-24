const path = require('path')
const puppeteer = require('puppeteer')
const { zentao } = require('./config.json')

const screenshot = async (page, filename) => {
  await page.screenshot({ path: path.resolve(__dirname, `../output/${filename}.png`) })
}

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
    const field = await page.$(`#field${order}_chosen`)
    await delay(1000)
    await field.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件出错了`
    console.log(error, e)
    await screenshot(page, error)
  }
  try {
    const chosenItem = await page.$(`#field${order}_chosen li[title="指派给"]`)
    await delay(1000)
    await chosenItem.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件逻辑符出错了`
    console.log(error)
    await screenshot(page, error)
  }
  try {
    const operator = await page.$(`#operator${order}`)
    await delay(1000)
    await operator.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择条件逻辑符点击`
    console.log(error)
    await screenshot(page, error)
  }
  try {
    const chosenValue = await page.$(`#value${order}_chosen`)
    await delay(1000)
    await chosenValue.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择框点击出错了`
    console.log(error)
    await screenshot(page, error)
  }
  try {
    const value = await page.$(`#value1_chosen li[title="${employee}"]`)
    await delay(1000)
    await value.click()
    await delay(1000)
  } catch (e) {
    const error = `第${order}项选择框输入${employee.slice(2)}出错了`
    console.log(error)
    await screenshot(page, error)
  }
})

const chooseConditions2or = (page, elementIds = []) => elementIds.map(async (eleId, index) => {
  try {
    await page.$eval(`#${eleId} option[value="or"]`, el => {
      el.selected = 'selected'
    })
    await delay(1000)
  } catch (e) {
    const error = `第${index + 1}项查询组改为或者出错了`
    console.log(error)
    await screenshot(page, error)
  }
})

const logRequest = interceptedRequest => {
  console.log('page request ', interceptedRequest.url())
}

const logLoad = () => {
  console.log('page load ')
}

const logDomcontentloaded = () => {
  console.log('page domcontentloaded ')
}

puppeteer.launch({
  defaultViewport: {
    width: 1200,
    height: 700
  }
}).then(async browser => {
  const page = await browser.newPage()
  console.log('打开浏览器新页面')

  await page.goto(zentao.url)
  console.log(`打开地址：${zentao.url}`)

  // page.on('request', logRequest)
  page.on('load', logLoad)
  page.on('domcontentloaded', logDomcontentloaded)

  // 填入账号
  const account = await page.$('#account')
  await account.type(zentao.account, { delay: 300 })
  console.log(`填入账号：${zentao.account}`)

  // 填入密码
  const password = await page.$('input[name="password"]')
  await password.type(zentao.password, { delay: 300 })
  console.log(`填入密码：${zentao.password.replace(/./g, '*')}`)

  // 提交登录
  const submitButton = await page.$('#submit')
  await submitButton.click()
  await delay(1000)
  console.log('点击登录')

  // const testNav = await page.$('li[data-id="qa"]')
  // await testNav.click()
  // await delay(1000)
  // console.log('登录成功，点击 “测试” 菜单栏')

  await page.goto(zentao.bugPageUrl)
  console.log('登录成功，跳转到 “测试” 页面')

  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  await delay(1000)
  console.log('点击进行切换当前项目')

  // 当前项目切换至 “产品-报账系统2.0”
  try {
    const targetItem = await page.$('li[data-id="44"]')
    await targetItem.click()
    await delay(1000)
    console.log('切换当前项目为： 产品-报账系统2.0')
  } catch (e) {
    const error = '测试菜单页__切换项目出错了'
    console.log(error)
    await screenshot(page, error)
  }

  // 点击自定义的查询组
  const myQuery = await page.$('#featurebar li[id^="QUERY"]')
  await myQuery.click()
  await delay(1000)
  console.log('点击自定义的搜索页签查询条件')

  // 点击搜索 tab panel
  const bysearchTab = await page.$('#bysearchTab')
  await delay(1000)
  await bysearchTab.click()
  console.log('点击搜索页签')
  await delay(1000)

  // 填入要搜索的信息
  // await Promise.all(fillSearchConditions(page, zentao.employees))
  // 条件改为或者
  // await Promise.all(chooseConditions2or(page, ['andOr2', 'andOr3', 'groupAndOr', 'andOr5', 'andOr6']))

  // 点击搜索
  try {
    const submit = await page.$('#submit')
    await submit.click()
    await delay(1000)
    console.log('点击搜索按钮，查询bug')
    await screenshot(page, "查询到bug结果")
  } catch (e) {
    const error = '测试菜单页__搜索__点击搜索按钮出错'
    console.log(error)
    await screenshot(page, error)
  }

  // 点击报表
  const actions = await page.$('.actions')
  const btns = await actions.$$('.btn-group')
  if (Array.isArray(btns) && btns.length > 2) {
    await btns[2].click()
  }
  await delay(1000)
  console.log('查询到bug，点击报表按钮')

  // 勾选报表页面的“指派给统计”
  const chartsbugsPerAssignedTo = await page.$('#chartsbugsPerAssignedTo')
  await chartsbugsPerAssignedTo.click()
  await delay(1000)
  console.log('报表页面勾选“指派给统计”')

  // 点击生成报表按钮
  const submitReport = await page.$('#submit')
  await submitReport.click()
  await delay(2000)
  await screenshot(page, "获取到bug报表")
  console.log('点击“生成报表”按钮')

  // 获取报表区域元素
  const report = await page.$('.table.active-disabled')
  await report.screenshot({ path: 'report.png', clip: { x: 300, y: 225, width: 860, height: 214 } })
  await delay(2000)
  console.log('完成报表获取，请查看 report.png')

  process.exit(0)
})