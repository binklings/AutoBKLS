/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/
w = floaty.window(
    <vertical>
        <webview id="webView"/>
    </vertical>
)
w.setSize(0,0)
webView = w.webView;

download()

var versionurl = "https://binklings.com/http/B/version.txt";
var version = http.get(versionurl);
if (version.statusCode == 200){
    var cloudUrl = String(version.body.string()).split(";")[1]
    downloadDialog.title = "加载中..."
    ui.post(()=>{
        webView.loadUrl(cloudUrl)
    })
}else{
    toast("ERR:无法检查更新")
    exit()
}


importClass(android.net.Uri);
importClass(android.webkit.DownloadListener);
importClass(android.webkit.WebView);
importClass(android.webkit.WebViewClient);
importClass("com.stardust.autojs.core.web.InjectableWebClient");
let sScriptEngine = engines.myEngine();
let scriptableContext = sScriptEngine.context;
let scriptableScriptable = sScriptEngine.scriptable;
let injectableWebClient = new InjectableWebClient(scriptableContext, scriptableScriptable);
importClass(android.webkit.WebChromeClient);
importClass(java.io.FileOutputStream); 
importClass(java.net.URL);

downloaded = false
downloaded2 = false
var t = new JavaAdapter(WebChromeClient, {
    onProgressChanged: function(content, progress){
        downloadDialog.setProgress(progress)
        if(progress==100){
            if(downloaded==false){
                downloaded = true
                downloadDialog.title = "正在解析URL..."
                injectableWebClient.inject("document.getElementById('submit').click();document.getElementById('pwd').value = '0000';document.getElementById('sub').click();setTimeout('m_load()',7000)")
                injectableWebClient.inject("setInterval(()=>{console.log(document.body.innerHTML)},100)")
            }
        }
    },
    onConsoleMessage: function (content) {
        if(downloaded2==false){
            if(String(content.message()).includes('<div class="mh" onclick="m_load();"><a href="https://develope.lanzoug.com/file/?')){
                downloaded2 = true
                downloadUrl = String(content.message()).split('<div class="mh" onclick="m_load();"><a href="')[1].split('"')[0]
                downloadDialog.title = "准备下载"
                app.openUrl(downloadUrl)
                engines.stopAll()
            }
        }
    }
})

ui.post(()=>{
    webView.setWebChromeClient(t)
    webView.setWebViewClient(injectableWebClient)
})

function download(){
    var i = confirm("AutoBKLS需要从网盘服务器上下载文件,来更新版本.继续使用代表您已阅读并同意适用于AutoBKLS的开源协议 <GNU General Public License v3.0> ,若已阅读并同意,点击\"确定\"")
    if(i==true){
    }else{
        alert("抱歉,BINKLINGS不能继续为您提供该服务")
        exit()
    }
    progress = 0
    
    downloadDialog = dialogs.build({
            title: "正在获取下载链接...",
            progress: {
                max: 100,
                showMinMax: true
            },
            autoDismiss: false
        })
        .show();
}