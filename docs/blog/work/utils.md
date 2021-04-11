---
title: '常用工具'
sidebar: auto
collapsable: true
---

# Utils

## Charles

[Charles](https://www.charlesproxy.com)是一个代理服务器，简单的说法为当访问网站时，会由Charles代为获取请求相关数据，这样就达到了截取网络请求以及分析请求结果的目的。Charles是在日常工作中常用的功能包括: 代理移动端设备的请求，将远程文件代理到本地文件等。

### 代理移动端请求

代理移动端设备的请求指的是：将移动设备的请求代理到PC的Charles服务，以此来抓包移动端设备的请求详细信息以及使得移动端设备可以打开我们的本地服务器的资源

#### 开启设置

为了可以在Charles中截取网络请求数据，首先需要将Charles设置为系统代理，即让Charles成为获取请求数据的委托代理方，具体操作为：选择菜单栏中 `proxy` -> `Mac OS X Proxy` ，使 `Mac OS X Proxy` 前出现 `✔️` 。

在charles中选择菜单栏 `proxy` -> `proxy settings` , 在弹出的对话框中填写端口号（默认为8888），勾选”enable transparent http proxying“。	

#### 查看本机IP

使用 `ifconfig` 查看本机在当前局域网中的IP地址

 `enx` 代表当前的第x块网卡，当前我们只有一块网卡，故 `192.168.199.161` 是我们当前的局域网ip地址

#### 移动端开启代理设置

确保手机和电脑连接同一个无线网络，并对无线网络进行代理设置

 `WIFI` -> `HTTP代理` -> `手动` -> `填写IP以及端口号` 

连接成功后Charles会弹窗提示，选择 `allow` 。至此该移动设备的请求都会被Charles所代理，我们可以在PC端的Charles中看到移动设备所有 `http` 请求的详细信息。

#### 抓包https请求

由于https协议的请求安全系数较高，在截取此类请求数据时，需要安装证书等操作，此处单独列出https协议请求的操作步骤。

1. 在PC上安装证书。在charles中选择菜单栏 `help` -> `SSL Proxying` -> `Install Charles Root Certificate` , 安装成功后，双击安装的证书进行信任处理。

2. 在Charles选择菜单栏 `proxy` -> `SSL Proxying Settings` ，通过 `add` 添加需要抓包的域名，并选中 `enable SSL Proxying ` 。至此，在PC端中即可对https请求进行抓包处理。

3. 如果要截取移动端访问的https协议的数据，在完成上述步骤后，需要重复第一个步骤，并更改为选择菜单栏 `help` -> `SSL Proxying` -> `Install Charles Root Certificate on a Mobile Device or Remote Browser` 。移动端完成无线网络配置(移动端实机测试的第四步骤)后，访问[证书地址](http://charlesproxy.com/getssl)，即可完成移动端设备安装证书的操作。至此，移动端访问https请求，就可以在charles中实时显示相关抓包信息。

### 将远程文件代理到本地

当需要在线上环境测试展示效果，而本地程序代码不确保正确的情况下，可以将线上的文件访问地址重定向到本地的文件，从而使得线上环境真正使用的为本地需要测试的文件。

 `Map Local` 是将指定的网络请求代理到本地文件，在Charles选择菜单栏 `Tools` -> `Map Local` ，填写需要重定向的源地址以及本地的目标文件。如果网络请求较为复杂，可在请求处右键选择 `Save Response` 保存请求返回的数据到本地。

#### Map From

源文件相关配置， `protocol` 选择http或者https协议， `HOST` 为远程服务域名， `PATH` 为请求的路径， `Query` 为请求查询字符串

#### Map To

为本地文件地址，可以为单文件或者文件夹的地址

注意：如果Map From以及Map To中的数据需要区分大小写，应勾取Case-sensitive选项。

通过设置，我们在访问 `http://baidu/com/test/a.js` 时，实际访问的是 `~/Desktop/a.js` 

