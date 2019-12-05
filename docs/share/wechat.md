---
title: '微信公众号开发总结'
sidebar: auto
collapsable: true
---
# 前端性能优化实战分享

过去一段时间我参与了微信公众号的开发，遇到各种问题，总结一下，主要涉及微信jssdk（难点在于微信签名，签名后才能使用jssdk）、微信网页授权获取用户信息、微信公众账号支付这三个部分。

## 微信jssdk的使用
由于要使用微信jssdk需要在微信公众账号里边配置微信js安全域名，我们需要进入订阅号的开发者工具=》公众平台测试账号=》按照步骤扫二维码进入以下页面
配置js接口安全域名（注意必须是外网可以访问的域名，测试号也可以是ip地址）
因为使用微信jssdk需要签名，签名必须要后端支持，作为一名不会写后台代码的前端开发者来说，自己想测试一下jssdk的功能也是有办法可寻的（如果有后端人员愿意支持你，给你提供签名的接口也是可以的）。
我来讲讲我初步学习使用jssdk的方式。
1.在微信开发者文档
https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115&token=&lang=zh_CN
底部提供的链接
http://demo.open.weixin.qq.com/jssdk/sample.zip
下载实例代码，其中包含php、java、nodejs以及python的示例代码；我使用的是php的代码因为搭建服务比较简单，'修改sample.php页面，将测试号的appid\appsecret写到代码对应的位置，然后将要测试的代码房子wx.ready(function(){})里边就可以了。

## 微信网页授权，获取用户信息
在公众账号中配置授权回调域名
通过微信的授权url，配置appid\回调url，授权后会跳转到回调url,回调的url上微信会自动加上一个code码，然后将code码传给后端，后端用code获取到openid（不通的授权方式获取的用户信息权限不一样）或其他用户信息返回给前端，授权成功

## 微信支付
申请微信公众账号支付，申请成功之后，配置支付授权目录（建议直接使用支付授权目录，不通过测试目录开发），支付授权目录要求如下（虽要求进去匹配，但实际开发过程中，支付页面是/cart/payment，但是只有配置/cart才生效，不知道为什么）

将openid传给后端，后端返回timestamp、nonceStr、package、paySign信息，然后再前端调用一下jssdk(按文档要求需要签名后再调用，但实际测试签名失败调用此sdk也能成功)
wx.chooseWXPay({
timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付 后台生成签名使用的timeStamp字段名需大写其中的S字符
nonceStr: '', // 支付签名随机串，不长于 32 位
package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
paySign: '', // 支付签名
success: function (res) {
// 支付成功后的回调函数
},
cancle:function(res){
//取消支付的回调函数
},
fail:function(res){
//支付失败的回调函数
}
});