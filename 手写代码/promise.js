// promise基础结构
function Promise(executor) {
    // 内部变量托管this。需要在前面就声明好，在使用到的地方之前就声明，let没有变量提升
    let _this = this;
    // 状态 pending、resolved、rejected
    this.state = 'pending';
    // 执行成功的结果
    this.value = undefined;
    // 执行失败的元婴
    this.reason = undefined;

    /**
     * 为了满足异步需要而做的处理：
     * **/
    // 保存成功的回调
    this.onResolvedCallbacks = [];
    // 保存失败的回调
    this.onRejectedCallbacks = [];

    // 初始化实例就立即执行
    try {
        executor(resolve, reject);
    } catch(err) {
        reject(err);
    }

    function resolve(value) {
        if (_this.state === 'pending') {
            _this.state = 'resolved';
            _this.value = value;
            // 遍历执行成功的回调
            _this.onResolvedCallbacks.forEach(callback => callback(value));
        }
    };
    
    function reject(reason) {
        if (_this.state === 'pending') {
            _this.state = 'rejected';
            _this.reason = reason;
            _this.onRejectedCallbacks.forEach(callback => callback(reason));
        }
    };
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    // 当then方法中没有任何回调时，我们需要吧接收到的值继续传递下去：判断回调参数不为函数时，把他变成回调函数返回普通值即可
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => {
        throw err
    };

    // 每一个then方法都需要返回一个promise对象，这里创建一个promise对象，接着在每个执行函数处，使用try...catch...语法
    let promise2 = new Promise((resolve, reject) => {
        // 处理pending状态下的情况：异步的情况下，执行。then方法时，状态可能还在pending
        if (this.state === 'pending') {
            // if (typeof onFulfilled === 'function') {
            //     this.onResolvedCallbacks.push(onFulfilled);
            // }

            // if (typeof onRejected === 'function') {
            //     this.onRejectedCallbacks.push(onRejected);
            // }

            this.onResolvedCallbacks.push(() => {
                queueMicrotask(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            })

            this.onRejectedCallbacks.push(() => {
                queueMicrotask(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            })
        }

        // onFulfilled 和 onRejected两个参数不是必选的，所以做了两层判断
        if (this.state === 'resolved') {
            // if (typeof onFulfilled === 'function') {
            //     onFulfilled(this.value);
            // }

            // try {
            //     let x = onFulfilled(this.value);
            //     resolve(x);
            // } catch(err) {
            //     reject(err);
            // }

            queueMicrotask(() => {
                try {
                    let x = onFulfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch(err) {
                    reject(err);
                }
            })
        }

        if (this.state === 'rejected') {
            // if (typeof onRejected === 'function') {
            //     onRejected(this.reason);
            // }
            queueMicrotask(() => {
                try {
                    let x = onRejected(this.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        }
    })

    return promise2;
};


Promise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
}

// 一个新的方法开处理then方法返回值来生成新的promise对象
/**
 * 解析then的返回值与新的promise对象
 * @param {Object} 新的promise对象，就是我们创建的promise2实例
 * @param {*} x 上一个then的返回值
 * @param {Function} resolve promise2处理器函数的resolve
 * @param {Function} reject promise2处理器函数的reject
 * **/
function resolvePromise(promise2, x, resolve, reject) {
    // 1、避免循环引用，当then的返回值与新生成的promise对象为同一个的时候，抛出异常
    if (promise1 === x) {
        reject(new TypeError('请避免Promise循环引用'));
    }

    let called;
    // 2、判断 x 的类型，分情况处理
    // 当 x 是一个promise对象，就执行它，如果x是一个对象或者函数，再进一步处理它，否则就是一个普通值
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 可能是个对象或者函数
        try {
            // 如果是个对象，尝试将对象上的then方法取出来，报错则转换为失败态
            // 如果对象中有then，且then是函数类型，就可以认为是一个promise对象，之后，使用x作为其this来调用执行then方法。
            let then = x.then;

            if (typeof then === 'function') {
                // then是function，那么执行promise
                then.call(
                    x,
                    (y) => {
                        // 4、规范中定义如果resolvePromise和rejectPromise都被调用，或者多次调用同一个参数，第一个调用优先，任何进一步的调用都将被忽略，因此设定一个called来防止多次调用。
                        if (called) return;
                        called = true;

                        // 3、当promise成功或者失败的时候，传入的还是一个promise对象，此时应该继续执行，直到最后的promise执行完。
                        // 采用递归的方式，知道解析promise成一个普通值为止
                        resolvePromise(promise2, y, resolve, reject);
                        // resolve(y);
                    },
                    (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                )
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        // 是个普通值
        resolve(x);
    }
}

// promises-aplus-tests测试q
Promise.defer = Promise.deferred = function () {
    let defer = {}
    defer.promise = new Promise((resolve, reject) => {
      defer.resolve = resolve
      defer.reject = reject
    })
    return defer
  }
  try {
    module.exports = Promise
  } catch (e) {}
  
