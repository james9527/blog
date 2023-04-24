---
title: 'Video视频自动播放技术调研'
sidebar: auto
collapsable: true
---

## H5支持Video视频自动播放技术调研

### 实现需求如下：

1. H5落地页视频的播放和暂停，操作优先级如下：
   + 用户进入页面时，自动播放第一个视频；视频完全不在视野内时，不播放；
   + 点击【留资】或【报名】且出现留资弹窗时，点击【我的报名】出现弹窗时，点击《隐私协议》或《用户协议》进入协议内容页时——暂停播放；勾选隐私协议，不影响播放
   + 用户滑动页面，视频上/下边缘滑出屏幕时 - 暂停播放「[实现案例](./video-is-full-visible.md)」
   + 用户滑动页面，视频完整出现在屏幕中时 - 自动播放「[实现案例](./video-is-full-visible.md)」
2. 根据上传的视频宽度填充屏幕，动态调整视频的高度
3. C端需兼容微信/App/H5浏览器环境


### 浏览器内核

**主流浏览器内核**

IE： Trident

火狐： Gecko

safari： Webkit （Safari内核，Chrome内核原型）

Opera（旧）： Presto （Opera现已改用Google Chrome的Blink内核）

Google和Opera： Blink （从webkit一个分支演变而来）

**Blink**

Google计划将这个渲染引擎作为Chromium（可理解为chrome的先行版，是谷歌开源出去的）计划的一部分，这一渲染引擎是开源引擎WebKit中WebCore组件的一个分支，并且应用在在Chrome（28及往后版本）、Opera（15及往后版本）。

**WebCore**

包含了目前被各个浏览器所使用的WebKit共享部分，是加载和渲染网页的基础部分，具体包括HTML解释器、CSS解释器等。

**JavaScriptCore引擎**

是WebKit中的默认JavaScript引擎。在Google的Chromium项目中，它被替换为V8引擎。

**WebKit Ports部分**

是WebKit红的非共享部分，属于WebKit被移植的模块。由于不同浏览器使得平台差异、依赖的第三方库和需求不同，从而导致多种WebKit版本。

**国内PC浏览器**

多数浏览器的新版本是“双核”甚至是“多核”，其中一个内核是Trident，然后再增加一个其他内核。一般把其他内核叫做“高速浏览模式”，而Trident则是“兼容浏览模式”。（绝大多数基于Chromium开源软件项目开发的，Chromium不是内核）

**国内移动端**

Android：

使用率最高的就是Webkit内核，国内浏览器多数都是基于开源内核Webkit进行二次开发的。

iPhone：

由于系统封闭，不允许除系统自带浏览器内核以外的浏览器内核进入，因此各家浏览器的开发均为在Safari内核的基础上进行二次开发。

**总结：**

- WebKit是一种用来让网页浏览器绘制网页的排版引擎。

- Webkit亦使用于Apple iOS、BlackBerry Tablet OS、Tizen及Amazon Kindle的默认浏览器。

- WebKit中WebCore组件的分支——Blink被用于chrome。

- Chromium（开源出去）与Google Chrome共享大部分代码和功能，但功能和商标之间有一些细微差别。

- Chromium为Google Chrome提供了绝大多数的源代码，包括用户界面，Blink渲染引擎和V8JavaScript引擎。

- Google使用该代码（Chromium）来制作其Chrome浏览器，该浏览器比Chromium具有更多功能。

- 所有以Chromium为基础的浏览器都使用Blink。

**参考：**

[Chromium wiki](https://zh.wikipedia.org/wiki/Chromium)

[网页浏览器列表](https://zh.wikipedia.org/wiki/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8%E5%88%97%E8%A1%A8#%E5%9F%BA%E6%96%BCWebKit%E6%8E%92%E7%89%88%E5%BC%95%E6%93%8E)

[排版引擎（浏览器引擎、页面渲染引擎）](https://zh.wikipedia.org/wiki/%E6%8E%92%E7%89%88%E5%BC%95%E6%93%8E)

**综上，无论安卓还是ios在做webkit的一些特性都会得到较好的支持。**

### 场景1 - 同层播放

在移动端浏览器，video 在用户点击播放或者通过API video.play() 触发播放时，会强制以全屏置顶的形式进行播放。但是有些时候这并不符合我们的期待。网上找资料很多，但质量真的是不敢恭维。千篇一律不说，而且还不正确。

#### playsInline={true}

该属性为true可以取消全屏，实现同层播放，网上资料大多数都是`playsinline`实际上在ios10+该写法是不会生效的，而应是驼峰命名的方式。

详情请参照：

[apple developer](https://developer.apple.com/documentation/webkitjs/htmlvideoelement)

[webkit对video的支持特性](https://html.spec.whatwg.org/#the-video-element)

```
<video
  playsInline={true}
/>

```


**特例：**

`playsInline={true}` 能满足大多数业务场景，但是在微信内表现有所不同，微信是采用了内部集成的x5内核（同样是x5但是qq内部和qq浏览器都默认是同层播放表现很奇怪）。

x5内核（基于webkit深度定制）额外提供了同侧播放的属性。`x5-video-player-type="h5-page"`。网络提供多数是`x5-video-player-type="h5"`已经不符合新版本处理方式。

[x5内核官方文档](https://docs.qq.com/doc/DTUxGdWZic0RLR29B)

**国内浏览器**

而国内常见的PC浏览器如UC浏览器、QQ浏览器、百度手机浏览器、360安全浏览器、谷歌浏览器、搜狗手机浏览器、猎豹浏览器以及移动端的UC、QQ、百度等手机浏览器都是根据Webkit修改过来的内核，本质上我们可以认为市场上移动端用户使用的基本上都是webkit内核或者基于 webkit 内核做修改的浏览器，所以 playsinline 的兼容性非常好！


### 场景2 - 自动播放

**为什么禁止自动播放**
> Chrome在66版本后为了避免标签产生随机噪音。Chrome在18年4月做了更改，浏览器为了提高用户体验，减少数据消耗，现在都在遵循autoplay政策。

1. 自动播放会消耗大量的流量。
2. 用户体验不好，突然播放的视频，影响用户体验。

**关于h5 video的播放策略**

[chrome 自动播放策略](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes)

[chromium自动播放策略](https://www.chromium.org/audio-video/autoplay)

[webkit(ios)自动播放策略](https://webkit.org/blog/6784/new-video-policies-for-ios/)

[MDN - video之autoplay](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video#attr-autoplay)

[微信开发者社区 - H5页面安卓微信环境下video不能自动播放](https://developers.weixin.qq.com/community/develop/doc/000c4e895040d8e1809ac67ad59c00)

[iOS微信环境下视频自动播放](https://zhuanlan.zhihu.com/p/42301440)

从[网页浏览器列表](https://zh.wikipedia.org/wiki/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8%E5%88%97%E8%A1%A8#%E5%9F%BA%E6%96%BCWebKit%E6%8E%92%E7%89%88%E5%BC%95%E6%93%8E)可以知道国内浏览器多数是基于chromium开发的。

- 内容是静音的，或不包括任何音频(仅包括视频)

- 用户在浏览会话期间点击了站点上的某个地方

- 在移动设备上，如果该网站已被用户添加到主屏幕

- 在桌面，如果用户经常在网站上播放媒体，根据媒体参与指数

### 解决方案

#### 通过监听点击方式触发

```html
<video controls width=100% preload autoplay muted x5-playsinline webkit-playsinline playsinline  style="object-fit: fill;" x-webkit-airplay="true" x5-video-player-type="h5-page" id="videoObj" poster="https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/marketing/public/m/assets/imgs/xinweiran-poster.png"><source src="https://svw-dev-copadmin.oss-cn-shanghai.aliyuncs.com/marketing/public/m/assets/video/svw-new-viloran.mp4" type="video/mp4">Your browser does not support the video tag.</video>
```

```js
// 页面资源即将加载完触发视频播放
const videoObj = document.querySelector('video')
videoObj.addEventListener('loadedmetadata', function() {
  console.log('视频加载完成~~')
}, false)
videoObj.addEventListener('ended', function() {
  console.log('视频播放结束~~')
}, false)
    
if(isWeiXin()) {
  if(typeof WeixinJSBridge === 'undefined') {
    document.addEventListener("WeixinJSBridgeReady", function () {
      console.log('WeixinJSBridgeReady:::')
      videoObj.addEventListener('click', function() {
        console.log('click_play111')
        videoObj.play()
      })
      videoObj.click()
    }, false)
  } else {
    videoObj.addEventListener('click', function() {
      console.log('click_play222')
      videoObj.play()
    })
    videoObj.click()
  }
} else {
  videoObj.addEventListener('canplay', function() {
    console.log('非微信环境…视频可播放了~')
    videoObj.play()
  }, false)
}
```

另一种方案，在wx.ready回调中触发视频播放也是可以的

```js
wx.config({
  // 配置信息, 即使不正确也能使用 wx.ready
  debug: false,
  appId: "",
  timestamp: 1,
  nonceStr: "",
  signature: "",
  jsApiList: []
});
wx.ready(function () {
  let video = document.getElementById(dom);
  if (video) {
    video.play();
    
  } else {
    console.log("获取视频元素失败");
  }
 
});
```


**部分机型各环境测试结果**

荣耀20Pro - 安卓(HarmonyOS)

|App|微信|华为自带浏览器|UC浏览器|qq浏览器
|:---:|:---:|:---:|:---:|:---:|
|Y|N|Y|Y|Y|

iPhone 8Plus - iOS 14.4.2

|App|微信|华为自带浏览器|UC浏览器|qq浏览器
|:---:|:---:|:---:|:---:|:---:|
|Y|Y|Y|Y|Y|

测试结果可知：该方法在安卓系统下的微信环境依然无效。

### 第三方插件（尝试）

#### video.js

[github issues - Videojs autoplay not working on android chrome](https://github.com/videojs/video.js/issues/4927)

[github issues - android autoplay](https://github.com/videojs/video.js/issues?q=android+autoplay+)

[I need autoplay only for mobile devices ?](https://github.com/videojs/video.js/issues/6244)

[video.js - autoplay](https://videojs.com/guides/options/#autoplay)

[autoplay-best-practices-with-video-js](https://blog.videojs.com/autoplay-best-practices-with-video-js/)


#### Aliplayer  autoPlay属性

[阿里视频播放关于h5适配问题](https://help.aliyun.com/document_detail/125570.html#h2-h5-3)

[播放器是否自动播放，在移动端autoplay属性会失效](https://help.aliyun.com/document_detail/125572.html)



### 总结

几波测试和各类官方文档查下来，能实现自动播放的，autoPlay能实现一小部分自动播放，通过模拟事件，可以拓展一部分浏览器兼容性自动播放。如果可以接受静音播放，能够支持较大一部分自动播放。在搭配上上微信的特殊处理可以额外拓展ios微信的自动播放。安卓微信暂时无解，无法实现自动播放。

目前测试的机器和浏览器也相对较少，后续考虑测试更多种浏览器和更多机型。


### 参考资料

[Chromium wiki](https://zh.wikipedia.org/wiki/Chromium)

[网页浏览器列表](https://zh.wikipedia.org/wiki/%E7%BD%91%E9%A1%B5%E6%B5%8F%E8%A7%88%E5%99%A8%E5%88%97%E8%A1%A8#%E5%9F%BA%E6%96%BCWebKit%E6%8E%92%E7%89%88%E5%BC%95%E6%93%8E)

[排版引擎（浏览器引擎、页面渲染引擎）](https://zh.wikipedia.org/wiki/%E6%8E%92%E7%89%88%E5%BC%95%E6%93%8E)


[webkit官网](https://webkit.org/)

[apple developer](https://developer.apple.com/documentation/webkitjs/htmlvideoelement)

[x5内核官方对接文档](https://docs.qq.com/doc/DTUxGdWZic0RLR29B)
