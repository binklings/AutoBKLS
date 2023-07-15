/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

importClass(java.io.FileOutputStream);
importClass(java.net.URL);

byteSum = 0;
byteRead = 0;
buffer = util.java.array('byte', 1024);
var url = 'https://www.binklings.com/http/B/main.zip';
var filePath = files.path("./main.zip");
download()

function download(){
    var i = confirm("AutoBKLS需要从github.io服务器上下载文件,来更新版本.继续使用代表您已阅读并同意适用于AutoBKLS的开源协议 <GNU General Public License v3.0> ,若已阅读并同意,点击\"确定\"")
    if(i==true){
        toast("开始下载")
    }else{
        alert("抱歉,BINKLINGS不能继续为您提供该服务")
        exit()
    }
    progress = 0
    
    downloadDialog = dialogs.build({
            title: "下载中...",
            progress: {
                max: 100,
                showMinMax: true
            },
            autoDismiss: false
        })
        .show();
    let setProgress = setInterval(() => {
        downloadDialog.setProgress(progress*100)
        if (progress >= 1) {
            clearInterval(setProgress)
            downloadDialog.title = "安装中"
            unzip()
        }
    }, 20)
    threads.start(function() {
        var myUrl = new URL(url);
        var conn = myUrl.openConnection();
        inStream = conn.getInputStream();
        fs = new FileOutputStream(filePath);
        connLength = conn.getContentLength();
        while ((byteRead = inStream.read(buffer)) != -1) {
            byteSum += byteRead;
            fs.write(buffer, 0, byteRead);
            progress = byteSum / connLength;
        }
    })
}

//更新Engine GPT AutoBKLS_UI Alpha.js
function unzip(){
    files.removeDir("./Engine")
    files.removeDir("./GPT")
    files.removeDir("./AutoBKLS_UI")
    files.remove("./Alpha.js")
    zip = zips.X(filePath, files.cwd())
    if(zip==0){
        downloadDialog.title = "更新完成"
        sleep(1000)
        exit()
    }else{
        alert("错误","错误代码: "+zip+"\n软件可能已经损坏")
    }
}
