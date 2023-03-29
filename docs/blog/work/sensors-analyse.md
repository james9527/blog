---
title: '神策数据分析简介及其应用'
sidebar: auto
collapsable: true
---

# 神策数据分析简介及其应用

## Part1 神策分析简介
神策分析，是针对企业级客户推出的深度用户行为分析产品，支持私有化部署，客户端、服务器、业务数据、第三方数据的全端采集和建模，驱动营销渠道效果评估、用户精细化运营改进、产品功能及用户体验优化、老板看板辅助管理决策、产品个性化推荐改造、用户标签体系构建等应用场景。作为 PaaS 平台支持二次开发，可通过 BI、大数据平台、CRM、ERP 等内部 IT 系统，构建用户数据体系，让用户行为数据发挥深远的价值。[更多](https://manual.sensorsdata.cn/sa/latest/%E7%A5%9E%E7%AD%96%E5%88%86%E6%9E%90%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F-22249853.html)

## Part2 行为分析常用名词

### 维度
维度描述的是一个事物身上所具备的特征或属性。比如一个人属于什么性别，生活在哪个城市，喜欢什么颜色，这些都是这个人身上所具备的属性特征。在网站分析领域，维度往往用来描述和分析指标，比如单一的访问数指标并不能告诉你太多信息，一旦加上来源这个维度，就马上变得有意义了。


### 指标
指标，即具体的数值。比如访客、页面浏览量、停留时长都属于常见的指标。一般可分为计数指标和复合指标。计数指标如访客、访问、页面浏览量、停留时长等；复合指标如跳出率、交互深度、转化率等。指标一般伴随维度来分析才有更大的意义。


### 访客
通俗解释为访问网站或 App 的人。前面加上 Unique 后，即我们平常说的 UV，唯一身份访客。对于数据统计工具而言，一般用匿名 ID 来标记访问者，网页端产品是 Cookie（网站服务器投放在用户浏览器上的一小段文本），App 端产品是设备 ID。


### 页面浏览量
指页面被用户浏览的次数，严格定义上指的是用户向网站发出并完成的一个下载页面的请求，即PageView（简称PV）。

页面浏览的概念主要适用于网页端产品，对于 App 的分析，现主要使用屏幕浏览，即 ScreenView。


### 停留时长
对应于用户 Session，便有了停留时长指标，主要用来衡量用户与网站、App 交互的深度。交互越深，相应停留的时长也越长。

一般有页面停留时长，会话时长以及平均停留时长等概念，其计算的核心原理在于记录下用户行为发生时的时间戳，后期再应用相应公式来计算。


### 跳出率
一个衡量落地页质量好坏的重要指标。跳出的概念是指用户在一次访问中仅做了一次互动便选择了离开，单一页面和全站均有跳出率的概念。页面跳出率为该页面跳出的访问次数占该页面总访问次数的百分比。全站跳出率则为跳出的访问次数除以总的访问次数。


### 转化率
任何产品都需要关注的核心指标，主要用来衡量用户从流量到发生实际目标转化的能力。一般用目标转化的次数或人数除以进入目标转化漏斗的人数或次数，因目标行为的不同，转化率是一个非常灵活的指标，比如你可以自定义注册转化率、登录转化率、购买转化率、搜索成功转化率等。


### 交互深度
交互深度是指用户在一次浏览网站或 App 过程中，访问了多少页面。用户在一次浏览中访问的页面越多，交互深度就越深。交互深度能够侧面反映网站或 App 对于用户的吸引力。
可以通过 Session 来计算用户的平均交互深度。


### 总次数指标
事件分析功能常用指标，指在选定的时间范围内，某一事件被触发的次数。
比如选择页面浏览事件，按总次数查看时，计算出来的值即为页面浏览量。


### 触发用户数指标
事件分析功能常用指标，指在选定的时间范围内，触发某一事件的独立用户数。
比如选择注册成功事件，按独立用户数查看时，计算出来的值即为选择时间范围内的注册成功人数。


### 人均次数指标
事件分析功能常用指标，指在选定的时间范围内，独立用户触发某一事件的平均次数。
比如选择页面浏览事件，按人均次数查看时，计算出来的值即为人均页面浏览次数。


## Part3 埋点代码常规配置

### 神策全埋点
```js
// 注册公共属性
let sensorsProps = {
  current_url: location.href,
  referrer: document.referrer,
  platform_type: 'H5'
};
sensors.registerPage(sensorsProps);
//调用代码之后，SDK 就会自动收集页面浏览事件
sensors.quick('autoTrack');
```

### 神策埋点登录态

```js
// 神策埋点登录态
if (sensors) {
  sensors.quick("isReady", function() {
    sensors.login(rs.data.openId);
    sensors.setProfile({
      email: rs.data.email,
      displayName: rs.data.displayName,
      gender: rs.data.gender,
      creator_name: rs.data.displayName,
      creator_id: rs.data.openId
    });
  });
}
```

### 按钮点击埋点（示例）
```js
clickPostTrack() {
  // let page_name = "首页-" + document.querySelector(".CF_tab .van-tab--active > span").textContent;
  let page_name = "首页";
  sensors.track("clickPost", {
    page_name: page_name,
  });
},
```

```js
// 加入圈子埋点
clickJoinSociety() {
  let page_name = "";
  if (document.querySelector(".CF_tab .van-tab--active > span")) {
    page_name =
      "首页-" +
      document.querySelector(".CF_tab .van-tab--active > span").textContent;
  }
  sensors.track("joinSociety", {
    page_name: page_name + "资源位",
    module_name: "首页",
    society_type: this.circleObj.groupTypeName,
    society_id: this.circleObj.relationId,
    society_name: this.circleObj.groupNickname,
    enter_time: dateTimeFormat(+new Date(), "YYYY-MM-DD HH:mm:ss"),
  });
},
```

#### >>查询SK社区发帖按钮点击次数示例
![SK社区发帖按钮点击](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/WechatIMG61.png)


## Part4 查看神策上报日志
1. 第一步，在chrome浏览器的「开发者工具」之「Network」工具栏下，可筛选出`sa.gif`请求进行日志分析，完整复制出请求参数里data的值（加密日志），操作步骤如下：
![chrome浏览器复制神策日志](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/A4536A30-D7F8-49B6-AB53-7186068A78EB.png)

2. 第二步，将拷贝出来的加密日志粘贴到[神策官方提供的解码工具](https://www.sensorsdata.cn/tools/decode.html)左侧区域，点击左上角「JS数据解码」按钮，即可将解码后的神策上报日志信息展示在右侧区域，操作步骤如下：
![神策日志解码截图](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/550B050E-48AA-454D-901C-E6B566BFE43E.png)


## Part5 Session分析及其应用
>第一次进行 Session 分析之前，首先需要在“元数据”的“Session管理”里创建 Session。这里对 Session 的相关概念进行说明：

在 a 处选择已经创建的 Session。在 b 处选择此 Session 中的事件，选择“Session总体”可以对 Session 整体情况进行分析。在 b 处选择事件，则 c 中对应的指标也会发生变化。在 c 中选择具体指标，除一些通用指标外，还包含 b 处所选事件的属性的指标。d 处圈红的是 “Session 属性”，每个 Session 内首次触发事件的属性的并集。下边对几个主要概念进行说明：

1. 跳出率： Session 中只发生一个事件的 Session 个数除以总 Session 数。比如有三个 Session，第一个 Session 事件序列为 A,B；第二个 Session 事件序列为 A；第三个 Session 事件序列为 A,C,B；则 Session 总体的跳出率为 1/3。
2. 退出率： Session 的退出率包括 Session 中某个事件的退出率 和 Session中任意事件的退出率。某个事件的退出率指该事件作为 Session 的结束事件的次数除以该事件发生次数，任意事件退出率指 Session 数除以 Session 中所有事件发生次数。比如有三个 Session，第一个 Session 事件序列为A,B；第二个 Session 事件序列为A；第三个 Session 事件序列为A,C,A；则 Session 中A事件的退出率为 2/4, 任意事件的退出率为 3/6。
3. Session 时长： Session 内最后一个事件触发的时间减去 Session 内第一个事件触发的时间。
4. Session 深度： Session 内触发事件的次数。
5. Session 内事件时长： 假如某 Session 内事件触发顺序为 a > b > c > d，则事件 a 的时长为 b 减去 a，事件 d 的时长未知。
6. Session 初始事件： Session 内第一次触发的事件。
7. Session 属性： d 处的 Session 属性是指一个 Session 中初始事件的属性。比如一个 Session 的事件序列为 A,B,C；A 事件的操作系统为 iOS，B 事件的操作系统为 Android，C 事件的操作系统为空，则这个 Session 中的 Session 属性操作系统应该是 iOS，是第一个事件对应的操作系统属性值。

### 创建Session示例
![创建Session示例](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/23DF9C1A-BD2C-4123-B741-7515F3AD9149.png)

### 合理定义Session切割时间
Web 页面浏览事件Session合理的切割时间可设置为 30 分钟（经验值），场景：用户A吃午饭前浏览了SK社区页面10min，中午吃个午饭花了30min，随后又在饭后时间再次浏览了一会SK社区页面。一个用户在一天内可能多次浏览一个网站，于是就有必要在一个Session时间后重新计数。

### 查看用户访问页面深度
> 定义：等于所有 Session 内事件数之和除以总的 Session 数。

交互深度是指用户在一次浏览网站或 App 过程中，访问了多少页面。于是可以在“行为事件分析”功能中，选择「Session总体」下「Session深度」的「均值」指标进行过滤，官方示例：
![平均交互深度](https://manual.sensorsdata.cn/sa/files/2.0/7548706/7548744/1/1590132633000/image2020-5-22_15-30-32.png)


## Part6 基础指标查询举例
> 背景：VW和SK前端项目分别使用了相同的project，因此查询指标数据时有必要添加「页面地址」事件属性，且包含「页面根地址」或「域名」去筛选对应项目（Web站点）的数据。

### 1. 查看每日的 PV 和 UV 
+ 网页端，可使用全埋点事件 Web页面浏览事件查看 PV、UV（ Web页面浏览事件的采集时机是在开启全埋点的情况下，打开页面时，即会采集一个 Web页面浏览事件）
+ App端，可使用神策的全埋点事件 App 启动事件查看每日的PV、UV（App 启动事件的触发时机为在开启全埋点的情况下，每次打开 App 或者从后台唤醒 App 时，都会触发一次 App 启动事件）

#### 查看SK新社区PV数
> 定义：网页浏览是指浏览器加载（或重新加载）网页的实例。页面浏览量可以定义为网页浏览总次数的指标。

![SK新社区PV数](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/8754E020-FB66-4D77-9236-8F06E1108D74.png)

#### 查看SK新社区UV数
> 定义：1 天（00:00-24:00）之内，访问网站的不重复用户数，一天内同一访客多次访问网站只被计算 1 次。

![SK新社区UV数](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/E9F18CC9-B636-4A89-A713-EA5DD33FC66D.png)

#### >>查看某个用户PV数
> 日志中的 distinct_id 字段，即为神策标识用户 ID 的字段。在我们业务中，刚完成注册或刚登录场景，此 distinct_id 指的是openid（也称作idpid），否则 distinct_id 是一个神策为用户分配的匿名ID

+ 查询某个用户某一时间段页面浏览总次数示例
![查询某个用户某一时间段页面浏览总次数示例](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/211E697D-7B12-4D76-AA7D-13A79164E36B.png)

+ 多个指标联合查询示例
![多个指标联合查询示例](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/69FF5A8B-AD26-44B0-8E9C-EBA9B7004D6B.png)

### 2. 查看页面停留时长
神策预置的 Web 页面浏览／App 页面浏览／小程序页面浏览事件，默认是不采集每个页面的浏览时长。如果想分析每个页面的浏览时长，有两个办法：

1. 客户需要自定义埋点采集每个页面浏览时长属性，这样计算的结果更精确，但是埋点比较耗时。
2. 使用 Session 分析，通过 Session 的定义，大致计算出每个页面的浏览时长（大致的含义是 session 定义不同，每个事件的时长计算结果也可能不同），然后再分析时长相关的指标。下面以 Session 分析，介绍如何分析 Web 端页面浏览时长。（App 端和小程序端的分析类似，Session 包含的事件需要换成 App 页面浏览/小程序页面浏览事件）

#### >>查看页面停留时长示例

![查看Web视区停留即页面平均访问时长](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/F07F7E0A-32EF-48DF-A8C0-5C211230492B.png)


### 3. 电商场景创建购买转化漏斗
> 可以假设这样一种场景，用户从看到某一个促销活动到最终购买，可能会经历这样一个过程“浏览活动页—浏览商品列表页—浏览商品详情页—加入购物车—提交订单—支付订单”，我们可以对这样一个过程建立一个购买转化漏斗，来帮助你分析一个多步骤过程中每一步的转化与流失情况。

![电商场景创建购买转化漏斗](https://www.sensorsdata.cn/manual/img/config_basic_target_27.png)


## Part7 神策官方文档

### 神策分析2.0部分官方文档
> 生产环境部署的神策后台版本是2.0.x，因此建议查阅神策官方文档时，匹配对应的系统版本会更准确。

[神策产品使用指南](https://manual.sensorsdata.cn/sa/2.0/%E4%BA%A7%E5%93%81%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97-1573393.html)

[基础指标配置说明](https://manual.sensorsdata.cn/sa/2.0/%E5%9F%BA%E7%A1%80%E6%8C%87%E6%A0%87%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E-7548706.html)

[《如何应用 Sensors Analytics 进行 Session 分析》](https://www.sensorsdata.cn/blog/ru-he-ying-yong-sensors-analytics-jin-xing-session-fen-xi/)

[行业实践 - 功能应用示例](https://manual.sensorsdata.cn/sa/2.0/%E5%8A%9F%E8%83%BD%E5%BA%94%E7%94%A8%E7%A4%BA%E4%BE%8B-7536938.html)


### 神策官方Demo

[神策官方Demo](https://family.demo.sensorsdata.cn/dashboard/?project=EbizDemo&product=sbp_family&id=421&dash_type=lego)



### 神策技术指南
#### 如何准确的标识用户
> 用户在完成注册或登录前，神策会为用户分配一个匿名 ID 来标识用户，将该匿名 ID 作为 distinct_id 来记录用户的事件数据。当用户完成注册或登录之后，通过调用神策接口尝试进行用户关联。在关联成功的情况下，匿名 ID 和该登录 ID 发生的所有行为都会被认为是同一个用户实体发生的，在进行事件、漏斗、留存等用户相关的分析时会算作是一个用户。

##### 匿名ID生成规则
+ web端：默认情况下使用 cookie_id 作为匿名 ID。
+ 小程序端：默认情况下使用 UUID 作为匿名 ID，但是删除小程序，UUID 会变。为了保证匿名 ID 不变，建议通过获取 open_id 作为匿名 ID。
如果选择使用open_id作为匿名ID的话，请注意【操作暂存】，由于获取 openid 是一个异步的操作，但是冷启动事件等会先发生，这时候这个冷启动事件的 distinct_id 就不对了。所以我们会把先发生的操作，暂存起来，等获取到 openid 等后调用 sa.init() 后才会发送数据。 open_id 的获取和操作暂存的方法请参考下述文档。

##### 用户关联具体步骤
+ JavaScript SDK 获取 Cookie 中的 distinct_id ，可以通过 sensors.store.getDistinctId() 方法获取。
+ 安卓 SDK：通过 getAnonymousId 方法 获取神策分析 SDK 分配的 匿名 ID，String AnonymousId=SensorsDataAPI.sharedInstance().getAnonymousId();
+ iOS SDK：通过 anonymousId 方法可获取神策分析 iOS SDK 分配的 匿名 ID，获取当前用户的匿名id NSString *anonymousId = [[SensorsAnalyticsSDK sharedInstance] anonymousId];（swift 代码示例：let anonymousId:String = SensorsAnalyticsSDK.sharedInstance().anonymousId()）。

##### 延伸：>>从Cookie中查看distinct_id
![从Cookie中提取distinct_id](https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/test/2022/BF66C947-8943-47F3-A509-8CC95385492C.png)


## Part8 浅谈神策Web SDK
> 从`sd.store.init()`开始探究神策Web SDK源码，简单了解下它是如何写入`sensorsdata2015jssdkcross`cookie的，以及如何操作`distinct_id`，附上SDK部分源码（sa-sdk-javascript/product/sensorsdata.full.js）

```js
  var store = {
    requests: [],
    _sessionState: {},
    _state: {
      distinct_id: '',
      first_id: '',
      props: {}
    },
    getProps: function() {
      return this._state.props || {};
    },
    getSessionProps: function() {
      return this._sessionState;
    },
    getDistinctId: function() {
      return this._state._distinct_id || this._state.distinct_id;
    },
    getUnionId: function() {
      var obj = {};
      var firstId = this._state._first_id || this._state.first_id,
        distinct_id = this._state._distinct_id || this._state.distinct_id;
      if (firstId && distinct_id) {
        obj.login_id = distinct_id;
        obj.anonymous_id = firstId;
      } else {
        obj.anonymous_id = distinct_id;
      }
      return obj;
    },
    getFirstId: function() {
      return this._state._first_id || this._state.first_id;
    },
    getCookieName: function() {
      var sub = '';
      if (sd.para.cross_subdomain === false) {
        try {
          sub = _.URL(location.href).hostname;
        } catch (e) {
          sd.log(e);
        }
        if (typeof sub === 'string' && sub !== '') {
          sub = 'sa_jssdk_2015_' + sub.replace(/\./g, '_');
        } else {
          sub = 'sa_jssdk_2015_root';
        }
      } else {
        sub = 'sensorsdata2015jssdkcross';
      }
      return sub;
    },
    init: function() {
      this.initSessionState();
      var uuid = _.UUID();
      var cross = _.cookie.get(this.getCookieName());
      cross = _.cookie.resolveValue(cross);
      if (cross === null) {
        sd.is_first_visitor = true;

        this.set('distinct_id', uuid);
      } else {
        if (!_.isJSONString(cross) || !JSON.parse(cross).distinct_id) {
          sd.is_first_visitor = true;
        }

        this.toState(cross);
      }

      saNewUser.setDeviceId(uuid);

      saNewUser.storeInitCheck();
      saNewUser.checkIsFirstLatest();
    }
  };
```

```js
var saNewUser = {
   setDeviceId: function(uuid) {
      var device_id = null;
      var ds = _.cookie.get('sensorsdata2015jssdkcross');
      ds = _.cookie.resolveValue(ds);
      var state = {};
      if (ds != null && _.isJSONString(ds)) {
        state = JSON.parse(ds);
        if (state.$device_id) {
          device_id = state.$device_id;
        }
      }

      device_id = device_id || uuid;

      if (sd.para.cross_subdomain === true) {
        store.set('$device_id', device_id);
      } else {
        state.$device_id = device_id;
        state = JSON.stringify(state);
        if (sd.para.encrypt_cookie) {
          state = _.cookie.encrypt(state);
        }
        _.cookie.set('sensorsdata2015jssdkcross', state, null, true);
      }

      if (sd.para.is_track_device_id) {
        _.info.currentProps.$device_id = device_id;
      }
    },
}
```

```js
  sd.login = function(id, callback) {
    if (typeof id === 'number') {
      id = String(id);
    }
    if (saEvent.check({
        distinct_id: id
      })) {
      var firstId = store.getFirstId();
      var distinctId = store.getDistinctId();
      if (id !== distinctId) {
        if (!firstId) {
          store.set('first_id', distinctId);
        }
        sd.trackSignup(id, '$SignUp', {}, callback);
      } else {
        callback && callback();
      }
    } else {
      sd.log('login的参数必须是字符串');
      callback && callback();
    }
  };

  sd.identify = function(id, isSave) {
    if (typeof id === 'number') {
      id = String(id);
    }
    var firstId = store.getFirstId();
    if (typeof id === 'undefined') {
      var uuid = _.UUID();
      if (firstId) {
        store.set('first_id', uuid);
      } else {
        store.set('distinct_id', uuid);
      }
    } else if (saEvent.check({
        distinct_id: id
      })) {
      if (isSave === true) {
        if (firstId) {
          store.set('first_id', id);
        } else {
          store.set('distinct_id', id);
        }
      } else {
        if (firstId) {
          store.change('first_id', id);
        } else {
          store.change('distinct_id', id);
        }
      }
    } else {
      sd.log('identify的参数必须是字符串');
    }
  };
```