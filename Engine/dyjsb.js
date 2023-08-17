importClass(android.content.Intent);
console.info("服务准备中...")


toast("正在启动...抖音极速版");
app.launchApp("抖音极速版");
var dyjsbts = threads.start(function() {
    
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
        console.error("抖音极速版自动赚钱为Beta测试内容,暂不能为您统计本次收益")
        console.setSize(device.width / 2, Math.round(device.height/4))
        //dyjsbts.interrupt();
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
    console.setSize(device.width / 2, Math.round(device.height/1.2))
    console.info("服务已启动")
    log("正在启动抖音极速版...")

    sleep(2000)

    console.verbose("寻找来赚钱按钮")
    click(Math.round(device.width/2),Math.round(device.height/2))
    var b1 = id("com.ss.android.ugc.aweme.lite:id/h8m").findOne().bounds()
    click(b1.centerX()+random(-10,10), b1.centerY()+random(-10,10))
    console.verbose("点击来赚钱按钮")
    sleep(1000)
    log("打开任务界面")

    console.verbose("等待加载任务界面")
    sleep(3000)
    MoneyPage()


    //打开任务页面
    function MoneyPage() {
        console.verbose("正在验证...")
        if (click("日常任务")) {
            log("成功打开任务页面")
            sleep(1000)
            if(textContains("立即签到").findOnce()!==null){
                log("签到")
                b3 = textContains("立即签到").findOnce().bounds()
                click(b3.centerX(),b3.centerY())
            }
            console.verbose("准备尝试打开宝箱")
            sleep(600)
            TreasureChest()
        } else {
            log("没有发现'日常任务'字样,等待8秒")
            sleep(8000)
            if (click("日常任务")) {
                log("成功打开任务页面")
                console.verbose("准备尝试打开宝箱")
                sleep(1000)
                TreasureChest()
            }else{
                console.error("找不到目标,正在尝试修复这个问题")
                back()
                sleep(1000)
                app.launchApp("抖音极速版");
                sleep(1000)
                back()
                sleep(4000)
                var b1 = id("com.ss.android.ugc.aweme.lite:id/h8m").findOne().bounds()
                click(b1.centerX()+random(-10,10), b1.centerY()+random(-10,10))
                console.verbose("点击来赚钱按钮")
                MoneyPage()
            }
        }
    }


    //打开宝箱
    function TreasureChest() {
        if(textContains("开宝箱得金币").findOnce()!==null){
            var b2 = textContains("开宝箱得金币").findOnce().bounds()
            click(b2.centerX(),b2.centerY())
            log("尝试点击了 开宝箱得金币")
            sleep(2000 + random(-5, 5))
        }else{
            log("没有宝箱😢")
        }
        watch()
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
                if(id("com.ss.android.ugc.aweme.lite:id/h8m").findOnce()==null){
                    console.error("页面丢失,正在尝试修复这个问题...")
                    back()
                    sleep(500)
                    console.verbose("正在重新启动-抖音极速版")
                    app.launchApp("抖音极速版")
                    sleep(5000)
                }else{
                    console.verbose("验证成功,任务正常进行中...")
                }
            }
            sleep(Number(settings.get("swipetime")) + random(-2000, 2000))
            back()
        }
        
        if(settings.get("option").includes("0")){
            log("服务正在停止")
            console.setSize(device.width / 2, Math.round(device.height/4.))
            //dyjsbts.interrupt();
            //console.verbose("线程已关闭")             
            window.close();
            console.hide()
            console.verbose("悬浮窗已关闭")
            console.info("准备启动新环境")
            engines.execScriptFile("./Engine/ksjsb.js")
            engines.myEngine().forceStop()
            console.verbose("引擎已关闭")
        }
        
        var b1 = id("com.ss.android.ugc.aweme.lite:id/h8m").findOne().bounds()
        click(b1.centerX()+random(-10,10), b1.centerY()+random(-10,10))
        MoneyPage()
    }


})