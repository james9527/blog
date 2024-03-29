---
title: 'Vim'
sidebar: auto
collapsable: true
---

# Vim

不多介绍，*nix系统内置的编辑器。深受众多程序员喜爱，但上手难度偏高。vim的强大之处以及功能是一篇文章不可能介绍完的，这里只介绍一些比较简单但是实用的功能。在远程部署机上没有GUI的时候只能使用vim，所以懂得一些vim的基本操作还是很有必要的。

## 在终端里使用vi

```bash
$ set -o vi
```

然后就可以在终端里，以vi的方式对命令进行操作，非常方便。

## 快捷键

毫无疑问，必须掌握，不过确实部分快捷键比较反人类。vim的快捷键数量众多，和Chrome一样，我们只需要记住使用最常见的就足够了。

- `:wq` 退出vim。stackoverflow每日搜索次数第一问题，如何退出vim:)  
- `i` 进入插入模式  
- `q` 进入可视模式，可以用光标来选择文本  
- `jk` 上下移动  
- `hl` 左右移动   
- `ctrl` + `b/f` 上下翻页   
- `0/$` 光标快速移动到行首／行尾  
- `/` 搜索  
- `n/N` 跳转到下一个／上一个 搜索词  
- `:s/old/new/g` 单行替换  
- `:%s/old/new/g` 全局替换  

## janus

使用vim几乎是必须要装插件的，插件屏蔽了vim的一些底层配置，来让我们使用的更加舒服。比如[NerdTree](https://github.com/scrooloose/nerdtree)这个查看当前目录文件的插件几乎是必装的。这里我们推荐直接使用[janus](https://github.com/carlhuda/janus)这个扩展包，其中内置了多种实用插件，无需我们手动去一个一个安装。

### 安装janus

```bash
$ curl -L https://bit.ly/janus-bootstrap | bash
```

### 使用janus

这里来说以下个人喜欢的janus的功能

- 显示行号
- 文本高亮, 搜索高亮
- 句尾显示.号
- 轻松切换多种显示方式，水平显示 or 垂直显示

展示效果

![](https://i.ibb.co/190jJWM/20190710231451.jpg)
