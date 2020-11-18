/*
 * @Author: Do not edit
 * @Date: 2020-05-18 17:00:57
 * @LastEditTime: 2020-11-18 13:44:44
 * @LastEditors: 秦真
 * @Description: 禅道配置
 * @FilePath: \qywx-robot\src\config.js
 */
const baseUrl = 'http://zentao.csztessc.com.cn:19979/zentao/'; // 外网
const baseUrlLocal = 'http://192.168.0.10/zentao/'; // 内网

module.exports = {
  baseUrl,
  baseUrlLocal,
  username: 'qinzhen',
  password: 'qinzhen123456',
  loginUrl: `${baseUrlLocal}user-login.html`,
  myBugUrl: `${baseUrlLocal}my-bug.html`,
  // 中兴新云，GXB项目-二期630
  bugUrlGXB1: `${baseUrlLocal}project-bug-125.html`,
  // 中兴新云，GXB项目-二期
  bugUrlGXB2: `${baseUrlLocal}project-bug-79.html`,
  // 中兴新云，GXB项目-二期430版本
  bugUrlGXB3: `${baseUrlLocal}project-bug-119.html`,
  // 中兴新云，砺剑行动
  bugUrlLJXD: `${baseUrlLocal}project-bug-120.html`,
  // 中兴新云，产品报账系统2.0-6.30版本（商城）
  bugUrl630: `${baseUrlLocal}project-bug-121.html`,
  // 中兴新云，申能项目
  bugUrlSN: `${baseUrlLocal}project-bug-122.html`,
  // 中兴新云，产品-工时系统2020
  bugUrlGSXT: `${baseUrlLocal}project-bug-123.html`,
  // 中兴新云，产品-采购商城
  bugUrlMALL: `${baseUrlLocal}project-bug-127.html`,
  // 中兴新云，产品-多语言
  bugUrlLanguage: `${baseUrlLocal}project-bug-129.html`,
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