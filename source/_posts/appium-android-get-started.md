---
title: 搭建 Appium 自动化测试环境（Android 篇）
date: 2018-08-08 14:23:00
tags: [测试, 自动化测试, Appium, Android]
---

今天我们要讲的如何搭建一个 Appium 自动化测试环境，可以对 Android 系统的 App 进行自动化测试。

> 本文仅讲解在 Mac 上的环境配置方法。

<!--more-->

## 配置 Android 的自动化驱动环境

Appium 进行自动化的原理是：发送命令到各自系统对应的自动化驱动，来对相应的系统上的 App 进行自动化。这篇文章讲的是 Android 自动化，对应驱动的名字叫 UiAutomator2。为了让驱动正常工作，我们要配置 UiAutomator2 的环境：

### 安装 Homebrew

如果你的 Mac 已经有 Homebrew ，请忽略，否则执行此命令安装：

```sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 安装 Java

```sh
brew tap caskroom/versions
brew cask install java8
```

### 设置 JAVA_HOME 环境变量

编辑登陆脚本：

```sh
vi ~/.bash_profile
```

添加这两行：

```sh
export JAVA_HOME="$(/usr/libexec/java_home)"
export PATH=$JAVA_HOME/bin:$PATH
```

使其生效：

```sh
source ~/.bash_profile
```

### 安装 Android SDK

Android SDK 最好的安装方法是安装 [Android Studio](https://developer.android.com/studio/index.html)。安装过程一路默认就好。

安装完成后，点击这里查看 SDK 目录：

![image.png](http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/560667f7c3c2da24c502e5c9555367ac.png)


![image.png](http://ata2-img.cn-hangzhou.img-pub.aliyun-inc.com/8191aafc8e1052d83d9dbad2315b4486.png)

### 设置 ADNROID_HOME 环境变量

将 ANDROID_HOME 环境变量设置为上步的 SDK 目录地址：

编辑登陆脚本：

```sh
vi ~/.bash_profile
```

添加这两行（注意把 username 改为自己的）：

```sh
export ANDROID_HOME="/Users/username/Library/Android/sdk"
export PATH=$ANDROID_HOME/platform-tools:$PATH
```

使其生效：

```sh
source ~/.bash_profile
```

至此，驱动环境就搭建好了！

## 安装 Appium 

安装 Appium 有两种方式，NPM 和 桌面程序安装包，我们这次先选择前者：

```sh
npm install -g appium
```

## 编写简单测试脚本

### 查看设备名称

打开手机开发者模式插到 Mac 上，输入此命令查看设备名称：

```sh
adb devices
```

### 下载被测试的 App

[ApiDemos-debug.apk](https://github.com/appium/appium/raw/master/sample-code/apps/ApiDemos-debug.apk)

### 新建测试项目

```sh
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
    platformName: "Android",
    deviceName: "填写 adb devices 中的名称",
    app: "填写 ApiDemos-debug.apk 的本地路径",
    automationName: "UiAutomator2"
  }
};

const client = wdio.remote(opts);

client
  .init()
  .click("~App")
  .back()
  .end();
```

在一个命令行中启动 appium：

```sh
appium
```

在另一个命令行中执行测试脚本：

```sh
node test.js
```

然后就会发现手机被安装了 ApiDemos.apk ，并模拟点击了脚本中的命令。





