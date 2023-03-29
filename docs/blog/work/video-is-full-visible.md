---
title: 'Video视频自动播放兼容代码参考'
sidebar: auto
collapsable: true
---

### 移动端 视频自动播放&判断是否完全可见

```js
// 页面资源即将加载完触发视频播放
const videoList = document.getElementsByTagName('video');
const videoPosterList = document.getElementsByClassName('video-poster');
function myVideoPlayer(obj, index) {
  let videoObj = obj
  if(videoObj) {
    videoObj.addEventListener('loadedmetadata', function() {
      videoPosterList[index].style.height = videoObj.clientHeight + 'px';
    }, false)
    videoObj.addEventListener('ended', function() {
      videoPosterList[index].style.display = 'block'
    }, false)
    if(isWeiXin()) {
      const isIOS = /iPhone|iPad/i.test(window.navigator.userAgent);
      if(typeof WeixinJSBridge === 'undefined') {
        document.addEventListener("WeixinJSBridgeReady", function () {
          // 页面初始化才走模拟点击逻辑
          if(isVideoAutoplay) {
            videoObj.addEventListener('click', function() {
              if(videoObj.currentTime === 0) {
                videoObj.play()
                videoPosterList[index].style.display = 'none'
              }
            }, false)
            videoObj.click()
          } else {
            if (isIOS) {
              videoObj.play()
              setTimeout(function() {
                videoObj.pause()
              }, 500);
            }
            const curPoster = videoPosterList[index];
            curPoster.addEventListener('click', function() {
              videoObj.muted = false
              videoObj.play()
              curPoster.style.display = 'none'
            }, false)
          }
        }, false)
      } else {
        // 页面初始化才走模拟点击逻辑
        if(isVideoAutoplay) {
          videoObj.addEventListener('click', function() {
            if(videoObj.currentTime === 0) {
              videoObj.play()
              videoPosterList[index].style.display = 'none'
            }
          }, false)
          videoObj.click()
        } else {
          if (isIOS) {
            videoObj.play()
            setTimeout(function() {
              videoObj.pause()
            }, 500);
          }
          const curPoster = videoPosterList[index];
          curPoster.addEventListener('click', function() {
            videoObj.muted = false
            videoObj.play()
            curPoster.style.display = 'none'
          }, false)
        }
      }
    } else {
      if(isVideoAutoplay) {
        videoObj.addEventListener('canplay', function() {
          videoPosterList[index].style.display = 'none'
          videoObj.play()
        }, false)
      } else {
        const curPoster = videoPosterList[index];
        curPoster.addEventListener('click', function() {
          videoPosterList[index].style.display = 'none'
          videoObj.muted = false
          videoObj.play()
        }, false)
      }
    }
  }
}
    
// 微信环境页面初始化时走模拟点击逻辑（实现视频自动播放）
function wechatClickMock(videoObj) {
  if(isVideoAutoplay) {
    videoObj.addEventListener('click', function() {
      if(videoObj.currentTime === 0) videoObj.play()
    })
    videoObj.click()
  } else {
    // 部分iOS机型  手动播放封面不消失问题兼容
    if(/iPhone|iPad/i.test(navigator.userAgent)) {
      const poster = videoObj.getAttribute('poster')
      videoObj.addEventListener('click', function() {
        if(videoObj.currentTime === 0) {
          videoObj.setAttribute('poster', '')
          videoObj.play()
          videoObj.setAttribute('poster', poster)
        }
      })
    }
  }
}

// 页面有多个视频情况，同时最多播放一个
for (let i = videoList.length - 1; i >= 0; i--) {
  (function() {
    myVideoPlayer(videoList[i], i);
    videoList[i].addEventListener('play',function(){
      clickPauseOthers(i)
    })
  })()
}

// 监听页面正在播放的视频，让其余视频暂停播放
function clickPauseOthers(index) {
  for (let j = videoList.length - 1; j >= 0; j--) {
    if (j !== index) videoList[j].pause();
  }
}

// 暂停正在播放的视频
function clickPauseAll() {
  if (videoList.length === 0) return
  for (let j = videoList.length - 1; j >= 0; j--) {
    if (j === curPlayVideoIndex) videoList[j].pause();
  }
}

function scrollFnForVideo() {
  const timeOut = null
  return function() {
    clearTimeout(timeOut)
    timeOut = setTimeout(function() {
      judgeVideoIsVisible()
    }, 300)
  }
}

// 判断视频是否完全在视野内
function judgeVideoIsVisible() {
  for (let i = 0, len = videoList.length; i <= len - 1; i++) {
    if(videoList[i]) {
      let videoRectBottom = parseInt(videoList[i].getBoundingClientRect().bottom, 10);
      let availHeight = window.screen.availHeight;
      let offsetHeight = videoList[i].offsetHeight;
      // 视频完全移出屏幕（排除视频部分在屏幕内情况） - 暂停播放
      if(videoRectBottom <= 0 && !(videoRectBottom > 0 && (videoRectBottom < offsetHeight))) {
        videoList[i].pause();
        if(videoList.length === 1) break
        if(videoList.length > 1) continue
      }
      
      // 视频完全移出屏幕（向下滑情况） - 暂停播放
      if(videoRectBottom + 5 >= offsetHeight + availHeight) {
        videoList[i].pause();
        if(videoList.length === 1) break
        if(videoList.length > 1) continue
      }
        
      // 视频完全进入屏幕 - 执行播放
      if(videoRectBottom <= availHeight && !(videoRectBottom < offsetHeight)) {
        curPlayVideoIndex = i;
        if(isVideoAutoplay) {
          videoPosterList[i].style.display = 'none'
          videoList[i].play()
        }
      }
    }
  }
}
    
if(videoList.length > 0) {
  // 监听页面滚动 判断视频是否完全进入 或 完全移出屏幕
  window.addEventListener('scroll', scrollFnForVideo(), false)
}
```