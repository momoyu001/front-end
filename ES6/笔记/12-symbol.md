# Symbol

- 表示独一无二的值，一种类似于字符串的数据类型。
- 原始数据类型
- 它的唯一性是我们不可见的
- 至此，对象的属性名现在可以 有两种类型，一种是原来就有的字符串，另一种是新增的Symbol类型。凡是属性名属于Symbol类型的，就都是独一无二的，可以保证不会与其他属性名产生冲突。
```
let s1 = Symbol('1')
let s2 = Symbol('1')

s1 === s2;  // false
```

- `Symbol.for()`创建。
    - 这种方式创建的symbol值，我们可以通过描述字符串，来得出唯一的symbol值
    ```
        let s3 = Symbol.for('as');
        let s4 = Symbol.for('as');

        s3 === s4;  // true
    ```
    - Symbol.for()方法，会被登记在全局环境中供搜索。Symbol()方法则不会。
    ```
        let sys1 = Symbol('foo');
        let sys2 = Symbol.for('foo');
        console.log(sys1 === sys2);

        let sys3 = Symbol.for('too');
        let sys4 = Symbol.for('too');
        console.log(sys3 === sys4);
    ```
    - 这种登记是全局的，不管有没有全局环境中运行。
    - 全局登记的特性，可以用在不同的iframe或者service worker中取到同一个值。

- `Symbol.keyFor()`方法返回一个已登记的Symbol类型值的key
    ```
        let aaa = Symbol.for('aaa123');
        console.log(Symbol.keyFor(aaa));
    ```

- 不能与其他数据进行运算，比较。(包括在模板字符串中使用，也会报错)

- 可以显示的转为字符串。
    ```
    let sym = Symbol('My Symbol');
    sym.toString();
    ```

- 可以转换为布尔值，但并不能转换为数值。

- `Symbol.prototype.description`：获取symbol的描述
    ```
        const sym = Symbol('foo');
        console.log(sym.description);   // foo
    ```

- 使用场景：给对象添加属性和方法。
    ```
    // 在可能不知道game里面具体有什么的时候
    let game = {

    }

    let methods = {
        up: Symbol(),
        down: Symbol()
    }

    game[methods.up] = function () {
        console.log('改变形状');
    }

    game[methods.down] = function () {
        console.log('123')
    }

    game[methods.up](); // 改变形状

    ```
    ```
    let youxi = {
        name: '狼人杀',
        [Symbol('say')]: function () {
            console.log('发言');
        },
        [Symbol('zibao')]: function () {
            console.log('ddd');
        }
    }
    ```

- 对象的点运算符，后面总是字符串；在对象内部使用Symbol值定义属性时，Symbol值必须放在方括号之中。

- Symbol作为属性名，遍历对象的时候，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames`、`JSON.stringify`返回。

- `Object.getOwnPropertySymbols()`方法可以获取指定对象的所有用作属性名的Symbol值。

- `Reflect.ownKeys()`可以返回所有类型的键名，包括常规键名和Symbol键名。

- 可以使用Symbol来定义一些，非私有的，又希望只用于内部的方法。

- **内置的Symbol值，指向语言内部使用的方法。**
    **symbol的各个属性，整体作为对象的的属性存在，来改变对象再特定场景下的表现**

    - `Symbol.hasInstance`：指向一个内部方法。在一个对象调用`instanceof`时自动调用
    ```
        foo instanceof Foo
        // 等价于
        Foo[Symbol.hasInstance](foo)
    ```
    ```
    const Even = {
        [Symbol.hasInstance](obj) {
            return Number(obj) % === 0;
        }
    }

    // 调用 instanceof 的时候，自动调用了自己写的那个方法
    1 instanceof Even;  // false
    2 instanceof Even;  // true
    ```

    - `Symbol.isConcatSpreadable`：该属性等于一个布尔值，表示该对象用于`Array.proptotype.concat`时，是否可以展开。数组的默认行为是可以展开的，该属性值默认等于undefined。类数组对象默认是不展开的。

    - `Symbol.species`：该属性指向一个构造函数。创建衍生对象时，会使用该属性。创建衍生对象时，会使用这个属性返回的函数作为构造函数。定义该属性时，要使用`get取值器`。
        ```
        // 默认的Symbol.species的写法
        static get [Symbol.species]() {
            return this;
        }
        ```
    
    - `Symbol.match`：该属性，指向一个函数。当执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值。
        ```
        String.prototype.match(regexp)
        // 等同于
        regexp[Symbol.match](this)

        class Matcher {
            [Symbol.match](string) {
                return 'hello world'.indexOf(string);
            }
        }

        'e'.match(new Matcher);   // 1
        ```

    - `Symbol.replace`: 指向一个方法，当该对象被`String.prototype.replace`方法调用的时候，会返回该方法的返回值。
    - `Symbol.search`：指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值。
    - `Symbol.split`：指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值。
    - `Symbol.iterator`：指向该对象的默认遍历器方法。`for...of`循环时会调用。
    - `Symbol.toPrimitive`：指向一个方法，该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。
        - Number：转换为数值
        - String：转换为字符串
        - Default：转换成数值或者字符串
    - `Symbol.toStringTag`：调用`Object.prototype.toString`方法时，若这个属性存在，他的返回值会出现在toString方法的返回的字符串之中，表示对象的类型。也就是说，这恶鬼属性可以用来指定`[object Object]`或`[object Array]`中`object`后面的字符串。
    - `Symbol.unscopabled`：指向一个对象，该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除。