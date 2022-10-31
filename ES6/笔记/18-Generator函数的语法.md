# Generator函数的语法

## 简介
ES6提供的一种异步编程解决方案。

形式上，Generator函数是一个普通函数，但是有两个特征。
- `function`关键字与函数名之间有一个星号`*`
- 函数体内部使用`yield`表达式，定义不同的内部状态
    ```
    function* hello() {
        yield 'hello';
        yield 'world';
        return 'ending';
    }
    ```
    调用之后，函数并不立即执行，返回的是一个遍历器对象。
    ```
        // 这个函数有四个状态 red green  blue  end
        function* helloWorld() {
            console.log('执行了1...');
            yield 'red';
            console.log('执行了2...');
            yield 'green';
            console.log('执行了3...');
            yield 'blue';
            console.log('执行了4...');
            return 'end';
        }

        let func1 = helloWorld();   // 返回的func1是一个遍历器对象，该对象本身也具有Symbol.iterator属性，执行之后返回自身
        console.log(func1.next());  // 执行  从函数头部开始到到第一个 yield 结束
        console.log(func1.next());  // 执行  从上一个yield技术后开始，到这一个yield结束；
        console.log(func1.next());
    ```
- Generator函数内部可以不用`yield`关键字，此时就变成了一个单纯的暂缓执行函数， `.next()`的时候才会真正返回结果
- `yield`表达式只能用在Generator函数里面，用到其他地方会报错。
- `yield`表达式如果用在另一个表达式中，要加上圆括号。
    ```
    console.log('asd' + (yield 123))
    ```
- `yield`表达式如果用作函数参数或者赋值表达式的右边，可以不加括号。

## next方法的参数
- yield本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当做上一个yield表达式的返回值。
- Generator函数从暂停状态到恢复运行，它的上下文状态是不变的。
- V8引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。

## Generator.proptotype.throw()
函数体外抛出错误，函数体内捕获错误。

如果Generator内部没有部署`try ... catch`代码块，那么throw方法抛出的错误，将被外部的`try ... catch`代码块捕获。

throw方法抛出的错误要被内部捕获，前提是必须至少执行过一次next方法。第一次执行next方法，等同于启动执行Generator函数的内部代码，否则，代码还没执行，抛出的错误只能被外部捕获。

.throw()被捕获之后，自动执行了一次next方法。

只要Generator函数内部部署了try...catch代码块，那么遍历器的throw方法不影响下一次遍历。
```
        function* errorFunc() {
            try {
                yield console.log('a');
            } catch(e) {
                console.log('内部捕获', e)
            }

            yield console.log('b');
            yield console.log('c');
        }

        let func2 = errorFunc();
        func2.next();   // a
        func2.throw();  // b
        func2.next();   // c  抛出了错误，但不影响下一次遍历
```

内部没有部署错误捕获，报错之后函数就停止执行了。再继续调用next方法，就返回{ value: undefined, done: true }

## Generator.prototype.return()
返回指定的值，并且终结遍历Generator函数

如果函数内部有`try ... finally`代码块，执行return方法后会立即执行finally代码块，等到finally代码块执行完之后，才会返回return方法指定的返回值。

## yield*
用来在一个Generator函数内部执行另一个Generator函数
```
        function* foo() {
            yield console.log('1');
            yield console.log('2');
            yield console.log('3');
        }

        function* bar() {
            yield console.log('4');
            yield* foo();
            yield console.log('5')
        }

        let func3 = bar();
        func3.next();
        func3.next();
        func3.next();
        func3.next();
        func3.next();
        func3.next();
```

yield* 可以很方便的取出嵌套数组的所有成员
```
        function* iterTree(tree) {
            if (Array.isArray(tree)) {
                for (let i = 0; i < tree.length; i++) {
                    yield* iterTree(tree[i]);
                }
            } else {
                yield* tree
            }
        }

        const tree = ['1', ['2', '3'], ['4', '5', '6'], '7'];

        for(let item of iterTree(tree)) {
            console.log(item)
        }

        console.log([...iterTree(tree)]);
``` 

## Generator函数的 this
Generator函数返回的总是遍历器对象，而不是this对象。

Generator函数也不能跟new命令一起用，会报错。

生成一个空对象，使用call方法绑定Generator函数内部的this，这样，构造函数调用以后，这个空白对象就是Generator函数的实例对象了，可获得Generator函数的this。此时遍历器对象和生成的对象实例时各自独立的两个，将空白对象变为prototype可以实现两个对象的统一。


