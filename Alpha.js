/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";
ui.statusBarColor("#000000");
ui.layout(
<viewpager>
    <frame>
        <button w="auto" h="auto" text="跳过检查更新" textColor="#666666" bg="#000000" padding="15sp" id="skip" layout_gravity="bottom"/>
        <vertical bg="#000000">
            <webview w="*" h="*" id="webview"/>
        </vertical>
    </frame>
    <frame>
        <vertical bg="#000000">
            <webview w="*" h="*" id="webview2"/>
        </vertical>
    </frame>
</viewpager>
)

setInterval(function(){
    threads.start(function(){
        auto.waitFor()
    })
},1000)

ui.webview.getSettings().setJavaScriptEnabled(true); //启用JavaScript支持
ui.webview.getSettings().setBuiltInZoomControls(false); //禁用缩放控制
ui.webview.getSettings().setUserAgentString("Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1");

storage = storages.create("files");
files.create("/sdcard/AutoBKLS/");
init_files()
function init_files(){
    local_files = files.listDir("/sdcard/AutoBKLS/")
    local_files_string = ";"
    for(i=0;i<local_files.length;i++){
        local_files_string = local_files_string + local_files[i] + ";"
    }
}

const webRoot = $files.join($files.cwd(), 'AutoBKLS_UI');
ui.webview.loadUrl(`file://${webRoot}/index.html?0`)
checkFailed = true
threads.start(function(){
var versionurl = "https://binklings.com/http/B/version.txt";
var version = http.get(versionurl);
if (version.statusCode == 200){
    var versionnum = String(version.body.string())
    if(versionnum.includes("1.1.0")){
        $ui.post(() => {
            toast("版本检查成功")
            if(checkFailed == true){
                init()
            }
        })
    }else{
        alert("检查到新版本!", versionnum)
        app.openUrl("https://binklings.com/products/kz/index.html");
    }
}else{
    toast("ERR:无法检查更新")
    init()
}
});
setTimeout(function() {
    if(checkFailed==true){
        init()
    }
}, 8000);
function init(){
    checkFailed = false
    threads.start(function(){
        if(!floaty.checkPermission()){
            floaty.requestPermission();
        }
        var window = floaty.window(
            <frame gravity="center">
                <text id="text" text="." textSize="0sp"/>
            </frame>
        );
        window.exitOnClose();
    })
    ui.webview.loadUrl(`file://${webRoot}/index.html?50`)
    ui.skip.setText("初始化")
    setTimeout(function(){
        ui.webview.loadUrl(`file://${webRoot}/home.html?`+local_files_string)
        start()
        start2()
        start3()
        start4()
        start5()
        start6()
    }, 1000);
    alert("内测版本 欢迎分享/视频评测此软件","当前仅能抢先体验内测版本已开源的部分功能,不能保证100%稳定,如果觉得哪些功能做得不错可以去b站之类分享(可以视频评测),帮up提高热度,也欢迎反馈bug,帮助改进软件😊")
    alert("开源提示","binklings/AutoBKLS is licensed under the GNU General Public License v3.0\nPermissions of this strong copyleft license are conditioned on making available complete source code of licensed works and modifications, which include larger works using a licensed work, under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.\nPermissions:\n    Commercial use\n    Modification\n    Distribution\n    Patent use\n    Private use\nLimitations:\n    Liability\n    Warranty\nConditions:\n    License and copyright notice\n    State changes\n    Disclose source\n    Same license\nThis is not legal advice.")
    alert("开源地址: https://github.com/binklings/AutoBKLS","THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0 \nYOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ > \nCopyright (c) 2023 binklings.com \nThe BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program")
}

function start(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview.getUrl().includes("#newLocal")){
                    ui.webview.loadUrl(`file://${webRoot}/local.html?`+local_files_string)
                    threads.start(function(){
                        var newLocal_name = rawInput("脚本名称")
                        if(newLocal_name.includes(";")||newLocal_name.includes("local_files")){
                            $ui.post(() => {
                                alert("不得包含';'或'local_files'")
                            })
                        }else{
                            files.create("/sdcard/AutoBKLS/"+newLocal_name)
                            sleep(100)
                            $ui.post(() => {
                                init_files()
                                ui.webview.loadUrl(`file://${webRoot}/local.html?`+local_files_string)
                            })
                        }
                    })
                }
            })
            sleep(1000)
        }
    })
}
function start2(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview.getUrl().includes("#del;")){
                    del_name = decodeURI(ui.webview.getUrl().split("#del;")[1])
                    ui.webview.loadUrl(`file://${webRoot}/local.html?`+local_files_string)
                    threads.start(function(){
                        var del_confirm = confirm("确定永久删除'"+del_name+"'吗?");
                        if(del_confirm){
                            files.remove("/sdcard/AutoBKLS/"+del_name)
                        }
                        sleep(100)
                        $ui.post(() => {
                            init_files()
                            ui.webview.loadUrl(`file://${webRoot}/local.html?`+local_files_string)
                        })
                    })
                }
            })
            sleep(100)
        }
    })
}
function start3(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview.getUrl().includes("#edit;")){
                    edit_name = decodeURI(ui.webview.getUrl().split("#edit;")[1])
                    ui.webview.loadUrl(`file://${webRoot}/local.html?`+local_files_string)
                    storage.put("last_file",edit_name)
                    engines.execScriptFile("./Engine/Editor.js")
                }
            })
            sleep(100)
        }
    })
}
function start4(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview.getUrl().includes("#quick")){
                    engines.execScriptFile("./Engine/coder.js")
                    ui.webview.loadUrl(`file://${webRoot}/home.html?`+local_files_string)
                }
            })
            sleep(100)
        }
    })
}


ui.skip.on("click",()=>{
    init()
})


function start5(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview.getUrl().includes("#floaty")){
                    ui.webview.loadUrl(`file://${webRoot}/home.html?`+local_files_string)
                    engines.execScriptFile("./AutoBKLS_UI/floaty/floaty.js")
                    //threads.start(function() {
                        //showWindow()
                    //})
                }
            })
            sleep(100)
        }
    })
}


ui.webview2.loadUrl(`file://${webRoot}/SCmd.html`)
function start6(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(ui.webview2.getUrl().includes("?SCmd")){
                    ui.webview2.loadUrl(`file://${webRoot}/home.html?`+local_files_string)
                    engines.execScriptFile("./Engine/SCmd.js")
                }
            })
            sleep(100)
        }
    })
}


function showWindow(){
    width = device.width / 1.1 + "px"
    height = device.height / 1.1 + "px"
    window2 = floaty.window(
        <vertical>
            <button text="≡" id="menu" h="auto" w="*"/>
            <webview id="floaty_web" w="{{width}}" h="{{height}}"/>
        </vertical>
    )
    window2.exitOnClose();
    window2.floaty_web.loadUrl(`file://${webRoot}/f_local.html?`+local_files_string)
    var x = 0, y = 0;
    var windowX, windowY;
    window2.menu.setOnTouchListener(function(view, event){
        switch(event.getAction()){
            case event.ACTION_DOWN:
                x = event.getRawX();
                y = event.getRawY();
                windowX = window2.getX();
                windowY = window2.getY();
                return true;
            case event.ACTION_MOVE:
                window2.setPosition(windowX + (event.getRawX() - x),
                    windowY + (event.getRawY() - y));
                return true;
            case event.ACTION_UP:
                if(event.getRawY()<=100){
                    window2.close()
                }
        }
        return true;
    });

}

threads.start(function(){
    while(true){
    if(text("wVnG23OTBtn").findOne()){
        ui.post(()=>{
            ui.webview.loadUrl(`file://${webRoot}/home.html?`+local_files_string)
        })
        if(files.exists("./GPT/main.js")){
            engines.execScriptFile("./GPT/main.js")
        }else{
            engines.execScriptFile("./download.js")
        }
    }
    sleep(3000)
    }
})