---
title: 搭建 Appium 自动化测试环境（IOS 篇）
date: 2018-08-010 17:51:00
tags: [测试, 自动化测试, Appium, IOS]
---

今天我们要讲的如何搭建一个 Appium 自动化测试环境，可以对 IOS 系统的 App 进行自动化测试。

> 本文仅讲解在 Mac 上的环境配置方法。

<!--more-->

## 配置 IOS 的自动化驱动环境

Appium 进行自动化的原理是：发送命令到各自系统对应的自动化驱动，来对相应的系统上的 App 进行自动化。这篇文章讲的是 IOS 自动化，对应驱动的名字叫 XCUITest。为了让驱动正常工作，我们要配置 XCUITest 的环境：

### 安装 XCode7 或更高版本

如果你的 Mac 已经安装 XCode，请忽略，否则去 App Store 里安装。

### 添加 udid 到 IOS 开发者账号上

让有 IOS 开发者账号的人（可能是你或着你的 IOS 开发同事）把被测试的 iPhone 的 udid （udid 的获取办法请 Google）添加到开发者账户上。IOS 开发者都知道，如果你不是 IOS 开发就找他们做这一步，这里就不再赘述。

### 安装开发者证书

让有 IOS 开发者账号的人（可能是你或着你的 IOS 开发同事）把证书文件给你，你把它们装在 Mac 上。

文件清单：

- xxx.cer
- xxx.p12
- xxx.mobileprovision

三个文件都是双击安装，一路默认。

注意：

- 安装 xxx.p12 文件时候，可能有密码，还是找有 IOS 开发者账号的人要密码。
- 双击 xxx.mobileprovision 文件时候，没有什么界面，但是只要你的电脑上有 XCode，就已经安装好了。


### 安装 Homebrew

如果你的 Mac 已经有 Homebrew ，请忽略，否则执行此命令安装：

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 安装 Carthage

```sh
brew install carthage
```

### 安装 libimobiledevice

```sh
brew install libimobiledevice --HEAD
```

### 安装 ios-deploy 

```sh
npm install -g ios-deploy
```

或者

```sh
brew install ios-deploy
```

至此，驱动环境就搭建好了！

## 安装 Appium 

安装 Appium 有两种方式，NPM 和 桌面程序安装包，我们这次先选择前者：

```
npm install -g appium
```

## 配置 WebDriverAgent

打开 WebDriverAgent.xcodeproj：

```
open $(npm root -g)/appium/node_modules/appium-xcuitest-driver/WebDriverAgent/WebDriverAgent.xcodeproj
```

选择 WebDriverAgentRunner，并在下面两个 Signing 面板上选择之前安装的 provisioning 文件。

![image.png](http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/e60eccda5f84c981c7ba933b4cc37f00.png)

## 编写简单测试脚本

把 iPhone 插到 Mac 上。然后： 

### 准备被测试的 App 的安装包

准备一份被测试 IOS App 文件，就是 ipa 结尾的安装包。

### 新建测试项目

```
mkdir appium-test

cd appium-test

npm i webdriverio
```

添加 test.js 文件，并填写以下内容：

```js
// javascript

const wdio = require("webdriverio");

const opts = {
  port: 4723,
  desiredCapabilities: {
    platformName: "IOS",
    deviceName: "iPhone的设备名称（Settings -> General -> About -> Name ）",
    app: "填写 xxx.ipa 的本地路径",
    automationName: "XCUITest",
    udid: "iPhone 的 udid",
  }
};

const client = wdio.remote(opts);

client
  .init()
  .end();
```

在一个命令行中启动 appium：

```
appium
```

在另一个命令行中执行测试脚本：

```
node test.js
```

然后就会发现手机被安装了 xxx.ipa ，并打开了。
