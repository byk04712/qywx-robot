const path = require('path')
const puppeteer = require('puppeteer')
const { zentao } = require('./config.json')

const sleep = timeout => new Promise(resolve => {
  setTimeout(resolve, timeout)
})

const screenshot = async (page, filename) => {
  await page.screenshot({ path: path.resolve(__dirname, `../output/${filename}.png`) })
}

/**
 * 填充查询条件
 * @param {Array} employees 要查询的员工(需在系统中存在的员工)
 * @returns Promise
 */
const fillSearchConditions = (page, employees = []) => employees.map(async (employee, index) => {
  console.log('开始选择查询条件')
  const order = index + 1


  const field = await page.$(`#field${order}_chosen`)
  await field.click()
  console.log(`填入第${order}项选择条件`)


  const chosenItem = await page.$(`#field${order}_chosen li[title="指派给"]`)
  await chosenItem.click()
  console.log(`填入第${order}项选择条件逻辑符`)


  const operator = await page.$(`#operator${order}`)
  await operator.click()
  console.log(`填入第${order}项选择条件逻辑`)


  const chosenValue = await page.$(`#value${order}_chosen`)
  await chosenValue.click()
  console.log(`填入第${order}项选择框点击`)


  const value = await page.$(`#value1_chosen li[title="${employee}"]`)
  await value.click()
  console.log(`填入第${order}项选择框输入${employee.slice(2)}`)


  console.log('查询条件选择完毕')
  return true
})

/**
 * 选中查询条件为或关系
 * @param {Array} elementIds 页面节点元素id
 * @returns Promise
 */
const chooseConditions2or = (page, elementIds = []) => elementIds.map(async (eleId, index) => {
  try {
    await page.$eval(`#${eleId} option[value="or"]`, el => {
      el.selected = 'selected'
    })
  } catch (e) {
    const error = `第${index + 1}项查询组改为或者出错了`
    console.log(error)
    await screenshot(page, error)
  }
})

puppeteer.launch({
  defaultViewport: {
    width: 1200,
    height: 700
  },
  headless: false,
  slowMo: 250,
  // devtools: true
}).then(async browser => {
  const page = await browser.newPage()
  console.log('打开浏览器新页面')


  await page.goto(zentao.url)
  console.log(`打开地址：${zentao.url}`)


  page.on('request', interceptedRequest => {
    // console.log('page request ', interceptedRequest.url())
  })
  page.on('load', () => {
    // console.log('page load ')
  })
  page.on('domcontentloaded', () => {
    // console.log('page domcontentloaded ')
  })
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text())
  })


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
  await page.goto(zentao.bugPageUrl)
  console.log('登录成功，跳转到 “测试” 页面')


  const currentItem = await page.$('#currentItem')
  await currentItem.click()
  console.log('点击进行切换当前项目')


  // 当前项目切换至 “产品-报账系统2.0”
  await sleep(1000)
  const targetItem = await page.$('#defaultMenu li[data-id="44"]')
  await targetItem.click()
  console.log('切换当前项目为： 产品-报账系统2.0')


  // 点击自定义的查询组
  // await sleep(1000)
  // const myQuery = await page.$('#featurebar li[id^="QUERY"]')
  // await myQuery.click()
  // console.log('点击自定义的搜索页签查询条件')
  // 点击搜索 tab panel
  // const bysearchTab = await page.$('#bysearchTab')
  // await bysearchTab.click()
  // console.log('点击搜索页签')


  // 填入要搜索的信息
  const results = await Promise.all(fillSearchConditions(page, zentao.employees))
  console.log('结果', results)


  // 条件改为或者
  // await Promise.all(chooseConditions2or(page, ['andOr2', 'andOr3', 'groupAndOr', 'andOr5', 'andOr6']))


  // // 点击搜索
  // const submit = await page.$('#submit')
  // await submit.click()
  // console.log('点击搜索按钮，查询bug')
  // await screenshot(page, "查询到bug结果")


  // // 点击报表
  // const actions = await page.$('.actions')
  // const btns = await actions.$$('.btn-group')
  // if (Array.isArray(btns) && btns.length > 2) {
  //   await btns[2].click()
  // }
  // console.log('查询到bug，点击报表按钮')


  // // 勾选报表页面的“指派给统计”
  // const chartsbugsPerAssignedTo = await page.$('#chartsbugsPerAssignedTo')
  // await chartsbugsPerAssignedTo.click()
  // console.log('报表页面勾选“指派给统计”')


  // // 点击生成报表按钮
  // const submitReport = await page.$('#submit')
  // await submitReport.click()
  // await delay(2000)
  // await screenshot(page, "获取到bug报表")
  // console.log('点击“生成报表”按钮')


  // // 获取报表区域元素
  // const report = await page.$('.table.active-disabled')
  // await report.screenshot({ path: 'report.png', clip: { x: 300, y: 225, width: 860, height: 214 } })
  // await delay(2000)
  // console.log('完成报表获取，请查看 report.png')

  // process.exit(0)
})