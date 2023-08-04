sys_jsr_return = sys_jsr_fun()
function sys_jsr_fun(){
for(i=0;i<120;i++){swipe(200, Math.round(device.height/1.5), 200, 100, 100);sleep(5000)}
}
variables = storages.create("variables")
variables.put("jsr",sys_jsr_return)