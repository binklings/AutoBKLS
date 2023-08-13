importClass(android.content.Intent);
console.info("服务准备中...")


toast("正在启动...快手极速版");
app.launchApp("快手极速版");
var ksjsbts = threads.start(function() {

    console.verbose("线程已启动")
    console.show()
    var window = floaty.window(
        <frame>
                    <button id="action" text="停止运行" w="90" h="40" bg="#77ffffff"/>
                </frame>
    );
    window.exitOnClose();
    window.action.click(() => {
        log("服务正在停止")
        ksjsbts.interrupt();
        console.verbose("线程已关闭")
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
    console.setPosition(device.width-(device.width / 2), device.height - 1000)
    sleep(500)
    console.setSize(device.width / 2, device.width / 3)
    console.info("服务已启动")
    log("正在启动快手极速版...")

    sleep(5000)

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
    function MoneyPage() {
        swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200)
        sleep(1000)
        console.verbose("正在验证...")
        if (click("日常任务")) {
            log("成功打开任务页面")
            console.verbose("准备尝试打开宝箱")
            sleep(1000)
            TreasureChest()
        } else {
            log("没有发现'日常任务'字样,等待5秒")
            sleep(5000)
            if (click("日常任务")) {
                log("成功打开任务页面")
                console.verbose("准备尝试打开宝箱")
                sleep(1000)
                TreasureChest()
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
                MoneyPage()
            }
        }
    }


    //打开宝箱
    function TreasureChest() {
        click("开宝箱得金币")
        log("尝试点击了 开宝箱得金币")
        console.verbose("准备进入观看广告模式")
        sleep(2000 + random(-5, 5))
        ad()
    }


    //观看10分钟视频
    function watch() {
        log("/视频模式/")
        for (i = 0; i < 120; i++) {
            swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200);
            log("已完成视频" + i + "/120")
            sleep(random(1000, 3000))
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
        MoneyPage()
    }


    //看广告
    function ad() {
        click("领福利")
        log("/广告模式/")
        sleep(31000 + random(-5, 5))
        console.verbose("观看完成,正在尝试退出广告")
        back()
        sleep(1000)
        click("放弃奖励")
        click("坚持退出")
        console.verbose("准备进入观看视频模式")
        watch()
    }


})