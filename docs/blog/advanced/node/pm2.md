---
title: 'pm2基本介绍'
sidebar: auto
collapsable: true
---

## 简介
PM2是node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用比较简单。
## 全局安装
`sudo npm install pm2@latest -g`

## 用法
+ 启用应用: pm2 start app.js
+ 停止：pm2 stop app_name|app_id
+ 删除：pm2 delete app_name|app_id
+ 重启：pm2 restart app_name|app_id
+ 停止所有：pm2 stop all
+ 查看所有的进程：pm2 list
+ 查看所有的进程状态：pm2 status
+ 查看某一个进程的信息：pm2 describe app_name|app_id

## 参数说明
+ --watch：监听应用目录源码的变化，一旦发生变化，自动重启。如果要精确监听、不见听的目录，最好通过配置文件
+ -i --instances：启用多少个实例，可用于负载均衡。如果-i 0或者-i max，则根据当前机器核数确定实例数目，可以弥补node.js缺陷
+ --ignore-watch：排除监听的目录/文件，可以是特定的文件名，也可以是正则。比如--ignore-watch="test node_modules "some scripts" 
+ -n --name：应用的名称。查看应用信息的时候可以用到
+ -o --output <path>：标准输出日志文件的路径，有默认路径
+ -e --error <path>：错误输出日志文件的路径，有默认路径
+ --interpreter <interpreter>：the interpreter pm2 should use for 
+ executing app (bash, python...)。比如你用的coffee script来编写应用
完整参数命令： pm2 start index.js --watch -i 2

## 配置文件
配置文件里的设置项，跟命令行参数基本是一一对应的
配置文件的格式可以为json/yaml
json格式的配置文件，pm2当作普通的js文件来处理，所以可以在里面添加注释或者编写代码，这对于动态调整配置很有好处
如果启动的时候指定了配置文件，那么命令行参数会被忽略（个别参数除外，比如--env）

### 完整参数单个app配置：
```
{
  "name"             : "node-app", //启动app名称
  "cwd"              : "/srv/node-app/current", 
  "args"             : ["--toto=heya coco", "-d", "1"],
  "script"           : "bin/app.js",
  "node_args"        : ["--harmony", " --max-stack-size=102400000"],
  "log_date_format"  : "YYYY-MM-DD HH:mm Z",
  "error_file"       : "/var/log/node-app/node-app.stderr.log",
  "out_file"         : "log/node-app.stdout.log",
  "pid_file"         : "pids/node-geo-api.pid",
  "instances"        : 6, //or 0 => 'max'
  "min_uptime"       : "200s", // 200 seconds, defaults to 1000
  "max_restarts"     : 10, // defaults to 15
  "max_memory_restart": "1M", // 1 megabytes, e.g.: "2G", "10M", "100K", 1024 the default unit is byte.
  "cron_restart"     : "1 0 * * *",
  "watch"            : false,
  "ignore_watch"      : ["[\\/\\\\]\\./", "node_modules"],
  "merge_logs"       : true,
  "exec_interpreter" : "node",
  "exec_mode"        : "fork",
  "autorestart"      : false, // enable/disable automatic restart when an app crashes or exits
  "vizion"           : false, // enable/disable vizion features (versioning control)
  // Default environment variables that will be injected in any environment and at any start
  "env": {
    "NODE_ENV": "production",
    "AWESOME_SERVICE_API_TOKEN": "xxx"
  }
  "env_*" : {
    "SPECIFIC_ENV" : true
  }
}
```

## 完整配置文件写法：
```
{
  "apps" : [{
    // Application #1
    "name"        : "worker-app",
    "script"      : "worker.js",
    "args"        : ["--toto=heya coco", "-d", "1"],
    "watch"       : true,
    "node_args"   : "--harmony",
    "merge_logs"  : true,
    "cwd"         : "/this/is/a/path/to/start/script",
    "env": {
      "NODE_ENV": "development",
      "AWESOME_SERVICE_API_TOKEN": "xxx"
    },
    "env_production" : {
       "NODE_ENV": "production"
    },
    "env_staging" : {
       "NODE_ENV" : "staging",
       "TEST"     : true
    }
  },{
    // Application #2
    "name"       : "api-app",
    "script"     : "api.js",
    "instances"  : 4,
    "exec_mode"  : "cluster_mode",
    "error_file" : "./examples/child-err.log",
    "out_file"   : "./examples/child-out.log",
    "pid_file"   : "./examples/child.pid"
  }]
}
```

## 通过yaml管理多个应用
```
process.yml:
apps:
  - script   : app.js
    instances: 4
    exec_mode: cluster
  - script : worker.js
    watch  : true
    env    :
      NODE_ENV: development
    env_production:
      NODE_ENV: production

启动：pm2 start process.yml
```

## 环境切换
正式开发中分为不同的环境(开发环境、测试环境、生产环境)，我们需要根据不同的情景来切换各种环境
pm2通过在配置文件中通过env_xx来声明不同环境的配置，然后在启动应用时，通过--env参数指定运行的环境
环境配置定义，在应用中，可以通过process.env.REMOTE_ADDR等来读取配置中生命的变量：

```
"env": {
    "NODE_ENV": "production",
    "REMOTE_ADDR": "http://www.example.com/"
  },
  "env_dev": {
    "NODE_ENV": "development",
    "REMOTE_ADDR": "http://wdev.example.com/"
  },
  "env_test": {
    "NODE_ENV": "test",
    "REMOTE_ADDR": "http://wtest.example.com/"
  }
启动指定的环境：pm2 start app.js --env development
```

## 负载均衡
pm2 start app.js -i 3 # 开启三个进程
pm2 start app.js -i max # 根据机器CPU核数，开启对应数目的进程 
## 开机自动启动
1. 通过pm2 save保存当前进程状态。
2. 通过pm2 startup [platform]生成开机自启动的命令。例如：pm2 startup centeros
3. 将步骤2生成的命令，粘贴到控制台进行，搞定。
## 更新
安装最新的：npm install pm2@latest -g
然后在内存中更新：pm2 update

## 参考
+ 官方文档1：[http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
+ 官方文档2：[http://pm2.keymetrics.io/docs/usage/quick-start/](http://pm2.keymetrics.io/docs/usage/quick-start/)
+ PM2实用入门指南：[http://www.cnblogs.com/chyingp/p/pm2-documentation.html](http://www.cnblogs.com/chyingp/p/pm2-documentation.html)