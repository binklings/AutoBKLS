/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/


importClass(android.content.Intent);



toast("正在启动...快手极速版");
app.launchApp("快手极速版");
var ksjsbts = threads.start(function() {





    console.show()
    var window = floaty.window(
        <frame>
                    <button id="action" text="停止运行" w="90" h="40" bg="#77ffffff"/>
                </frame>
    );
    window.exitOnClose();
    window.action.click(() => {
        log("服务已停止")
        ksjsbts.interrupt();
        window.close();
        engines.execScriptFile("./AutoBKLS_UI/evaluate.js")
        engines.myEngine().forceStop()
    });

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

    //寻找模拟点击去赚钱
    id("com.kuaishou.nebula:id/left_btn").findOne().click()
    sleep(1000)
    while (true) {
        if (click("去赚钱")) {
            log("打开任务页面")
            break;
        }
        sleep(100)
    }

    sleep(4000)
    MoneyPage()


    //打开任务页面
    function MoneyPage() {
        swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200)
        sleep(1000)
        if (click("日常任务")) {
            log("成功打开任务页面")
            sleep(1000)
            TreasureChest()
        } else {
            console.error("找不到目标")
            back()
            app.launchApp("快手极速版");
            sleep(4000)
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
    }


    //打开宝箱
    function TreasureChest() {
        click("开宝箱得金币")
        log("点击了 开宝箱得金币")
        sleep(2000 + random(-5, 5))
        ad()
    }


    //观看10分钟视频
    function watch() {
        log("/视频模式/")
        for (i = 0; i < 120; i++) {
            swipe(parseInt(settings.get("x1")) + random(-5, 5), parseInt(settings.get("y1")) + random(-5, 5), parseInt(settings.get("x2")) + random(-5, 5), parseInt(settings.get("y2")) + random(-5, 5), 200);
            log("已完成视频" + i + "/120")
            sleep(settings.get("swipetime"))
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
        back()
        sleep(1000)
        click("放弃奖励")
        click("坚持退出")
        watch()
    }


})