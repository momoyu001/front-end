# async函数

Generator的语法糖。就是将 `*` 替换成 `async`；将 `yield` 替换成 `await`

`async`返回的是Promise对象，可以作为`await`命令的参数。async内部`return`语句返回的值，会成为`then`方法回调函数的参数。

async的多种使用形式：
- 函数声明：
    ```
    async function foo() {}
    ```
- 函数表达式
    ```
    const foo = async function() {}
    ```
- 对象的方法
    ```
    let obj = { async function() {} }
    ```
- class方法
    ```
    class Storage {
        async add() {

        }
    }
    ```
- 箭头函数
    ```
    const foo = async () => {}
    ```

## 错误处理机制 - 难点
async内部错误，会导致返回的promise变为reject状态。抛出的错误对象会被catch方法回调函数接收到。

async函数返回的Promise对象，必须等到内部所有await命令后面的Promise对象执行完，才会发生状态改变。只有内部的异步操作执行完，才会执行then方法指定的回调。

await命令之后，如果不是Promise对象，就直接返回对应的值。`await return 123` 相当于  `return 123`

任何一个await语句后面的Promise对象变为reject状态，那么整个async函数都会中断执行。如果await后面的异步操作出错，等同于async函数返回的Promise对象被reject。最好把await命令放在`try...catch`代码块中。

await命令只能用在async函数中，用在普通函数中会报错。

## 实现原理
将Generator函数和自动执行器包装在一个函数里。
```
async function fn(arg) {

}

// 等同于

function fn(arg) {
    // 这个spawn函数就是自动执行器
    return spawn(function* () {

    })
}
```

## 顶层await - 提案阶段
在加载某些模块时，当模块内部有异步操作时，可以单独使用await来等待执行外再加载。

当加载多个包含顶层await命令的模块时，加载命令是同步执行的。