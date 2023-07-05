/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

//This script is designed to download the files needed for GPT mode, and may be used to download various files later
var i = confirm("AutoBKLS需要从服务器上下载文件,来提供GPT AI模式服务")
if(i==true){
    var i = confirm("继续使用代表您已阅读并同意适用于AutoBKLS的开源协议 <GNU General Public License v3.0> ,若已阅读并同意,点击\"确定\"")
    if(i==true){
        toast("开始下载")
    }else{
        alert("抱歉,BINKLINGS不能继续为您提供该服务")
        exit()
    }
    var url = "https://cdn.jsdelivr.net/gh/BINKLINGS/AutoBKLS@2.0.0Alpha1/GPT/main.js"
    var res = http.get(url);
    if (res.statusCode == 200) {
        toast("请求成功")
        var path = "./GPT/main.js";
        var file = open(path, "w");
        file.write(res.body.string());
        file.close();
        alert("下载完成")
    } else {
        alert("请求失败:" + res.statusMessage);
    }
}