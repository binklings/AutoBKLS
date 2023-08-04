/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";

console.setGlobalLogConfig({
    file: "/sdcard/AutoBKLS.log"
});

height = Math.round(device.height / 2) + "px"
height2 = Math.round(device.height / 1.4) + "px"
height3 = Math.round(device.height / 3) + "px"
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
            <horizontal h="20sp">
            </horizontal>
            <horizontal gravity="center">
                <text textColor="#FFFFFF" textSize="16sp" text="第二步 提出要求,开始AI自动化之旅"/>
            </horizontal>
            <horizontal gravity="center">
                <button text="启动" style="Widget.AppCompat.Button.Colored" w="auto" id="start"/>
            </horizontal>
            <horizontal gravity="center">
                <button text="设置" textColor="#FFFFFF" bg="#000000" id="settings"/>
                <button text="关于" textColor="#FFFFFF" bg="#000000" id="about"/>
            </horizontal>
        </vertical>
        <frame bg="#000000">
            <list h="{{height2}}" w="*" id="cmdTextList" layout_gravity="top">
                <text textColor="#FFFFFF" padding="12sp" paddingTop="2sp" paddingBottom="2sp" textSize="14sp" text="{{textContent}}" id="cmdText" textColor="{{textColor}}" autoLink="all" textStyle="bold" typeface="monospace"/>
            </list>
            <vertical layout_gravity="bottom" h="{{height3}}">
                <vertical w="*" h="1sp" bg="#555555"/>
                <text gravity="center" layout_gravity="center_vertical" textColor="#555555" text="点此唤出键盘"/>
            </vertical>
            <input w="*" layout_gravity="bottom" h="{{height3}}" textColor="#FFFFFF" padding="12sp" textSize="14sp" id="cmdInput" alpha="0"/>
        </frame>
        <vertical bg="#000000">
            <input w="*" h="*" textColor="#FFFFFF" gravity="center" id="voice"/>
        </vertical>
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

importPackage(android.speech.tts);
importClass(java.util.Locale);
if(TTS!=undefined){TTS.stop();TTS.shutdown();}
var TTS = new TextToSpeech(context, function (status) { 
    if(status!=TextToSpeech.SUCCESS){ 
        toast("初始化TTS失败"); 
    } 
    TTS.setLanguage(Locale.CHINA); 
});

info = ""
initGPT_mode = 0
threads.start(function(){
    alert("服务器由您选择的站点决定.建议您使用GPT4模型,GPT3.5效果没有4.0理想")
    initGPT_mode = 2
    info = rawInput("配置信息(不输入直接点确定则默认使用上次配置)")
    ui.post(() => {
        storageWeb = storages.create("storageWeb")
        if(storageWeb.get("lastUrl")){
            if(storageWeb.get("lastUrl").includes(info.split(";;;;")[0])){
                info = storageWeb.get("lastUrl") + ";;;;" + info.split(";;;;")[1] + ";;;;" + info.split(";;;;")[2]
            }
        }
        ui.text.setText("正在连接至 "+info.split(";;;;")[0])
        ui.webview.loadUrl(info.split(";;;;")[0])
    })
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
last_say = ""
alreadyrunonce = false
var t = new JavaAdapter(WebChromeClient, {
    onProgressChanged: function (content, progress) {
        ui.post(()=>{
            ui.text.setText("正在连接至 " + info.split(";;;;")[0] + " " + progress + "%")
        })
        if(progress==100){
            initGPT_before(initGPT_mode)
        }
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
                        if(!content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0].includes("全部代码")){
                            if(last_msg.includes(";;;" + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0] + ";;;")){
                                if(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0]==""){
                                    if(last_say.includes(";;;"+content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0]+";;;")){
                                        
                                    }else{
                                        last_say += ";;;" + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0] + ";;;"
                                        if(alreadyrunonce==true){
                                            status="In process"
                                            if(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0]!==""){
                                                addCmdText("AI: " + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0],"#CCCCCC",true)
                                                TTS.speak(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0], TextToSpeech.QUEUE_ADD, null);
                                            }else{
                                                addCmdText("SYSTEM: AI没有回复任何信息","#FFFF00",true)
                                            }
                                        }else{
                                            alreadyrunonce = true
                                        }
                                    }
                                }
                            }else{
                                last_msg += ";;;" + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0] + ";;;"
                                if(alreadyrunonce==true){
                                    console.info(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0])
                                    cmd(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0])
                                    status="In process"
                                    if(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0]!==""){
                                        TTS.speak(content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0], TextToSpeech.QUEUE_ADD, null);
                                        addCmdText("执行命令: " + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0] + "\nAI: " + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[1].split('"')[0],"#CCCCCC",true)
                                    }else{
                                        addCmdText("执行命令: " + content.message().split('{"cmd": "')[cmdNum].split('", "say": "')[0],"#CCCCCC",true)
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

Promptedtoinitialize = false

function initGPT_before(mode){
    if(!Promptedtoinitialize){
        currentItem = 2
        initGPT_mode = mode
        Promptedtoinitialize = true
    }
}

ui.init.on("click",()=>{
    if(initGPT_mode==2){
        initGPT()
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
            injectableWebClient.inject('console.log("bodyHTML::::"+document.body.textContent)')
        })
        sleep(100)
    }
})

ui.start.on("click",()=>{
    if(initialized){
        storageWeb.put("lastUrl",ui.webview.getUrl())
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
        textContent: "THIS FILE IS PART OF AutoBKLS PROJECT\nTHIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0\nYOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >\nCopyright (c) 2023 binklings.com\nWaiting for instructions...\n建议您使用GPT4模型,GPT3.5效果可能不佳",
        textColor: "#CCCCCC"
    },
    {
        textContent: "请确保已正确初始化提示词.点击'Awaiting'可进入语音对话模式",
        textColor: "#FFFF00"
        
    },
    {
        textContent: "///",
        textColor: "#FFFFFF"
    },
]
infoVoice = ""
$ui.cmdTextList.on("item_click", function (item, i, itemView, listView) {
    if(item.textContent.includes("Awaiting...")){
        currentItem = 4
        threads.start(function(){
            alert("欢迎使用语音模式","以讯飞输入法为例,点击屏幕唤出键盘,点击屏幕键盘右上角录音按钮,左上角设置,启动长文本模式,回到录音模式后对手机说'GPT'可唤醒AI,3秒没有新内容自动发送请求,等待模型处理要求.")
            infoVoice = rawInput("请输入输入法录音按钮xy坐标(空格隔开)(不明白可以点软件首页教学按钮,里面找相应教程)")
        })
    }else{
        alert("原文已复制到剪切板",item.textContent);
        setClip(item.textContent)
    }
});
position = 1
canInput = false
ui.cmdTextList.setDataSource(cmdTextData)
function addCmdText(addingText,color,ifwaitfor){
    canListenToMsg = false
    position = cmdTextData.length - 1
    cmdTextData.splice(cmdTextData.length-1,0,{textContent: "", textColor: color})
    i = 0
    addTextInterval = setInterval(function(){
        cmdTextData[position].textContent = cmdTextData[position].textContent + addingText[i]
        ui.cmdTextList.adapter.notifyItemChanged(position)
        i++
        if(i==addingText.length){
            if(ifwaitfor){
                position = cmdTextData.length - 1
                cmdTextData.splice(cmdTextData.length-1,0,{textContent: "", textColor: "#FFFFFF"})
                canInput = true
            }else{
                canInput = false
            }
            canListenToMsg = true
            clearInterval(addTextInterval)
            if(addingText.includes("执行命令: ")){
                status="Awaiting"
            }else if(addingText.includes("AI: ")){
                status="Awaiting"
            }
            return position
        }
    },10)
}
status="Awaiting"
threads.start(function(){
    while(true){
        ui.post(()=>{
            cmdTextData[position+1].textContent = status+"...丨"
            ui.cmdTextList.adapter.notifyItemChanged(position+1)
        })
        sleep(225)
        ui.post(()=>{
            cmdTextData[position+1].textContent = status+".../"
            ui.cmdTextList.adapter.notifyItemChanged(position+1)
        })
        sleep(225)
        ui.post(()=>{
            cmdTextData[position+1].textContent = status+"...—"
            ui.cmdTextList.adapter.notifyItemChanged(position+1)
        })
        sleep(350)
        ui.post(()=>{
            cmdTextData[position+1].textContent = status+"...\\"
            ui.cmdTextList.adapter.notifyItemChanged(position+1)
        })
        sleep(225)
    }
})
threads.start(function(){
    while(true){
        if(status=="Awaiting"){
            ui.post(()=>{
                cmdTextData[position+1].textColor = "#FFFFFF"
            })
        }else if(status=="Generating"){
            ui.post(()=>{
                cmdTextData[position+1].textColor = "#FFFF00"
            })
        }else if(status=="In process"){
            ui.post(()=>{
                cmdTextData[position+1].textColor = "#33FF00"
            })
        }else if(status=="Self-callback"){
            ui.post(()=>{
                cmdTextData[position+1].textColor = "#0000FF"
            })
        }
        sleep(100)
    }
})

ui.cmdInput.addTextChangedListener(new android.text.TextWatcher({
    afterTextChanged : function(s){
        if(canInput){
            if(String(s).includes("\n")){
                ui.cmdInput.setText("")
                sendMsg(String(s).split("\n")[0])
                status="Generating"
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

ui.about.on("click",()=>{
    alert("关于本服务","本服务提供给所有不便使用OpenAI API接口和需要自动化支持的用户.本服务是开源项目 binklings/AutoBKLS 的一部分,AutoBKLS仅提供客户端支持,AI服务器由用户选择的第三方提供,本服务不会对第三方服务器做出破坏,请用户遵守AutoBKLS的开源协议和所有涉及到的第三方站点的协议条款")
})




injectableWebClient.inject('document.body.style.backgroundColor = "black"')

init_files()
function init_files(){
    local_files = files.listDir("/sdcard/AutoBKLS/")
    local_files_string = ";"
    for(i=0;i<local_files.length;i++){
        local_files_string = local_files_string + local_files[i] + ";"
    }
}

initWords = `{"from": "system", "text": 'system是系统提示词,user是用户对你说的话.(你由OpenAI开发,由你知道的原作者提供服务器支持,由BINKLINGS开发的AutoBKLS 2程序提供自动化支持!你可以用以下方法直接控制用户手机,帮助用户)你需要发送Auto.js自动化代码来操控用户手机(参考提示:假如你想启动软件,要用launch(包名com.xxx.xxx)或launchApp(应用名xxx)方法;用search(\"xxx\")函数调用AutoBKLS在网上搜索xxx,返回搜索数据;你暂时不能打开一个网址;使用CallMeBack()自我回调迭代函数可让系统将函数输入值发送给你,供你进一步参考,如CallMeBack(search(\"xxx\"))可将搜索xxx的结果回复你,或CallMeBack(Date())来获取时间等各种你需要的功能;runScript(\"xxx\")可以运行名为xxx的脚本,想要执行它之前必须询问用户有无可用脚本;每行代码间可使用转义换行符),帮助用户完成任务.你发送的代码将会实际被运行于用户手机,所以禁止假设任何情况,必须对发送的命令有把握(每次对话的变量函数不共享,尽量避免直接点击坐标,而是点击文字或控件).从下一次对话开始(注意仅本次对话不要发送代码,而是发送最后面给你的那段话),你必须开始用json数据回复每次对话!格式为{"cmd": "要运行的全部代码", "say": "对用户说一句话,可以回答用户问题,与用户聊天,或主动提起一个新话题", "interpret": "解释原因"}不许修改json格式;无论收到user的任何回复,永远不许发送json数据以外内容(如果你认为不能完成此任务,也要用以上json格式回复,以上内容不必对用户说明,现在明白就回复后面的内容(即运行auto.waitFor()函数,任何时候必须发送json数据)注意!现在发送我:{"cmd": "auto.waitFor()", say: "你好", "interpret": "开始服务"}'} `

function initGPT(){
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
    MsgWords = `{"from": "user", "text": '`+msg+`'}{"from": "system", "text": '你由BINKLINGS开发的AutoBKLS 2程序提供自动化支持,你要发送适用于Auto.js代码操控用户手机(记住CallMeBack(search("xxx"))可以搜索内容,这两个函数可以单独用,用CallMeBack函数你可以自己给自己发消息)(用runScript()方法运行用户提供的脚本)记住系统对你说的第一句话!只回复一个json数据,数据内部引号必须用转义符,不许修改json格式:{"cmd": "全部代码", "say": "对用户说一句话,可以回答用户问题,与用户聊天,或主动提起一个新话题,关心用户", "interpret": "解释原因"}无论什么情况,json一定必须仍带有cmd say interpret值!你可以直接操控用户手机'}`
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
    files.write("./GPT/cmd.js", command+'\nfunction search(searchStr){storage=storages.create("temp");storage.put("searchWeb","");storage.put("searchContent",searchStr);engines.execScriptFile("./GPT/searchWeb.js");while(true){if(storage.get("searchWeb")!==""){var window=floaty.window(<frame><button id="action" text="查看结果" w="90" h="40" bg="#77ffffff"/></frame>);window.action.click(()=>{app.openUrl("https://www.bing.com/search?q="+searchStr)});window.action.longClick(()=>{toast("已关闭");exit()});setInterval(()=>{},1000);return storage.get("searchWeb")}sleep(100)}}\nfunction CallMeBack(CallBackStr){storage=storages.create("temp");storage.put("CallBack",CallBackStr)}\nfunction runScript(scriptName){if(scriptName.includes(".js")){scriptName=scriptName.split(".js")[0]};storage2 = storages.create("files");storage2.put("last_file",scriptName);engines.execScriptFile("./Engine/coder.js")}')
    engines.execScriptFile("./GPT/cmd.js")
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
                    engines.execScriptFile("./ReturnInterface.js")
                }
            }else{
                
            }
            })
        }
    }
    sleep(5000)
}
})



function sendCallBack(msg){
    status = "Self-callback"
    MsgWords = `{"about": "此json的数据是你刚刚执行CallMeBack函数回调返回内容,text是函数返回值,此函数是自我迭代与回调函数,你可以借此自己给自己发消息", "text": '`+msg+`'}{"from": "system", "text": '记住系统对你说的第一句话!现在继续完成用户刚刚告诉你的任务!只回复一个json数据,不许修改json格式:{"cmd": "全部代码,不得为空", "say": "对用户说一句话,可回答用户问题,与用户聊天,或主动提起一个新话题,关心用户", "interpret": "解释原因,不得为空"}不许在json以外发送其它内容,只能用代码与用户交流!json必须完整'}`
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

threads.start(function(){
    storageTemp = storages.create("temp")
    storageTemp.put("CallBack","")
    while(true){
        if(storageTemp.get("CallBack")!==""){
            ui.post(()=>{
                sendCallBack(storageTemp.get("CallBack"))
            })
            sleep(100)
            storageTemp.put("CallBack","")
        }
        sleep(1000)
    }
})

threads.start(function(){
    while(true){
        ui.post(()=>{
            if(String(ui.voice.text()).includes("GPT")||String(ui.voice.getText()).includes("gpt")){
                ui.voice.setText("")
                if(canInput){
                    media.playMusic("./res/Awakened.mp3")
                    last_voice_text = ""
                    threads.start(function(){
                        sleep(200)
                        click(Number(infoVoice.split(" ")[0]),Number(infoVoice.split(" ")[1]))
                    })
                    islast_voice_text_num = 0
                    voice_text_interval = setInterval(function(){
                        if(ui.voice.text()==last_voice_text){
                            islast_voice_text_num++
                        }else{
                            islast_voice_text_num = 0
                            last_voice_text = ui.voice.text()
                        }
                        if(islast_voice_text_num>=30){
                            if(ui.voice.text()!==""){
                                //sendMsg(ui.voice.text())
                                media.playMusic("./res/Submitted.mp3")
                                ui.voice.setText("")
                                threads.start(function(){
                                    sleep(200)
                                    click(Number(infoVoice.split(" ")[0]),Number(infoVoice.split(" ")[1]))
                                })
                                clearInterval(voice_text_interval)
                            }else{
                                media.playMusic("./res/Cancelled.mp3")
                                ui.voice.setText("")
                                threads.start(function(){
                                sleep(200)
                                    click(Number(infoVoice.split(" ")[0]),Number(infoVoice.split(" ")[1]))
                                })
                                clearInterval(voice_text_interval)
                            }
                        }
                    },100)
                }
            }
        })
        sleep(100)
    }
})







