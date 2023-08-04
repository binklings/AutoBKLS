/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

storage = storages.create("files");
file = storage.get("last_file")
codes = files.read("/sdcard/AutoBKLS/"+file)
start(codes)
variables = storages.create("variables")
variables.clear()
variables.put("a",1234)

function start(codes){
    all_codes = codes.split(";")
    running = threads.start(function(){
        var window = floaty.window(
            <frame>
                <button id="action" text="停止运行" w="90" h="40" bg="#77ffffff"/>
            </frame>
        );
        window.action.click(() => {
            log("服务已停止")
            running.interrupt();
            window.close()
        });
        if(codes.includes("get_text")){
            if (!requestScreenCapture()) {
                toastLog('请求截图权限失败')
                exit()
            }
        }
        for(i=0;i<all_codes.length;i++){
            var now_codes = all_codes[i].split(",")
            switch (true) {
                case now_codes[0]=="sleep":
                    toastLog(all_codes[i])
                    now_codes[1] = setVars(now_codes[1])
                    sleep(now_codes[1])
                    break;
                case now_codes[0]=="click":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    if(now_codes[1].includes(" ")){
                        click(Number(now_codes[1].split(" ")[0]),Number(now_codes[1].split(" ")[1]))
                    }else{
                        click(now_codes[1])
                    }
                    break;
                case now_codes[0]=="click_text":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    clickon(now_codes[1].split(" ")[0],Number(now_codes[1].split(" ")[1]),Number(now_codes[1].split(" ")[2]),Number(now_codes[1].split(" ")[3]),Number(now_codes[1].split(" ")[4]))
                    break;
                case now_codes[0]=="get_text":
                    now_codes[1] = setVars(now_codes[1])
                    result = []
                    
                    img = null
                    capturing = true
                    img && img.recycle()
                    img = captureScreen()
                    if (!img) {
                      toastLog('截图失败')
                    }
                    let start = new Date()
                    result = paddle.ocr(img);
                    capturing = false
                    variables.put(now_codes[1],String(result))
                    break;
                case now_codes[0]=="press":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    press(Number(now_codes[1].split(" ")[0]) + random(-Number(now_codes[1].split(" ")[2]), Number(now_codes[1].split(" ")[2])), Number(now_codes[1].split(" ")[1]) + random(-Number(now_codes[1].split(" ")[3]), Number(now_codes[1].split(" ")[3])), Number(now_codes[1].split(" ")[4]) + random(-Number(now_codes[1].split(" ")[5]), Number(now_codes[1].split(" ")[5])))
                    break;
                case now_codes[0]=="swipe":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    swipe(Number(now_codes[1].split(" ")[0]),Number(now_codes[1].split(" ")[1]),Number(now_codes[1].split(" ")[2]),Number(now_codes[1].split(" ")[3]),Number(now_codes[1].split(" ")[4]))
                    break;
                case now_codes[0]=="launch":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    launch(now_codes[1])
                    break;
                case now_codes[0]=="clickCtrl":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    id(now_codes[1]).findOne().click()
                    break;
                case now_codes[0]=="setText":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    setText(now_codes[1])
                    break;
                case now_codes[0]=="goto":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    i=now_codes[1]-1
                    break;
                case now_codes[0]=="var":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    variables.put(now_codes[1],null)
                    break;
                case now_codes[0]=="js":
                    now_codes[1] = setVars(now_codes[1])
                    toastLog(all_codes[i])
                    now_codes[1] = now_codes[1].replace(/\\n/g,"\n")
                    now_codes[1] = now_codes[1].replace(/\\"/g,"\"")
                    now_codes[1] = now_codes[1].replace(/\\'/g,"\'")
                    now_codes[1] = now_codes[1].replace(/%2C/g,",")
                    now_codes[1] = now_codes[1].replace(/%3B/g,";")
                    files.write("./Engine/cmd.js", 'sys_jsr_return = sys_jsr_fun()\nfunction sys_jsr_fun(){\n'+now_codes[1]+'\n}\nvariables = storages.create("variables")\nvariables.put("jsr",sys_jsr_return)')
                    engines.execScriptFile("./Engine/cmd.js")
                    break;
            }
        }
    })
    
function setVars(str){
    iVars = 1
    new_str = str
    while(true){
        if(str.split("%%")[iVars]){
            now_vars = variables.get(str.split("%%")[iVars].split("/")[0])
            new_str = new_str.replace("%%"+str.split("%%")[iVars].split("/")[0]+"/", now_vars)
            iVars++
        }else{
            
            return new_str
        }
    }
}
    
function clickon(clicktext,ix,iy,pt,it){
    let DisplayStop = false;
    while(true){
    Button = textMatches(clicktext).findOne(1);
    if(ClickControl(Button,ix,iy,pt,it)){
        if(!DisplayStop){
            log("点击 " + clicktext)
            DisplayStop = true;
            return true
        }
    }else{
            return false
        }
        break
    sleep(100)
    }
}
function ClickControl(object,ix,iy,pt,it){
  if (object) {
        x = object.bounds().centerX();
        y = object.bounds().centerY();
        if(x > 0 && y > 0){
            press(Number(x) + random(-ix, ix),Number(y) + random(-iy, iy),pt + random(-it, it));
            return true
        }else{
            console.error("Err: 目标超出控制范围");
            return false
        }
    }
    return false
}


}