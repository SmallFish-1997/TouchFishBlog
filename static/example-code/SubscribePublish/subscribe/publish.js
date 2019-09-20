// 发布订阅模式
var SubscribePublish  = (function () {
    class SubscribePublish {
        subs = {};
        // 添加订阅
        subscribe(key, fn) {
            if (!this.subs[key]) this.subs[key] = [];
            this.subs[key].push(fn)
            console.log(key,'-----添加订阅-----');
        }
        // 发布订阅消息
        publish(key,params) {
            // 1.发布给所有订阅者
            if(key === 'all'){
                let allKey = Object.keys(this.subs);
                allKey.forEach(key=>{
                    this.runCallback(this.subs[key],params);
                })
                return;
            }
            // 2.发布给指定订阅者
            this.runCallback(this.subs[key],params);
            console.log(key,'-----发布订阅消息-----');

        }
        // 执行订阅函数
        runCallback(subs,params){
            if (!Array.isArray(subs) || subs.length <= 0) return false;
            let len = subs.length;
            while (len--) {
                subs[len].call(this, params);
            }
        }
        // 取消订阅
        cancelSubscribe(key){
            if(this.subs[key]){
                delete this.subs[key];
            }
            console.log(this.subs,'-----取消订阅-----');
            
        }
    }

    return SubscribePublish;
})()

