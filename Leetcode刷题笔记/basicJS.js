

// myCall：改变this指向
Function.prototype.myCall = function() {
    if (this === Function.prototype) {
        // 用于防止 Function.prototype.myCall()直接调用
        return undefined;
    }
    let context = Array.prototype.shift.call(arguments);
    context.fn = this;
    let ret = context.fn(...arguments);
    delete context.fn;
    return ret ? ret : null;
}

// myApply：改变this指向
Function.prototype.myApply = function() {
    if (this === Function.prototype) {
        // 用于防止 Function.prototype.myCall()直接调用
        return undefined;
    }
    let context = Array.prototype.shift.call(arguments);
    context.fn = this;

    let ret = context.fn([...arguments]);

    if (ret) {
        return ret;
    }
}

// myBind：改变this的指向
Function.prototype.myBind = function() {
    if (this === Function.prototype) {
        // 用于防止 Function.prototype.myCall()直接调用
        return undefined;
    }
    let context = Array.prototype.shift.call(arguments);
    let _this = this;
    let args1 = [...arguments];

    return function F(...args2) {
        // 判断是否用于构造函数
        if (this instanceof F) {
            return new _this(...args1, ...args2);
        } else {
            return _this.apply(context, args1.concat(args2));
        }
    }

}

// let obj = {
//     name: 'obj-name'
// }

// var name = 'window-name';

// function sayName() {
//     console.log(this.name);
//     return this.name;
// }

// console.log(sayName());
// console.log(sayName.myApply(obj));



// EventEmitter
class EventEmitter {
    constructor() {
        this.events = {};
        this.count = 10; // 默认10个为最大数量
    }

    addListener(event, listener) {
        if (this.events[event]) {
            this.events[event].push(listener);
        } else {
            this.events[event] = [];
            this.events[event].push(listener);
        }
    }

    removeListener(event, listener) {
        if (Array.isArray(this.events[event])) {
            if (!listener) {
                // 之前没有注册过具体的事件执行函数
                delete this.events[event];
            } else {
                this.events[event] = this.events[event].filter(item => item != listener && item.origin != listener);
            }
        }
    }

    setMaxListeners(n) {
        this.cuont = n;
    }

    // 为指定事件注册一个单次监听器，即监听器最多只会触发一次，触发后立即解除该监听器
    once(event, listener) {
        const only = (...args) => {
            listener.apply(this, args);
            this.removeListener(event, listener);
        }

        only.origin = listener;
        this.addListener(event, only);
    }

    // 执行某类事件
    emit(event, ...args) {
        if (Array.isArray(this.events[event])) {
            this.events[event].forEach(item => {
                item.apply(this, args);
            })
        }
    }
}

// var emitter = new EventEmitter();

// var onceListener = function (args) {
//   console.log('我只能被执行一次', args, this);
// }

// var listener = function (args) {
//   console.log('我是一个listener', args, this);
// }

// emitter.once('click', onceListener);
// emitter.addListener('click', listener);

// emitter.emit('click', '参数');
// emitter.emit('click');

// emitter.removeListener('click', listener);
// emitter.emit('click');









// 手写实现 jsonp
/**
 * 1、将传入的data数据转化为字符串形式
 * 2、处理url中的回调函数
 * 3、创建一个script标签并插入到页面中
 * 4、挂载回调函数
 * **/

// (function(window, document) {
//     var jsonp = function(url, data, callback) {
//         var dataString = url.indexof('?') === -1 ? '?' : '&';
//         for (let key in data) {
//             dataString += key + '=' + data[key] + '&';
//         }

//         var cbFuncName = 'my_json_cb_' + Math.random().toString().replace('.', '');
//         dataString += 'callback=' + cbFuncName;

//         var scriptEle = document.createElement('script');
//         scriptEle.src = url + dataString;

//         window[cbFuncName] = function(data) {
//             callback(data);

//             // 处理完回调函数的数据之后，删除jsonp的script标签
//             document.body.removeChild(scriptEle);
//         }

//         document.body.appendChild(scriptEle);
//     }

//     window.$jsonp = jsonp;
// })(window, document)