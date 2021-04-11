---
title: 'position之sticky属性兼容性'
sidebar: auto
collapsable: true
---

## 简介
sticky 英文字面意思是粘，粘贴，所以称之为粘性定位。sticky属性依赖于用户的滚动，在 position:relative 与 position:fixed 定位之间切换。元素定位表现为在跨越特定阈值前为相对定位，之后为固定定位。这个特定阈值指的是 top, right, bottom 或 left 之一，即指定 top, right, bottom 或 left 四个阈值其中之一，才可使粘性定位生效。
## 使用条件
> sticky属性仅在以下几个条件都满足时有效：

父元素不能overflow:hidden或者overflow:auto属性，或者 当body的height为100%时，必须指定top、bottom、left、right4个值之一，否则只会处于相对定位，最终达不到你想要的效果，导致页面错乱。并且，父元素的高度不能低于sticky元素的高度。

本人在开发过程中，遇见一个难以置信的问题，样式top属性写了`0px`导致仅在vivo手机出现页面样式错乱问题。

```
<template>
    <div class="sticky" :style="{top: this.top, zIndex: this.zIndex}">
      <slot></slot>
    </div>
</template>
<script>
    import _throttle from "lodash.throttle";
    export default {
        name: 'NavSticky',
        props: {
            top: {
                type: [String],
                default: '0' // 0像素不需要写单位px(bug出处)
            },
            zIndex: {
                type: Number,
                default: 20
            }
        },
        data() {
            return {
                child: null,
                stickyHeight: 0,
                parsedTop: this.top,
                position: 'static',
                scrollHandlerObj: _throttle(this.scrollHandler, 800)
            }
        },
        watch: {
            position(cur) {
                this.child.style.position = cur
                switch (cur) {
                    case 'sticky':
                        this.child.style.position = 'fixed'
                        this.child.style.top = this.top
                        break
                    case 'absolute':
                        this.child.style.position = 'absolute'
                        this.child.style.top = 'auto'
                        this.child.style.bottom = '0'
                        break
                    case 'static':
                    default:
                        this.child.style.position = 'static'
                }
            }
        },
        methods: {
            scrollHandler() {
                let offset = this.$el.getBoundingClientRect()
                let poffset = this.$el.parentElement.getBoundingClientRect()
                let isStatic = offset.top > this.parsedTop
                let isAbsolute = poffset.bottom < this.parsedTop + this.stickyHeight
                this.$nextTick(() => {
                    if (isStatic) {
                        this.position = 'static'
                    }
                    else if (isAbsolute) {
                        this.position = 'absolute'
                    }
                    else {
                        this.position = 'sticky'
                    }
                })
            }
        },
        mounted() {
            this.$nextTick(() => {
                let computedStyle = window.getComputedStyle(this.$el)
                let position = computedStyle.position
                let stickySupport = position.indexOf('sticky') > -1
                let child = this.$el.firstElementChild
                if (!stickySupport && child) {
                    this.child = child
                    child.style.zIndex = this.zIndex
                    this.stickyHeight = parseFloat(computedStyle.height, 10)
                    this.$el.style.position = 'static'
                    this.$el.style.height = computedStyle.height
                    window.addEventListener('scroll', this.scrollHandlerObj, true)
                    this.scrollHandlerObj()
                }
            })
        },
        destroyed() {
            window.removeEventListener("scroll", this.scrollHandlerObj);
        },
    }
</script>
<style lang="less" scoped>
    .sticky{
        position: -webkit-sticky;
        position: sticky
    }
</style>
```