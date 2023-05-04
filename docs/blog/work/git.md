---
title: 'Git基本原理及常用命令'
sidebar: auto
collapsable: true
---

# Git基本原理及常用命令

> Git是目前世界上最先进的分布式版本控制系统

本篇文章将重点讲解大多数人忽略或者不清楚的点，注意: 这不是一篇大而全的git使用教程, 只会重点讲解一些关键知识点，如果你需要更全的git教程，你应该去查看[官方文档](https://git-scm.com/)

## git add + commit 与 git commit -am 的区别

大多数人喜欢用后面的一种方式来添加提交本地代码到本地仓库中，但后一种与前一种方式并不是完全相等的。  
熟悉Git的同学知道，我们在项目中新建一个新文件后，它的状态是 `untracked` 的，当我们使用 `git add .` 将其添加到暂存区时，它的状态就会变为 `tracked` ，即可追踪的。当我们用 `git commit` 的时候会将暂存区的文件提交到本地仓库生成一个commit记录。  
 `git commit -am` 只会将 `tracked` 状态的文件commit到本地仓库，意思是如果你有新的文件产生，并且之前没有用 `git add` 将其状态变为 `tracked` ，使用 `git commit -am` 并不能将该文件commit到本地仓库，容易造成文件的丢失。

## 常用命令

```bash
$ git reset --hard ^HEAD # 版本回退
$ git checkout -- [file] # 撤销修改
$ git stash # 暂存修改
$ git stash apply # 恢复修改
```

## 多人合作开发

如果要开发多人合作项目，我们建议将master分支设置为[protected](https://help.github.com/en/articles/configuring-protected-branches)分支，使得不允许直接在master上提交代码，只能通过PR的形式来合并。如何向项目提交PR请参考[GitHub 的 Pull Request 是指什么意思？](https://www.zhihu.com/question/21682976/answer/79489643)

## 使用git-flow

使用[git-flow](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)这个工具可以帮助我们更好的控制我们的工作流程

## commit message 规范

commit message是必须要遵循一定的规范的，随意的commit message只会让人感受到不专业。这里我们参考[AngularJS commit message conventions](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

>为了确保每一次代码提交的规范性，本项目使用Angular 的 Commit 规范：

+ feat：开发了一个新功能
+ fix：修复了一个Bug
+ docs：更新了文档（比如改了 Readme）
+ style：代码的样式美化，不涉及到功能修改（比如改了缩进）
+ refactor：一些代码结构上优化，既不是新特性也不是修 Bug（比如函数改个名字）
+ perf：优化了性能的代码改动
+ test：新增或者修改已有的测试代码
+ build：构建流程、外部依赖变更，比如升级 npm 包、修改 webpack 配置等
+ ci：更改CI配置文件和脚本（如Travis）
+ chore：跟仓库主要业务无关的构建/工程依赖/工具等功能改动（比如新增一个文档生成工具）
+ revert：恢复上一次提交

## 使用git rebase 来合并你的commit

大部分人在实际开发过程中，都会建立自己的分支开发，这是大部分团队都能做到的，但是我们在测试问题的时候总是会提交一些无用的commit去远程的repo，自己的分支还好，但是最后把自己的分支合并到master上的时候如果还带上这些commit就十分不雅观了，当然github的PR功能已经给我们合并PR的时候提供了多种选项，其中就包括rebase。但是这里还是要介绍一个很多人不常用的命令，git rebase，也就是变基，git rebase功能很强大，也很容易一不小心弄不好就把你的整个commit或者git历史弄乱，所以这里我们不写如何用它来变基，只说如何用它来合并自己的commit。[参考教程](http://gitbook.liuhui998.com/4_2.html)

注意事项: 只有个人操作的分支才可以用git rebase，多人一起协作的分支切记不要轻易使用git rebase, 否则很容易造成冲突。

你执行了rebase命令的分支如果和远程仓库的commit history不一样，是没有办法直接push到远程仓库的，因为这时候你本地仓库的commit history已经修改了，和远程的会冲突。

解决方式

```bash
$ git push origin dev -f # 使用--force来强制push，但你要清楚这可能会导致你的一些commit记录的丢失，所以请仅在个人分支进行该操作
```

## git merge 与 git rebase区别
+ git merge 操作合并分支会让两个分支的每一次提交都按照提交时间（并不是push时间）排序，并且会将两个分支的最新一次commit点进行合并成一个新的commit，最终的分支树呈现非整条线性直线的形式
+ git rebase操作实际上是将当前执行rebase分支的所有基于原分支提交点之后的commit打散成一个一个的patch，并重新生成一个新的commit hash值，再次基于原分支目前最新的commit点上进行提交，并不根据两个分支上实际的每次提交的时间点排序，rebase完成后，切到基分支进行合并另一个分支时也不会生成一个新的commit点，可以保持整个分支树的完美线性。另外值得一提的是，当我们开发一个功能时，可能会在本地有无数次commit，而你实际上在你的master分支上只想显示每一个功能测试完成后的一次完整提交记录就好了，其他的提交记录并不想将来全部保留在你的master分支上，那么rebase将会是一个好的选择，他可以在rebase时将本地多次的commit合并成一个commit，还可以修改commit的描述等。

## Git常用命令总结
[个人ProcessOn思维导图分享链接](https://www.processon.com/view/link/613974251efad40d93a47748)
