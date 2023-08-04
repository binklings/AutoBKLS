/*
    THIS FILE IS PART OF AutoBKLS PROJECT
    THIS PROGRAM IS FREE SOFTWARE, binklings/AutoBKLS, IS LICENSED UNDER the GNU General Public License v3.0
    YOU SHOULD HAVE RECEIVED A COPY OF GNU General Public License, IF NOT, PLEACE TAKE A LOOK< https://www.gnu.org/licenses/ >
    Copyright (c) 2023 binklings.com
    The BINKLINGS or BINKLINGS GAMES in the relevant agreement documents of this project are equivalent to<binklings.com>, the author of this program
*/


setInterval(function(){},1000)
showWindow()

function showWindow(){
    window = floaty.window(
        <vertical>
            <button text="≡" padding="0sp" id="menu" h="25sp" w="25sp" bg="#FFFFFF"/>
        </vertical>
    )
    window.exitOnClose();
    var x = 0, y = 0;
    var windowX, windowY;
    var downTime;
    window.menu.setOnTouchListener(function(view, event){
    switch(event.getAction()){
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            if(event.getRawY()<=100){
                window.menu.attr("bg","#FF0000")
                window.menu.attr("w","100sp")
                window.menu.setText("Exit")
            }else if(event.getRawY()>=device.height - 200){
                window.menu.attr("bg","#39ff14")
                window.menu.attr("w","100sp")
                window.menu.setText("Back")
            }else{
                window.menu.attr("bg","#FFFFFF")
                window.menu.attr("w","25sp")
                window.menu.setText("≡")
            }
            return true;
        case event.ACTION_UP:
            if(Math.abs(event.getRawY() - y) < 5 && Math.abs(event.getRawX() - x) < 5){
                threads.start(function(){
                    onClick();
                })
            }
            if(event.getRawY()<=100){
                window.close()
            }else if(event.getRawY()>=device.height - 200){
                window.menu.attr("bg","#FFFFFF")
                window.menu.attr("w","25sp")
                window.menu.setText("≡")
                engines.execScriptFile("./Engine/Editor.js")
                threads.start(function(){
                    sleep(500)
                    back()
                    exit()
                })
            }
            return true;
    }
    return true;
    });
    
    function onClick(){
        var i = dialogs.select("工具箱", "获取点击坐标", "获取点击控件")
        if(i==0){
            engines.execScript("getCoordinates","getCoordinates()\n"+getCoordinates.toString())
        }else if(i==1){
            sleep(3000)
            engines.execScript("getControl","getControl()\n"+getControl.toString())
        }
    }

}


threads.start(function(){
    sleep(400)
    while(true){
        if(engines.all().toString().search("Editor.js") != -1 ){
        }else{
            exit()
        }
        sleep(500)
    }
})
    





function getCoordinates(){
toast("请点击屏幕位置")
window2 = floaty.rawWindow(
    <frame>
        <canvas id="canvas"></canvas>
    </frame>
);
window2.setSize(-1, -1);
setInterval(()=>{}, 1000);
window2.canvas.setOnTouchListener(function(view, event) {
    switch (event.getAction()) {
        case event.ACTION_DOWN:
            setClip(event.getX()+ " " + event.getY())
            alert("坐标已复制到剪切板",event.getX()+ " " + event.getY());
            window2.close()
            exit()
            return true
    }
})
}




function getControl(){
window2 = floaty.rawWindow(
    <frame>
        <canvas id="canvas"></canvas>
    </frame>
);
window2.setSize(-1, -1);
setInterval(()=>{}, 1000);
paint = new Paint();
paint.setStrokeWidth(2);
paint.setColor(android.graphics.Color.pack(colors.parseColor("#ff0000")));
paint.setStyle(Paint.Style.STROKE);
window2.canvas.setOnTouchListener(function(view, e) {
    switch (e.getAction()) {
        case e.ACTION_DOWN:
            var clickedInside = false;
            var clickingData = ""
            i=0
            rects.forEach(rect => {
                if (e.getX() >= rect.left && e.getX() <= rect.right && e.getY() >= rect.top && e.getY() <= rect.bottom) {
                    clickedInside = true;
                    clickingData = rect.data
                }
            });
            if (clickedInside) {
                clickingData = String(clickingData)
                if(clickingData.split("viewId: ")[1].split("; checkable: ")[0]=="null"){
                    alert("该控件没有Id属性😢","换个方法再试试")
                }else{
                    alert("数据已复制到剪切板",clickingData.split("viewId: ")[1].split("; checkable: ")[0])
                    setClip(clickingData.split("viewId: ")[1].split("; checkable: ")[0])
                }
                exit()
            } else {
                alert("点击的控件不被AutoBKLS解析兼容","建议您尝试选择此控件的父项或子项再尝试")
                exit()
            }
            return true
    }
})
function code(){
    rects = []
    json = find()
    for (var i = 0; i < json.length; i++) {
        posi = json[i].bounds()
        rects.push({left:posi.left,top:posi.top,right:posi.right,bottom:posi.bottom,data:json[i]});
    }
    return rects
}
checked = 0
window2.canvas.on("draw", (canvas) => {
    rects = code()
    
    if(checked<=2){
        rects.forEach(rect => {
            canvas.drawRect(rect.left, rect.top, rect.right, rect.bottom, paint);
        });
        checked++
    }
});
}