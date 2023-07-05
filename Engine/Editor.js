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
    <vertical bg="#000000">
        <webview w="*" h="*" id="webview"/>
    </vertical>
)
ui.webview.getSettings().setJavaScriptEnabled(true); //启用JavaScript支持
ui.webview.getSettings().setBuiltInZoomControls(false); //禁用缩放控制
ui.webview.getSettings().setUserAgentString("Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1");

storage = storages.create("files");
const webRoot = $files.join($files.cwd(), './AutoBKLS_UI');
//codes = `sleep(延时),1000,时间(ms);click(点击),100 200,坐标x y或文字`
file = storage.get("last_file")
codes = files.read("/sdcard/AutoBKLS/"+file)
ui.webview.loadUrl(`file://${webRoot}/Engine.html`)

importClass(android.webkit.WebView);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebResourceResponse);
importClass(android.webkit.WebViewClient);
importClass("com.stardust.autojs.core.web.InjectableWebClient");
let sScriptEngine = engines.myEngine();
let scriptableContext = sScriptEngine.context;
let scriptableScriptable = sScriptEngine.scriptable;
let injectableWebClient = new InjectableWebClient(scriptableContext, scriptableScriptable);
ui.webview.setWebViewClient(injectableWebClient);

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
ui.webview.setWebChromeClient(return_content)

injectableWebClient.inject('code("'+codes+'")')

log(engines.all().toString())
if(engines.all().toString().search("index.js")){
    engines.execScriptFile("./Engine/tools/index.js")
}else{
}