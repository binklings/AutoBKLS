/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/

"ui";
alert("抱歉，BINKLINGS START账户系统尚未开放，请等待")
ui.statusBarColor("#000000");
ui.layout(
    <frame>
        <vertical bg="#000000">
            <webview w="*" h="*" id="webview"/>
        </vertical>
    </frame>
)
ui.webview.getSettings().setJavaScriptEnabled(true); //启用JavaScript支持
ui.webview.getSettings().setBuiltInZoomControls(false); //禁用缩放控制
ui.webview.getSettings().setUserAgentString("Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1");

const webRoot = $files.join($files.cwd(), 'AutoBKLS_UI');
ui.webview.loadUrl(`file://${webRoot}/dev.html`)