/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";
ui.layout(
    <vertical>
        <text text="↑拖拽悬浮窗到屏幕上端以关闭↑" textSize="16sp" gravity="center"/>
    </vertical>
)

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

showWindow()
function showWindow(){
    width = Math.round(device.width / 2.1) + "px"
    height = Math.round(device.height / 2.1) + "px"
    window2 = floaty.window(
        <vertical>
            <button text="≡" id="menu" h="auto" w="*"/>
            <webview id="floaty_web" w="{{width}}" h="{{height}}"/>
        </vertical>
    )
    window2.exitOnClose();
    window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
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


start()
start2()
start3()
function start(){
    threads.start(function(){
        while(true){
            $ui.post(() => {
                if(window2.floaty_web.getUrl().includes("#newLocal")){
                    window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
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
                                window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
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
                if(window2.floaty_web.getUrl().includes("#del;")){
                    del_name = decodeURI(window2.floaty_web.getUrl().split("#del;")[1])
                    window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
                    threads.start(function(){
                        var del_confirm = confirm("确定永久删除'"+del_name+"'吗?");
                        if(del_confirm){
                            files.remove("/sdcard/AutoBKLS/"+del_name)
                        }
                        sleep(100)
                        $ui.post(() => {
                            init_files()
                            window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
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
                if(window2.floaty_web.getUrl().includes("#edit;")){
                    edit_name = decodeURI(window2.floaty_web.getUrl().split("#edit;")[1])
                    window2.floaty_web.loadUrl(`file://${webRoot}/floaty/f_local.html?`+local_files_string)
                    storage.put("last_file",edit_name)
                    editor()
                }
            })
            sleep(100)
        }
    })
}



function editor(){
window2.floaty_web.getSettings().setJavaScriptEnabled(true); //启用JavaScript支持
window2.floaty_web.getSettings().setBuiltInZoomControls(false); //禁用缩放控制
window2.floaty_web.getSettings().setUserAgentString("Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1");

storage = storages.create("files");
const webRoot = $files.join($files.cwd(), './AutoBKLS_UI');
//codes = `sleep(延时),1000,时间(ms);click(点击),100 200,坐标x y或文字`
file = storage.get("last_file")
codes = files.read("/sdcard/AutoBKLS/"+file)
window2.floaty_web.loadUrl(`file://${webRoot}/Engine.html`)

importClass(android.webkit.WebView);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebResourceResponse);
importClass(android.webkit.WebViewClient);
importClass("com.stardust.autojs.core.web.InjectableWebClient");
let sScriptEngine = engines.myEngine();
let scriptableContext = sScriptEngine.context;
let scriptableScriptable = sScriptEngine.scriptable;
let injectableWebClient = new InjectableWebClient(scriptableContext, scriptableScriptable);
window2.floaty_web.setWebViewClient(injectableWebClient);

return_content = new JavaAdapter(WebChromeClient, {
  onConsoleMessage: function (content) {
    if(content.message().includes("save;;")){
        files.write("/sdcard/AutoBKLS/"+file, content.message().split("save;;;")[1], "utf-8")
        toastLog("Saved successfully")
    }else if(content.message().includes("run;;")){
        files.write("/sdcard/AutoBKLS/"+file, content.message().split("run;;;")[1], "utf-8")
        toastLog("Saved.Starting...")
        engines.execScriptFile("./Engine/coder.js")
    }
  }
});
window2.floaty_web.setWebChromeClient(return_content)

injectableWebClient.inject('code("'+codes+'")')
}
