importClass(android.content.Intent);
console.info("服务准备中...")


toast("正在启动...快手极速版");
app.launchApp("快手极速版");
var ksjsbts = threads.start(function() {
    
    //toread = dialogs.confirm("快手极速版自动读小说模块可能有bug,请自行决定是否运行自动刷小说模块,确定表示运行")
    toread = false
    
    beginNumberofgoldcoins = 0
    nowNumberofgoldcoins = 0

    console.verbose("线程已启动")
    console.show()
    console.setTitle("自动赚钱");
    console.setCanInput(false);
    var window = floaty.window(
        <frame>
            <button id="action" text="停止运行" w="90" h="40" bg="#77ffffff"/>
        </frame>
    );
    window.exitOnClose();
    window.action.click(() => {
        log("服务正在停止")
        console.info("本次收益: "+Number((nowNumberofgoldcoins-beginNumberofgoldcoins)/10000).toFixed(2))
        console.setSize(device.width / 2, Math.round(device.height/4.))
        alert("本次收益约为: ",Number((nowNumberofgoldcoins-beginNumberofgoldcoins)/10000).toFixed(2)+"¥\n这是最保守的统计")
        //ksjsbts.interrupt();
        //console.verbose("线程已关闭")
        window.close();
        console.verbose("悬浮窗已关闭")
        engines.execScriptFile("./AutoBKLS_UI/evaluate.js")
        engines.myEngine().forceStop()
        console.verbose("引擎已关闭")
    });

    console.verbose("正在适配设备信息...")
    var settings = storages.create("设置");
    settings.put("x1", "100");
    settings.put("y1", Math.round(device.height / 1.5));
    settings.put("x2", "100");
    settings.put("y2", Math.round(device.height / 20));
    settings.put("swipetime", "5000");
    settings.put("ksad", "0");
    settings.put("ksgj", "0");
    settings.put("kswt", "0");
    log("如果控制台遮挡了软件按钮请关闭控制台窗口！")
    console.setPosition(device.width-(device.width / 2), 0)
    sleep(500)
    console.setSize(device.width / 2, Math.round(device.height/1.1))
    console.info("服务已启动")
    log("正在启动快手极速版...")

    sleep(2000)

    console.verbose("寻找菜单按钮")
    id("com.kuaishou.nebula:id/left_btn").findOne().click()
    console.verbose("点击菜单按钮")
    sleep(1000)
    console.verbose("寻找去赚钱按钮")
    while (true) {
        if(click("去赚钱")){
            log("打开任务页面")
            break;
        }
        sleep(100)
    }

    console.verbose("等待加载任务界面")
    sleep(4000)
    MoneyPage()


    //打开任务页面
    function MoneyPage(mode) {
        swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200)
        sleep(1000)
        console.verbose("正在验证...")
        if (click("日常任务")) {
            log("成功打开任务页面")
            
            log("正在获取当前金币数量,用于服务后告知您本次自动赚钱多少")
            textContains("我的金币").findOne().click()
            textContains("汇率").findOne()
            console.info("当前金币数量为: "+Number(textContains("金币").find()[2].text().split("金币")[0]))
            if(mode==1){
                nowNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
            }else{
                beginNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
                nowNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
            }
            back()
            
            console.verbose("准备尝试打开宝箱")
            sleep(600)
            TreasureChest(mode)
        } else {
            log("没有发现'日常任务'字样,等待10秒")
            sleep(10000)
            if (click("日常任务")) {
                log("成功打开任务页面")
                
                log("正在获取当前金币数量,用于服务后告知您本次自动赚钱多少")
                textContains("我的金币").findOne().click()
                textContains("汇率").findOne()
                console.info("当前金币数量为: "+Number(textContains("金币").find()[2].text().split("金币")[0]))
                if(mode==1){
                    nowNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
                }else{
                    beginNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
                    nowNumberofgoldcoins = beginNumberofgoldcoins
                }
                back()
                
                console.verbose("准备尝试打开宝箱")
                sleep(1000)
                TreasureChest(mode)
            }else{
                console.error("找不到目标,正在尝试修复这个问题")
                back()
                sleep(1000)
                app.launchApp("快手极速版");
                sleep(1000)
                back()
                sleep(4000)
                id("com.kuaishou.nebula:id/left_btn").findOne().click()
                sleep(1000)
                while (true) {
                    if (click("去赚钱")) {
                        log("打开任务页面")
                        console.verbose("等待加载任务界面")
                        sleep(4000)
                        break;
                    }
                    sleep(100)
                }
                MoneyPage(mode)
            }
        }
    }


    //打开宝箱
    function TreasureChest(mode) {
        click("开宝箱得金币")
        log("尝试点击了 开宝箱得金币")
        sleep(2000 + random(-5, 5))
        if(mode==1){
            console.verbose("准备进入刷小说模式")
            read(mode)
        }else{
            console.verbose("准备进入观看广告模式")
            ad()
        }
    }
    
    //小说
    function read(mode){
        if(toread==true){
        swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200)
        sleep(1000)
        if(click("看小说")){
            log("/小说模式/")
            sleep(5000)
            console.verbose("点击 一键领取/去挑书")
            click("一键领取")
            sleep(500)
            click("去挑书")
            sleep(200)
            console.verbose("尝试打开小说")
            textContains("每读").find()[random(1,3)].click()
            console.setSize(device.width / 2, Math.round(device.height/2.2))
            console.verbose("开始阅读\n已缩小控制台")
            sleep(3000)
            for (i = 0; i < 70; i++) {
                click(device.width-random(10,20),Math.round(device.height/2)+random(50,100))
                log("已阅读小说" + i + "/70页")
                sleep(8000+random(-2000,2000))
                if(i>=3){
                    if(textContains("章").findOnce()==null){
                        if(textContains("继续阅读").findOnce()==null){
                            console.error("页面丢失,正在尝试修复这个问题...")
                            back()
                            sleep(500)
                            console.verbose("正在重新启动-快手极速版")
                            app.launchApp("快手极速版")
                            sleep(5000)
                        }else{
                            console.verbose("又是广告😠")
                        }
                    }else{
                        console.verbose("验证成功,任务正常进行中...")
                    }
                }
            }
            
            console.setSize(device.width / 2, Math.round(device.height/1.1))
            console.verbose("已恢复控制台大小")
            sleep(500)
            back()
            sleep(3000)
            console.verbose("领取收益")
            click("一键领取")
            sleep(500)
            back()
            
            log("正在获取当前金币数量,用于服务后告知您本次自动赚钱多少")
            textContains("我的金币").findOne().click()
            textContains("汇率").findOne()
            console.info("当前金币数量为: "+Number(textContains("金币").find()[2].text().split("金币")[0]))
            nowNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
            back()
            
            if(mode==1){
                if(settings.get("option").includes("1")){
                    log("服务正在停止")
                    console.info("本次收益: "+Number((nowNumberofgoldcoins-beginNumberofgoldcoins)/10000).toFixed(2))
                    console.setSize(device.width / 2, Math.round(device.height/4.))
                    //ksjsbts.interrupt();
                    //console.verbose("线程已关闭")
                    window.close();
                    console.hide()
                    console.verbose("悬浮窗已关闭")
                    console.info("准备启动新环境")
                    engines.execScriptFile("./Engine/dyjsb.js")
                    engines.myEngine().forceStop()
                    console.verbose("引擎已关闭")
                }
            }
            
            console.verbose("准备进入观看视频模式")
            ad()
        }else{
            if(mode==1){
                if(settings.get("option").includes("1")){
                    log("服务正在停止")
                    console.info("本次收益: "+Number((nowNumberofgoldcoins-beginNumberofgoldcoins)/10000).toFixed(2))
                    console.setSize(device.width / 2, Math.round(device.height/4.))
                    //ksjsbts.interrupt();
                    //console.verbose("线程已关闭")
                    window.close();
                    console.hide()
                    console.verbose("悬浮窗已关闭")
                    console.info("准备启动新环境")
                    engines.execScriptFile("./Engine/dyjsb.js")
                    engines.myEngine().forceStop()
                    console.verbose("引擎已关闭")
                }
            }
            
            console.verbose("准备进入观看视频模式")
            ad()
        }
        }else{
            if(mode==1){
                if(settings.get("option").includes("1")){
                    log("服务正在停止")
                    console.info("本次收益: "+Number((nowNumberofgoldcoins-beginNumberofgoldcoins)/10000).toFixed(2))
                    console.setSize(device.width / 2, Math.round(device.height/4.))
                    //ksjsbts.interrupt();
                    //console.verbose("线程已关闭")
                    window.close();
                    console.hide()
                    console.verbose("悬浮窗已关闭")
                    console.info("准备启动新环境")
                    engines.execScriptFile("./Engine/dyjsb.js")
                    engines.myEngine().forceStop()
                    console.verbose("引擎已关闭")
                }
            }
            
            console.verbose("准备进入观看视频模式")
            ad()
        }
    }


    //观看10分钟视频
    function watch() {
        log("/视频模式/")
        for (i = 0; i < 120; i++) {
            swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200);
            log("已完成视频" + i + "/120")
            sleep(random(1000, 5000))
            if(random(0,4)==1){
                log("随机返回(反侦测)")
                swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), 200)
            }
            if(i>=3){
                if(id("com.kuaishou.nebula:id/left_btn").findOnce()==null){
                    console.error("页面丢失,正在尝试修复这个问题...")
                    back()
                    sleep(500)
                    console.verbose("正在重新启动-快手极速版")
                    app.launchApp("快手极速版")
                    sleep(5000)
                }else{
                    console.verbose("验证成功,任务正常进行中...")
                }
            }
            sleep(Number(settings.get("swipetime")) + random(-2000, 2000))
            back()
        }
        id("com.kuaishou.nebula:id/left_btn").findOne().click()
        sleep(1000)
        while (true) {
            if (click("去赚钱")) {
                log("打开任务页面")
                sleep(4000)
                break;
            }
            sleep(100)
        }
        MoneyPage(1)
    }


    //看广告
    function ad() {
        if(click("看视频得")||click("看广告得")||click("看广告赚")){
            console.verbose("发现广告可观看")
            log("/广告模式/")
            sleep(5000)
            if(textContains("后可领取奖励").findOnce()==null){
                console.verbose("未发现更多广告,准备进入观看视频模式")
                watch()
            }else{
                text("已成功领取奖励").findOne()
                console.verbose("观看完成,正在尝试退出广告")
                sleep(random(1000, 3000))
                back()
                sleep(1000)
                click("放弃奖励")
                click("坚持退出")
            
                sleep(1500)
                log("正在获取当前金币数量,用于服务后告知您本次自动赚钱多少")
                textContains("我的金币").findOne().click()
                textContains("汇率").findOne()
                console.info("当前金币数量为: "+Number(textContains("金币").find()[2].text().split("金币")[0]))
                nowNumberofgoldcoins = Number(textContains("金币").find()[2].text().split("金币")[0])
                back()
            
                sleep(1500)
                ad()
            }
        }else{
            console.verbose("未发现更多广告,准备进入观看视频模式")
            watch()
        }
    }


})