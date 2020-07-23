/*
 * @Author: Do not edit
 * @Date: 2020-05-18 17:00:57
 * @LastEditTime: 2020-07-23 13:31:23
 * @LastEditors: 秦真
 * @Description: 禅道配置
 * @FilePath: \qywx-robot\src\config.js
 */
// const baseUrl = 'http://zentao.csztessc.com.cn:19979/zentao/'; // 外网
const baseUrl = 'http://192.168.0.10/zentao/'; // 内网

module.exports = {
  baseUrl,
  username: 'qinzhen',
  password: 'qinzhen123456',
  loginUrl: `${baseUrl}user-login.html`,
  myBugUrl: `${baseUrl}my-bug.html`,
  // 中兴新云，产品报账系统2.0未解决的bug
  bugUrl: `${baseUrl}project-bug-116.html`,
  // 中兴新云，GXB项目-二期630
  bugUrlGXB1: `${baseUrl}project-bug-125.html`,
  // 中兴新云，GXB项目-二期
  bugUrlGXB2: `${baseUrl}project-bug-79.html`,
  // 中兴新云，GXB项目-二期430版本
  bugUrlGXB3: `${baseUrl}project-bug-119.html`,
  // 中兴新云，砺剑行动
  bugUrlLJXD: `${baseUrl}project-bug-120.html`,
  // 中兴新云，产品报账系统2.0-6.30版本（商城）
  bugUrl630: `${baseUrl}project-bug-121.html`,
  // 中兴新云，申能项目
  bugUrlSN: `${baseUrl}project-bug-122.html`,
  // 中兴新云，产品-工时系统2020
  bugUrlGSXT: `${baseUrl}project-bug-123.html`,
  // 中兴新云，产品-采购商城
  bugUrlMALL: `${baseUrl}project-bug-127.html`,
  // 中兴新云，产品-多语言
  bugUrlLanguage: `${baseUrl}project-bug-129.html`,
  // 中兴新云，产品2.0组
  robotKeyForTeam2: '3cf4d463-996c-4e8d-8bda-3f6ecb152954',
  // 中兴新云，研发中心-产品研发团队
  robotKeyForTeam: '0b9b3d5a-0e83-4d16-99e8-42ae608210fd',
  // 中兴新云，工信部
  robotKeyForGXB: '9a109fa1-b445-4567-bc69-dd06df712fbd',
  // 中兴新云，申能
  robotKeyForSN: '425dec9b-c2bc-4d53-934c-b03a53e054c4',
  // 中兴新云，商城
  robotKeyForShop: '9d6fcaf6-42e8-4c23-bf47-1990270f198a',
  // 追梦赤子心 - 技术部
  robotKeyForTest: 'd9323df8-930e-467b-9253-4db62f2dd1aa',
  // 追梦赤子心 - 全员群
  robotKeyForTestAll: '668191e4-43be-43b9-b791-edd7ae1b2278'
}