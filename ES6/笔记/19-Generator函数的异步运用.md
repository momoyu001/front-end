# Generator函数的异步运用

异步： 一个任务不是连续完成的，可以理解为该任务被人为分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头来执行第二段。

Generator函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外还因为：函数体内外的 数据交换和错误处理机制。

`next()`：既返回函数内部值，也可以向内部传值。

`Thunk`函数，是 自动执行Generator函数的一种方法。
    ```
    const thunk = function(fn) {
        return function(...args) {
            return function (callback) {
                return fn.call(this, ...args, callback);
            }
        }
    }
    ```
    - 传名调用 的实现，往往是将参数放到一个临时函数之中，再将这个函数传入函数体。这个临时函数就是thunk函数。用来替换某个表达式。
        ```
        function f(m) {
            return m * 2;
        }

        f(x + 5);

        // 等同于

        let thunk = function () {
            return x + 5;
        }

        function f(thunk) {
            return thunk() * 2;
        }
        ```
    - 在JavaScript中，退还款函数替换的不是表达式，而是多参数函数，将其替换为一个只接受回调函数作为参数的单参数函数
    - 任何函数，只要参数有回调函数，就能写成Thunk函数的形式。
    - 可以自动执行Generator函数