cc.Class({
    extends: cc.Component,

    properties: {

    },

    connect:function(url , options){
        let self = this ;
        this.ws = new WebSocket(url+"?userid="+cc.beimi.user.id);
        this.ws.onopen = function (event) {
            console.log("Send Text WS was opened.");
        };
        this.ws.onmessage = function (event) {
            var data = self.parse(event.data) ;
            if(data!=null && data.event != null){
                cc.beimi.event[data.event](event.data);
            }
            console.log("response text msg: " + event.data);
        };
        this.ws.onerror = function (event) {
            console.log("Send Text fired an error");
        };
        this.ws.onclose = function (event) {
            console.log("WebSocket instance closed.");
        };
        return this;
    },
    on:function(command , func){
        cc.beimi.event[command] =  func ;
    },
    exec:function(command , data){
        if (this.ws.readyState === WebSocket.OPEN) {
            data.command = command;
            data.userid = cc.beimi.user.id ;
            data.orgi = cc.beimi.user.orgi ;
            data.token = cc.beimi.authorization ;
            this.ws.send(JSON.stringify(data));
            console.log("send command:"+command+",data:"+JSON.stringify(data))
        }
    },
    emit:function(command , data){
        let param = {
            data : data
        } ;
        this.exec(command , param) ;
    },
    disconnect:function(){

    },
    parse:function(result){
        return JSON.parse(result) ;
    },
});
