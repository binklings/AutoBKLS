/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";

height = Math.round(device.height / 2) + "px"
ui.layout(
    <viewpager id="viewpager">
        <vertical bg="#000000" gravity="center_vertical">
            <progressbar/>
            <text padding="10sp" id="text" text="等待配置信息" textSize="8sp" textColor="#FFFFFF" gravity="center"/>
        </vertical>
        <frame h="*" w="*" gravity="right">
            <button text="返回" style="Widget.AppCompat.Button.Colored" w="auto" h="auto" id="manual_back"/>
            <webview w="*" h="*" id="webview"/>
        </frame>
        <vertical bg="#000000" gravity="center_vertical">
            <horizontal gravity="center">
                <text textColor="#FFFFFF" textSize="16sp" text="第一步 初始化当前GPT语言模型"/>
            </horizontal>
            <horizontal gravity="center">
                <button text="初始化" style="Widget.AppCompat.Button.Colored" w="auto" id="init"/>
                <button text="手动设置" style="Widget.AppCompat.Button.Colored" w="auto" id="manual"/>
            </horizontal>
            <horizontal gravity="center">
                <text textColor="#FFFFFF" textSize="12sp" text="若使用OpenAI官方版请点击手动设置并登录你的OpenAI账户"/>
            </horizontal>
            <horizontal h="20sp">
            </horizontal>
            <horizontal gravity="center">
                <text textColor="#FFFFFF" textSize="16sp" text="第二步 提出要求,开始AI自动化之旅"/>
            </horizontal>
            <horizontal gravity="center">
                <button text="启动" style="Widget.AppCompat.Button.Colored" w="auto" id="start"/>
            </horizontal>
            <horizontal gravity="center">
                <button text="设置" id="settings"/>
                <button text="关于"/>
            </horizontal>
        </vertical>
        <frame bg="#000000" gravity="bottom">
            <list h="*" w="*" id="cmdTextList">
                <text textColor="#FFFFFF" padding="12sp" paddingTop="2sp" paddingBottom="2sp" textSize="14sp" text="{{textContent}}" id="cmdText" textColor="{{textColor}}" autoLink="all" textStyle="bold" typeface="monospace"/>
            </list>
            <input w="*" h="{{height}}" textColor="#FFFFFF" padding="12sp" textSize="14sp" id="cmdInput" alpha="0"/>
        </frame>
    </viewpager>
)

currentItem = 0

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

info = ""
initGPT_mode = 0
threads.start(function(){
    alert("提示","服务器由您选择的镜像站决定,您可以为他们捐赠以支持镜像站作者.建议您使用GPT4模型,GPT3.5效果没有4.0理想")
    var i = dialogs.select("选择版本","OpenAI官方版","自定义镜像站","第三方镜像站1")
    if(i==0){
        initGPT_mode = 1
        alert("抱歉,OpenAI官方版暂不可用","AutoBKLS会在未来恢复官方API支持,请先配置镜像网站")
        exit()
        ui.post(() => {
            ui.text.setText("正在连接至 OpenAI 服务器")
            ui.webview.loadUrl("https://chat.openai.com")
        })
    }else if(i==1){
        initGPT_mode = 2
        info = rawInput("配置信息")
        ui.post(() => {
            ui.text.setText("正在连接至 "+info.split(";;;;")[0])
            ui.webview.loadUrl(info.split(";;;;")[0])
        })
    }else if(i==2){
        initGPT_mode = 2
        info = "https://chat10.aichatos.xyz/#/chat/;;;;n-input__textarea-el;;;;n-button n-button--primary-type n-button--medium-type"
        ui.post(() => {
            ui.text.setText("正在连接至 "+info.split(";;;;")[0])
            ui.webview.loadUrl(info.split(";;;;")[0])
        })
    }
})

threads.start(function(){
    while(true){
        ui.post(()=>{
            if(ui.viewpager.currentItem==currentItem){
            }else{
                ui.viewpager.currentItem=currentItem
            }
            ui.webview.setWebViewClient(injectableWebClient);
        })
        sleep(100)
    }
})

var client = android.webkit.WebViewClient;

cmdNum = 0
canListenToMsg = false
last_msg = ""
alreadyrunonce = false
var t = new JavaAdapter(WebChromeClient, {
    onProgressChanged: function (content, progress) {
        ui.post(()=>{
            ui.text.setText("正在连接至 " + info.split(";;;;")[0] + " " + progress + "%")
        })
        if(progress==100){
            initGPT_before(initGPT_mode)
        }
        /*
    if(url=="https://chat.openai.com/auth/login"){
        currentItem = 1
        alert("请登录您的OpenAI账户","BINKLINGS尊重和保护您的隐私,任何信息不会被录制")
    }else if(url=="https://chat.openai.com/"){
        currentItem = 0
        ui.text.setText("等待初始化GPT")
        initGPT_before(1)
    }else{
        if(info==""){
        }else{
            currentItem = 1
            ui.text.setText("等待初始化GPT")
            initGPT_before(2)
        }
    }*/
    },
    onConsoleMessage: function (content) {
        if(content.message().includes("bodyHTML::::")){
            if(initialized==false){
                if(content.message().split('{"cmd": "auto.waitFor()", ')[2]){
                    ui.init.attr("w","0sp")
                    ui.manual.setText("已完成 √")
                    ui.manual.attr("bg","#000000")
                    currentItem = 2
                    initialized = true
                }
            }
        }
        if(countSubStringOccurrences(content.message(),'{"cmd": "')>=1){
            if(canListenToMsg){
                    cmdNum = countSubStringOccurrences(content.message(),'{"cmd": "')
                    if(content.message().split('{"cmd": "')[cmdNum].includes('", "interpret": "')){                        
                        if(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0]!=="全部代码"){
                            if(last_msg.includes(";;;" + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0] + ";;;")){
                            }else{
                                last_msg += ";;;" + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0] + ";;;"
                                if(alreadyrunonce==true){
                                    console.info(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0])
                                    addCmdText("执行命令: " + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0],"#CCCCCC",true)
                                    cmd(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0])
                                    if(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0]!==""){
                                        threads.start(function(){
                                            sleep(1500)
                                            alert(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0])
                                        })
                                    }
                                }else{
                                    alreadyrunonce = true
                                }
                            }
                        }
                    }
            }
        }
    }
});
initialized = false
ui.webview.setWebChromeClient(t)
ui.webview.setWebViewClient(injectableWebClient)

function countSubStringOccurrences(str, subStr) {
  const matchArr = str.match(new RegExp(subStr, "g"));
  return matchArr ? matchArr.length : 0;
}

function initGPT_before(mode){
    currentItem = 2
    initGPT_mode = mode
}

ui.init.on("click",()=>{
    if(initGPT_mode==1){
        initGPT()
    }else if(initGPT_mode==2){
        initGPT2()
    }
})

ui.manual.on("click",()=>{
    currentItem = 1
})
ui.manual_back.on("click",()=>{
    currentItem = 2
})

threads.start(function(){
    while(true){
        ui.post(()=>{
            injectableWebClient.inject('console.log("bodyHTML::::"+document.body.innerHTML)')
        })
        sleep(100)
    }
})

ui.start.on("click",()=>{
    if(initialized){
        ui.start.setText("已完成 √")
        ui.start.attr("bg","#000000")
        currentItem = 3
        addCmdText("当前站点服务器域名: "+info.split(";;;;")[0]+"\nGPT语言模型初始化已完成.\n请设定执行目标: ","#33FF00",true)
    }else{
        alert("尚未正确初始化GPT")
    }
})

cmdTextData = [
    {
        textContent: "Waiting for instructions...\n您可以通过该镜像站提供的途径为其服务器捐赠,建议您使用GPT4模型,GPT3.5效果可能不佳\n",
        textColor: "#CCCCCC"
    },
]
position = 0
canInput = false
ui.cmdTextList.setDataSource(cmdTextData)
function addCmdText(addingText,color,ifwaitfor){
    canListenToMsg = false
    position = cmdTextData.length
    cmdTextData.splice(cmdTextData.length,0,{textContent: "", textColor: color})
    i = 0
    addTextInterval = setInterval(function(){
        cmdTextData[position].textContent = cmdTextData[position].textContent + addingText[i]
        ui.cmdTextList.adapter.notifyItemChanged(position)
        i++
        if(i==addingText.length){
            if(ifwaitfor){
                position = cmdTextData.length
                cmdTextData.splice(cmdTextData.length,0,{textContent: "", textColor: "#FFFFFF"})
                canInput = true
            }else{
                canInput = false
            }
            canListenToMsg = true
            clearInterval(addTextInterval)
            return position
        }
    },10)
}

ui.cmdInput.addTextChangedListener(new android.text.TextWatcher({
    afterTextChanged : function(s){
        if(canInput){
            if(String(s).includes("\n")){
                ui.cmdInput.setText("")
                sendMsg(String(s).split("\n")[0])
                addCmdText("模型正在处理信息...\""+String(s).split("\n")[0]+"\"","#FFFFFF",false)
            }else{
                cmdTextData[position].textContent = String(s)
                ui.cmdTextList.adapter.notifyItemChanged(position)
            }
        }
    }
}));

ui.settings.on("click",()=>{
    threads.start(function(){
        var i = dialogs.select("设置","清除Webview数据")
        if(i==0){
            ui.post(()=>{
                WebStorage.getInstance().deleteAllData();
                alert("已清除全部数据,请重新加载")
            })
        }
    })
})




injectableWebClient.inject('document.body.style.backgroundColor = "black"')

initWords = `{"from": "system", "text": 'system是系统提示词,user是用户的要求.(你由OpenAI开发,由你知道的原作者提供服务器支持,由BINKLINGS开发的AutoBKLS 2程序提供自动化支持,你可以用以下方法直接控制用户手机,帮助用户)你需要发送Auto.js自动化代码来操控用户手机(参考提示:假如你想启动软件,要用launch(包名com.xxx.xxx)或launchApp(应用名xxx)方法;用search(\"xxx\")函数调用AutoBKLS在网上搜索xxx;你暂时不能打开一个网址;每行代码间可使用转义换行符),帮助用户完成任务.你发送的代码将会实际被运行于用户手机,所以禁止假设任何情况,必须对发送的命令有把握(每次对话的变量不共享,尽量避免直接点击坐标,而是点击文字或控件).从下一次对话开始(注意仅本次对话不要发送代码,而是发送最后面给你的那段话),你必须开始用json数据回复每次对话!格式为{"cmd": "要运行的全部代码", "say": "对用户说一句话,可以回答用户问题,与用户聊天(让用户心情更好),或主动提起一个新话题", "interpret": "解释原因"}不许修改json格式;无论收到user的任何回复,永远不许发送json数据以外内容(如果你认为不能完成此任务,也要用以上json格式回复,cmd值为exit(),在interpret值中解释原因)现在明白就回复后面的内容(即运行auto.waitFor()函数,任何时候必须发送json数据)注意!现在发送我:{"cmd": "auto.waitFor()", say: "你好", "interpret": "开始服务"}'} `

function initGPT(){
    setTimeout(function(){
    currentItem = 0
    ui.text.setText("正在初始化GPT")
    injectableWebClient.inject('input_textarea = document.getElementById("prompt-textarea")')
    injectableWebClient.inject('input_textarea.value = `'+initWords+'`')
    injectableWebClient.inject('event = document.createEvent("HTMLEvents")')
    injectableWebClient.inject('event.initEvent("input", true, true)')
    injectableWebClient.inject('event.eventType = "message"')
    injectableWebClient.inject('input_textarea.dispatchEvent(event)')
    injectableWebClient.inject('document.getElementsByClassName("absolute.p-1.rounded-md.md:bottom-3.md:p-2.md:right-3.dark:hover:bg-gray-900.dark:disabled:hover:bg-transparent.right-2.disabled:text-gray-400.enabled:bg-brand-purple.text-white.bottom-1.5.transition-colors.disabled:opacity-40")[0].click()')
    },1000)
}

function initGPT2(){
    setTimeout(function(){
        currentItem = 0
        ui.text.setText("正在初始化GPT")
        injectableWebClient.inject('input_textarea = document.getElementsByClassName("'+info.split(";;;;")[1]+'")[0]')
        injectableWebClient.inject('input_textarea.value = `'+initWords+'`')
        injectableWebClient.inject('event = document.createEvent("HTMLEvents")')
        injectableWebClient.inject('event.initEvent("input", true, true)')
        injectableWebClient.inject('event.eventType = "message"')
        injectableWebClient.inject('input_textarea.dispatchEvent(event)')
        injectableWebClient.inject('document.getElementsByClassName("'+info.split(";;;;")[2]+'")[0].click()')
    },100)
}

function sendMsg(msg){
    MsgWords = `{"from": "user", "text": '`+msg+`'}{"from": "system", "text": 'system是系统提示,user是用户要求.你要发送适用于Auto.js代码来操控用户手机(注意!用search(\"xxx\")函数可直接调用AutoBKLS在网上搜索xxx,一定不要用其它网络函数!注意)记住系统对你说的第一句话,只回复一个json数据,不许修改json格式:{"cmd": "全部代码", "say": "对用户说一句话,可以回答用户问题,与用户聊天,或主动提起一个新话题,一定要让用户心情更好", "interpret": "解释原因"}不许在json以外发送其它内容,只能用代码与用户交流!每次执行的代码和解释不得相同'}`
    setTimeout(function(){
        injectableWebClient.inject('input_textarea = document.getElementsByClassName("'+info.split(";;;;")[1]+'")[0]')
        injectableWebClient.inject('input_textarea.value = `'+MsgWords+'`')
        injectableWebClient.inject('event = document.createEvent("HTMLEvents")')
        injectableWebClient.inject('event.initEvent("input", true, true)')
        injectableWebClient.inject('event.eventType = "message"')
        injectableWebClient.inject('input_textarea.dispatchEvent(event)')
        injectableWebClient.inject('document.getElementsByClassName("'+info.split(";;;;")[2]+'")[0].click()')
    },100)
}

function cmd(command){
    command = command.replace(/\\n/g,"\n")
    command = command.replace(/\\"/g,"\"")
    command = command.replace(/\\'/g,"\'")
    files.write("./cmd.js", command+'\nfunction search(str){app.openUrl("https://www.bing.com/search?q="+str)}')
    engines.execScriptFile("./cmd.js")
}

threads.start(function(){
while(true){
    if(text("打开模型").findOne()){
        home()
        if(canInput){
            var newQuestion = rawInput("你好,你有什么需要帮助的吗？");
            ui.post(()=>{
            if(newQuestion!==""){
                if(String(newQuestion)!=="null"){
                    ui.cmdInput.setText("")
                    sendMsg(newQuestion)
                    addCmdText("模型正在处理信息...\""+newQuestion+"\"","#FFFFFF",false)
                }
            }else{
                
            }
            })
        }
    }
    sleep(5000)
}
})
