# 关于本项目

    AutoBKLS V2 是由BINKLINGS.com作者开发的一款开源免费的安卓端集成式自动化工作流工具软件,现已开源至Github (仓库为 github.com/binklings/AutoBKLS)
    BINKLINGS致力将其打造为即轻量, 又强大的辅助工具,让生活与工作更加便捷.
    出于大多数人的希望, AutoBKLS在大规模宣传前先展开了小规模内测, 并开源了相对稳定的功能, 打包供内测用户使用.
    AutoBKLS V2主要使用 Autox.js 编译,后者基于 Auto.js 4.1 开发. AutoBKLS V2 采用开源协议< GNU General Public License v3.0 >, 请贡献者和使用者按照其规定要求使用. 请广大代码贡献者注意您正在修改或添加的文件的开源协议和版权声明, 使您的协议或声明与原有的不抵触. 请这样声明你新增文件的版权和协议: 

```
// SPDX-License-Identifier: GPL-3.0
// 声明你的版权
```

用户手册
---

### 下载与安装
在使用 AutoBKLS V2 前, 请检查您的设备和系统是否满足程序要求的最低标准: 

- [x] 
|类别|最低标准|
|:---:|:---:|
|系统及其版本|Android 9|
|屏幕长款|1000px × 500px|
|运行内存 RAM|2GB|
|所需存储空间(现版本全部功能,安装包加后期占用)|100MB (20MB安装包＋80MB脚本/缓存/数据)|

请在仓库的Releases中下载安装包
安卓后请授予权限:

- [x] 
|权限|原因|
|:---:|:---:|
|无障碍权限|用于运行脚本/AI助手/识别控件等|
|悬浮窗权限|用于展示快速工具/维持后台进程等|
|文件读写|用于制作脚本/AI助手自动运行代码等|
|网络请求(非必须)|用于检查更新/获取公告/下载文件插件等|

### 开始使用
左上角菜单中可打开各个功能, 每个功能有其具体详细介绍
点击==本地==,打开脚本管理界面,点击右下角＋号,输入新脚本名称并创建,点击脚本列表中相应脚本的编辑/删除按钮对其进行操作,进入编辑页面后可点击绿色三角按钮运行,点击保存图标保存脚本
编写教程见最后

GPT AI模式内测版说明
---

### 前言
服务器由您选择的官方站点或镜像站点提供, 请同时遵守他们的用户协议和政策, 服务器不由 AutoBKLS 提供, 本软件服务只是一个中间工具, BINKLINGS无权也没有义务对用户与站点之间做出额外干涉, 且AutoBKLS V2会按照用户指令逐步完成操作, 不会对服务器造成任何额外损失. 您可以通过该镜像站提供的途径为其服务器捐赠! 建议您使用GPT4模型, GPT3.5效果可能不佳.

### 使用方法

##### 配置
自定义镜像站的配置数据格式为: 

$$
URL;;;;InputClass;;;;SendBtnClass
$$
即为 网站URL网址+";;;;"+网页中输入框的类名+";;;;"+网页中发送按钮的类名
类名可使用浏览器的开发者工具获取
示例配置方式(此镜像站为第三方作者制作, AutoBKLS与其无关, 用户可使用此配置方案, 但请遵守其规定, 也可以为其作者捐赠, 谢谢):

```
https://c.binjie.fun/#/chat/;;;;n-input__textarea-el;;;;n-button n-button--primary-type n-button--medium-type
```

##### 使用技巧

1. 配置完成后, 选择初始化, 稍等片刻后可以向右滑动屏幕查看Webview网页, 确保初始化提示词发送成功
2. 点击'启动'即可开始使用
3. 点击屏幕下1/3部分可以选中输入框, 并打字, 字会显示在这个类似cmd的界面上, 按下换行回车键发送
4. 点击文字可以直接复制到剪切板
5. GPT3.5的理解能力较弱, 请使用这个版本时多和AI解释你的要求
6. AI可以在网上搜索, 搜索后屏幕左上角会出现悬浮窗搜索记录, 点击查看, 长按关闭
7. AI可以自动阅读其搜索结果, 但请说清楚要求
8. AI可以自我回调和迭代, 但请说清楚要求
9. AI可以运行本地已有脚本, 但请说清楚运行方法
10. 点击Awaiting字样可进入语音对话模式

系统提供给AI的全部控制方法:

1. 全部Autox.js支持的Api函数,见[Autox.js官方文档](http://doc.autoxjs.com/#/)
2. search("xxx")函数调用AutoBKLS在网上搜索xxx,返回搜索数据
3. 使用CallMeBack()自我回调迭代函数可让系统将函数输入值发送给它,供其进一步参考,如CallMeBack(search("xxx"))可自动将搜索xxx的结果回复它,或CallMeBack(Date())来获取时间等各种功能
4. runScript("xxx")可以运行名为xxx的本地脚本,不得在脚本名后加后缀

若AI出现问题, 可以选择性地跟它强调以上内容

脚本编写参考
---
##### 编辑器

~~内测版删去了很多节点,以保证新功能稳定性~~
点击＋号可在该节点后插入新节点,点击节点标题查看详情,全部已有详情如下:

```
switch (true) {
      case data[0]=="sleep":
          alert("延时xxx毫秒,输入一个数字,单位为毫秒")
          break;
      case data[0]=="click":
          alert("点击坐标或文字,输入一个坐标 x[空格]y 或 [文字xxx],坐标可使用悬浮窗工具获取")
          break;
      case data[0]=="click_text":
          alert("通过搜索控件点击指定文字,输入格式: [文字xxx] [随机x位置偏离,一个数字] [随机y位置偏离,一个数字] [按压时长,一个数字,单位毫秒] [按压时长偏离,一个数字,单位毫秒] , 偏离是指在原有数字基础上在运行时随机偏移(加或减)")
          break;
      case data[0]=="get_text":
          alert("通过Paddle OCR获取屏幕全部文字(需要截图权限,全部信息在本地处理)及其属性,输入一个变量名字,将识别结果(字符串)设置到该变量中")
          break;
      case data[0]=="press":
          alert("长按坐标位置,输入格式: x y [随机x位置偏离,一个数字] [随机y位置偏离,一个数字] [按压时长,一个数字,单位毫秒] [按压时长偏离,一个数字,单位毫秒] , 偏离是指在原有数字基础上在运行时随机偏移(加或减),x y是按压坐标")
          break;
      case data[0]=="swipe":
          alert("从一个坐标滑动到另一个坐标(模拟滑动屏幕),输入格式: x1 y1 x2 y2 time , 其中x1和y1是起始坐标,x2和y2是结束坐标,time是用时,单位毫秒,坐标可使用悬浮窗工具获取")
          break;
      case data[0]=="launch":
          alert("启动一个app,输入该app的包名(字符串)")
          break;
      case data[0]=="clickCtrl":
          alert("点击一个控件,控件是安卓中任何一个界面的组成部分,输入viewId(即控件id,可使用悬浮窗工具获取屏幕上某个控件的id,若id为null则此方法不可用)")
          break;
      case data[0]=="goto":
          alert("跳转至第x行执行,从第0算起,即第一行是0")
          break;
      case data[0]=="var":
          alert("定义一个新变量,在其它节点通过 %%x/ 即可调用名为x的变量,此节点输入新变量名")
          break;
      case data[0]=="js":
          alert("调用autox.js进行函数运算,此处若要AutoBKLS与js通信,请用 %%x/ 来调用名为x的AutoBKLS中的变量在js中执行,在js中用return方法可回调AutoBKLS,默认将返回值设到名为jsr的变量中,此处输入js代码,可使用转义换行符\\n和逗号%2C")
          break;
      default:
          alert("这是一个损坏的节点,请查阅文档获取相关信息")
          break;
    }
```

##### 悬浮窗工具

1. 将悬浮窗拖动至屏幕最上端以关闭悬浮窗
2. 将悬浮窗拖动至屏幕最下端以后台弹出编辑器界面
3. 点击悬浮窗以使用工具

## 请关注最新公告, 感谢支持