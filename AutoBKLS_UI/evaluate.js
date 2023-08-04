"ui";

ui.layout(
    <vertical bg="#000000">
        <webview id="webView" w="0px" h="0px"/>
    </vertical>
)
webView = ui.webView;


importClass(android.webkit.WebView);
importClass(android.webkit.WebViewClient);
importClass("com.stardust.autojs.core.web.InjectableWebClient");
let sScriptEngine = engines.myEngine();
let scriptableContext = sScriptEngine.context;
let scriptableScriptable = sScriptEngine.scriptable;
let injectableWebClient = new InjectableWebClient(scriptableContext, scriptableScriptable);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebStorage)

WebStorage.getInstance().deleteAllData();

showed = false
var t = new JavaAdapter(WebChromeClient, {
    onProgressChanged: function(content, progress){
        if(progress==100){
            if(showed==false){
                showed = true
                threads.start(()=>{
                    i = dialogs.select("您对本次'自动赚钱'功能满意吗?","满意👍","不满意👎")
                    if(i==0){
                        ui.post(()=>{
                            injectableWebClient.inject("document.getElementById(\"htitle\").textContent = \"请点击验证以提交您的评价反馈,谢谢!\"")
                            injectableWebClient.inject("document.getElementById(\"divPowerBy\").innerHTML = \"\"")
                            injectableWebClient.inject("document.body.style.backgroundColor = \"black\"")
                            injectableWebClient.inject("document.getElementsByClassName(\"label\")[0].click();document.getElementById(\"ctlNext\").click();setTimeout(()=>{document.getElementsByClassName(\"layui-layer-btn0\")[0].click()},200)")
                            injectableWebClient.inject("document.getElementById(\"div1\").style.visibility = \"hidden\"")
                            injectableWebClient.inject("document.getElementById(\"divSubmit\").style.visibility = \"hidden\"")
                            validate()
                        })
                    }else if(i==1){
                        ui.post(()=>{
                            injectableWebClient.inject("document.getElementById(\"htitle\").textContent = \"请点击验证以提交您的评价反馈,谢谢!\"")
                            injectableWebClient.inject("document.getElementById(\"divPowerBy\").innerHTML = \"\"")
                            injectableWebClient.inject("document.body.style.backgroundColor = \"black\"")
                            injectableWebClient.inject("document.getElementsByClassName(\"label\")[1].click();document.getElementById(\"ctlNext\").click();setTimeout(()=>{document.getElementsByClassName(\"layui-layer-btn0\")[0].click()},200)")
                            injectableWebClient.inject("document.getElementById(\"div1\").style.visibility = \"hidden\"")
                            injectableWebClient.inject("document.getElementById(\"divSubmit\").style.visibility = \"hidden\"")
                            validate()
                        })
                    }else{
                        engines.myEngine().forceStop()
                    }
                })
            }
            if(webView.getUrl().includes("complete")){
                alert("谢谢!","BINKLINGS将继续不断改进AutoBKLS V2")
                engines.myEngine().forceStop()
            }
        }
    },
    onConsoleMessage: function (content) {
        //content.message()
    }
})

webView.loadUrl("https://www.wjx.cn/vm/r4i0Dqh.aspx#")

webView.setWebChromeClient(t)
webView.setWebViewClient(injectableWebClient)

function validate(){
    webView.attr("w",device.width+"px")
    webView.attr("h",device.height+"px")
}