# 企业微信机器人

- 统计禅道bug，获取bug数
- 调用企业微信群聊机器人，发送消息

- 运行前需要在src目录下创建 config.json 文件，并配置以下内容，由于里面有账号密码敏感信息，因此不放出，只提供配置项说明


```
{
  // 禅道配置信息
  "zentao": {
    "url": "http://禅道登录地址/zentao/",
    "bugPageUrl": "http://禅道BUG地址/zentao/bug-browse.html",
    "unresolvedTabPageUrl": "http://禅道未解决的bug地址/zentao/bug-browse-44-0-unresolved-0.html",
    "account": "禅道登录账号",
    "password": "禅道登录密码"
  },
  // 企业微信配置信息
  "qyweixin": {
    "robotKey": "群聊机器人Key",
    "robotKeyProduct": "群聊机器人Key",
    "robotKeyTest": "群聊机器人Key",
    "employees": ["S:孙XX", "Q:秦XX", "H:黄XX", "W:吴XX", "X:熊XX", "Z:詹XX"],
    "rdEmployees": ["部门员工a", "部门员工b", "部门员工c", "部门员工..."]
  }
}
```