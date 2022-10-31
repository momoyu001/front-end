# Promise 对象
## 含义
简单来说，promise就是一个容器，里面保存着某个未来才会结束的事件的结果（通常是异步操作的结果）。从语法上来说，promise是一个对象，从它可以获取异步操作的消息。

## 基本语法
ES6规定，Promise对象是一个构造函数，用来生成Promise实例。

构造函数接受一个函数作为参数，这个函数的两个参数分别为resolve和reject。

Promise实例生成之后，可以用then方法分别指定resolved状态和rejected状态的回调函数。第二个参数是可选的。

Promise实例创建的这部分会立即执行
```
// 创建promise实例的这部分会立即执行
const promise = new Promise((resolve, reject) => {
    if (...) {
        resolve(value);
    } else {
        reject(reason);
    }
})

// promise对象的状态变更之后，就会触发then方法绑定的回调函数
promise.then(
    (value) => {        // promise对象状态变为resolved时调用；接收promise对象传出的值作为参数
        console.log('成功了');
    },
    (reason) => {       // 这个参数是可选的...，promise对象状态变为rejected时调用；接收promise传出的值作为参数
        console.log('失败了');
    }
)
```

resolve函数的参数除了正常的值以外，还可能是另一个Promise实例。
```
const p1 = new Promise(function (resolve, reject) {
    // ...
})

const p2 = new Promise(function (resolve, reject) {
    // ...
    // 回调函数的参数是另一个promise实例，一个异步操作的结果是返回另一个异步操作。
    resolve(p1);
})
```
此时，p1的状态会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态pending，那么p2的回调函数会等待p1的状态改变。如果p1的状态已经是resolved或者rejected，那么p2的回调函数就会立刻执行。由于返回的是另一个promise，导致p2自己的状态失效了，由p1的状态决定p2的状态。

resolve或者reject并不会终结Promise的参数函数的执行。
```
    new Promise((resolve) => {
        resolve(1);
        console.log(2);
    }).then((data) => {
        console.log(data);
    })

    // 输出顺序：2 1

    new Promise((resolve) => {
        return resolve(1);
        console.log(2); // 2 不会再输出
    }).then((data) => {
        console.log(data);
    })

    // 输出顺序：1。
```

## Promise.prototype.then()
- 作用：为promise实例添加状态改变时的回调函数。then方法返回的是一个新的Promise实例（注意：不是原来的那个promise实例），因此可以链式调用。
- 链式调用的then，有时，前一个回调函数有可能返回的还是一个Promise对象(即有异步操作)，这时后一个函数，就会等待该promise对象的状态改变才会被调用。

## Promise.prototype.catch()
- 该方法是`.then(null, rejection)` 或 `.then(undefined, rejection)`的别名。用于指定发生错误时的回调函数。
- reject()方法的作用，等同于抛出错误。
- then方法中指定的回调函数，如果运行中抛出错误，也会被`catch`方法捕获。
- 如果promise的状态变成resolved，再抛出错误是无用的，因为Promise的状态一旦改变，就永久不会改变了。
- promise对象的错误具有‘冒泡’性质，会一直向后传递，知道被捕获为止，也就是说，错误总是会被下一个catch语句捕获.
- 一般来说，不要在then方法里面定义Reject状态的回调函数(即then的第二个参数)，总是使用catch方法。
- 与`try/catch`不同的是，如果没有使用catch方法指定错误处理的回调函数，Promise对象抛出的错误不会传递到外层代码，即不会有任何反应。
- `catch方法返回的还是一个promise对象，后面还可以接着调用then方法`。

## Promise.prototype.finally()
- finally用于指定不管Promise对象最后状态如何，都会执行的操作。
- finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的Promise状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于Promise的执行结果。
- `finally本质上then方法的特例。`不写finally也可以，需要用then方法，成功和失败的回调都要写出来。
- finally的实现：
    ```
    Promise.prototype.finally = function(callback) {
        let P = this.constructor;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason })
        )
    }
    ```
- finally总是会返回原来的值：
    ```
    // resolve 的值是 undefined
    Promise.resolve(2).then(() => {}, () => {})

    // resolve 的值是 2
    Promise.resolve(2).finally(() => {})
    ```

## Promise.all()
- 用于将多个Promise实例，包装成一个新的promise实例。
- 接收一个数组作为参数，数组中的 每一项都是Promise实例，如果不是，会在内部先调用Promise.resolve()将参数转换为Promise实例，再进一步处理。
- 参数除了数组，也可以接收具有Iterator接口的 参数，且返回的每一个成员都是Promise实例。
```
const p = Promise.all([p1, p2, p3]);
```
- p的状态由p1 p2 p3决定
    - 所有实例都变成fullfiled，p的状态才会变成fullfiled，所有实例的返回值，组成一个数组，会传递给p的回调函数。
    - 只要有一个实例被rejected，p的状态就会变成 rejected，第一个被rejected的实例的返回值，会传递给p的回调函数。
        - 如果作为参数的promise实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
        - p1 - resolved; p2 - rejected;p2的catch方法返回的是一个新的promise实例，p2指向实际上是这个新的实例，该实例执行完catch方法之后，也会变成resolved，导致promise.all()方法参数里面两个实例都是resolved，因此会调用then方法里面的东西，而不会调用catch方法。
        ```
        const p1 = new Promise((resolve, reject) => {
            resolve('hello');
        })
        .then(result => result)
        .catch(e => e);

        const p2 = new Promise((resolve, reject)=> {
            throw new Error('报错了');
        })
        .then(result => result)
        .catch(e => e);

        Promise.all([p1, p2]).then(result => {
            console.log(result);    // 这里输出
        }).catch(e => {
            console.log(e);
        })


        const p1 = new Promise((resolve, reject) => {
            resolve('hello');
        })
        .then(result => result)
        .catch(e => e);

        const p2 = new Promise((resolve, reject)=> {
            throw new Error('报错了');
        })
        .then(result => result)

        Promise.all([p1, p2]).then(result => {
            console.log(result);
        }).catch(e => {
            console.log(e); // 这里输出
        })
        ```

## Promise.race()
```
const p = Promise.race([p1, p2, p3]);
```
- 只要有一个实例发生状态的改变，p的状态就会跟着改变，那个先改变的Promise实例的返回值，就会传递给p的回调函数。
- 请求超时的例子：
    ```
        // 5秒内还没有返回接口的响应，就将promise的状态变为rejected
        const p = Promise.race([
            fetch('/url'),
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('请求超时！')), 5000);
            })
        ]);

        p.then(() => {
            console.log('请求成功');
        }).catch(() => {
            console.log('请求失败');
        })
    ```

## Promise.allSettled()
- 接收一组Promise实例作为参数，包装成一个新的Promise实例，只有等到所有结果都返回，不管是fulfilled还是rejected，包装的实例才会结束。
- 一旦结束，状态总是fulfilled，不会是rejected。
- `该方法返回新的Promise实例`
- Promise的监听函数，接收到的是一个数组。(与Promise.all（）的结果类似，一个数组)，每个数组元素都对应一个传入Promise.allSettled()的Promise实例。每个实例都是一个对象，每个 对象都有status属性，有value或者reason属性。
    ```
        const p3 = new Promise((resolve, reject) => {
            resolve(100);
        })

        const p4 = new Promise((resolve, reject) => {
            reject(-1);
        })

        const pArr1 = Promise.allSettled([p3, p4]);

        pArr1.then((result) => {
            console.log(result);
        })
    ```
- 只关心有没有结束，不关心执行的结果 - Promise.allSettled()方法。

## Promise.any()
- 接收一组Promise实例作为参数，包装成一个新的Promise实例，只要参数有一个`fulfilled`状态，包装实例就会变成`fulfilled`。如果所有参数实例都变成`rejected`，包装实例就会变成`rejected`状态。
- 当.any()状态变为rejected时，抛出的错误，是一个特殊的错误，是每一个成员对应一个被`rejected`的操作所抛出的错误。

## Promise.resolve()
- 将现有对象转为Promise对象。
```
Promise.resolve('foo')
// 等价于
new Promise((resolve) => resolve('foo'))
```
- 参数：
    - 参数是一个Promise实例
        - 原封不动的返回这个对象
    - 参数是一个`thenable`对象 - 有`then`方法的对象
        - 将这个参数转为Promise对象，然后立即执行里面的`then`方法
    - 参数不是具有`then`方法的对象，或根本就不是对象
        - 返回一个新的Promise对象，状态为`resolved`
    - 不带有任何参数
        - 直接返回一个`resolved`状态Promise对象
- **立即`resolve()`的Promise对象，是在本轮‘事件循环’的结束时执行，而不是在下一轮‘事件循环’的开始时。**


## Promise.rejected()
- 返回一个新的 Promise实例，该实例的状态为`rejected`
```
Promise.reject('出错了')
// 等同于
new Promise((resolve, reject) => reject('出错了'));

```
- **该方法的参数，会原封不动的作为`reject`**

## Promise.try()
- 在不知道或不想区分，函数`f`是同步还是异步的情况下，但是想用Promise来处理它，因为这样就可以不管`f`是否包含异步操作，都用`then`方法指定下一步流程，用`catch`方法处理抛出的错误。
- 事实上，该方法模拟的就是`try...catch`代码块，就像`promise.catch`模拟是`catch`代码块



# Promise面试题节选
- 了解Promise吗
    - Promise是一种异步编程解决方案
- Promise解决的痛点是什么？
    - 回调地狱：代码臃肿、可读性差、难以维护、易产生bug
- Promise解决的痛点还有其他方法可以解决吗？如果有，请举例。
- Promise如何使用？
- Promise常用的方法有哪些？他们的作用是什么？
    - 
- Promise在事件循环中执行过程是怎么样的？
- Promise的业界实现有哪些？
    - Q、bluebird（号称是运行最快的类库）、
- 能不能手写一个Promise的pplyfill？
## Promise的出现
- 为了解决回调地狱