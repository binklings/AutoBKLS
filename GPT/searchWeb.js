/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";
ui.layout(
<vertical bg="#000000">
    <webview id="searchWeb" h="0sp" w="0sp"/>
</vertical>
)

storage = storages.create("temp");

ui.searchWeb.loadUrl("https://cn.bing.com/search?q="+storage.get("searchContent"))
importClass(android.view.KeyEvent);
importClass(android.webkit.WebView);
importClass(android.webkit.WebChromeClient);
importClass(android.webkit.WebResourceResponse);
importClass(android.webkit.WebViewClient);
importClass(android.webkit.WebStorage)
importClass("com.stardust.autojs.core.web.InjectableWebClient");
let sScriptEngine = engines.myEngine();
let scriptableContext = sScriptEngine.context;
let scriptableScriptable = sScriptEngine.scriptable;
let injectableWebClient = new InjectableWebClient(scriptableContext, scriptableScriptable);
let client = android.webkit.WebViewClient;
ui.searchWeb.getSettings().setUserAgentString("Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36");

t = new JavaAdapter(WebChromeClient, {
    onProgressChanged: function (content, progress) {
        if(progress==100){
            injectableWebClient.inject('console.log("HTML::::"+document.getElementsByClassName("b_algo")[0].textContent)')
        }
    },
    onConsoleMessage: function (content) {
        if(content.message().includes("HTML::::")){
            storage.put("searchWeb",content.message().split("HTML::::")[1])
            exit()
        }
    }
})

ui.searchWeb.setWebChromeClient(t)
ui.searchWeb.setWebViewClient(injectableWebClient)








