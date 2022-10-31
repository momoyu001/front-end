# Class的继承
`extends`关键字来实现继承。

子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的是属性和方法，然后在对其进行加工，加上子类自己的实例和方法。如果不调用super方法，子类就得不到this对象。

ES5的继承：先创建子类的this，再将父类的方法添加到this上面 - Parent.apply(this)

ES6的继承：先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this

在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于父类实例的，只有super方法才可以调用父类实例。

父类静态方法也会被子类继承。

**Object.getPrototypeOf**可以用来从子类上获取父类，使用这个方法，可以判断，一个类是否继承了另一个类。

## super关键字
super关键字，既可以当做函数使用，也可以当做对象使用
- 函数使用：代表父类的构造函数。Parent.prototype.constructor.call(this)。在子类中执行super()返回的是子类的实例。只能在子类的构造函数中使用。

- 对象使用：
    - 在`普通方法`中，指向`父类的原型对象` - Parent.prototype，在`静态方法`中，指向`父类`。
    - ES6规定，在子类`普通方法`中通过super调用父类的方法时，方法内部的 this 指向当前的`子类实例`。子类`静态方法`中通过super调用父类方法时，方法内部的this指向`子类`，而不是子类的实例。
    - 如果通过super对某个属性赋值时，这时super就是this，赋值的属性会变成子类实例的属性。
- 使用super时，必须显式的指定是作为函数使用、还是作为对象使用。
- 由于对象总是继承其他对象的，所以在任意一个对象中，使用super关键字。
    ```
        // 先改写对象原型上的toString方法
        Object.prototype.toString = function() {
            return '对象原型上的toString方法 ---' + this.name;
        }

        // 这个普通对象，继承自对象原型，也继承了toString方法
        let Obj = {
            name: '我是普通对象的name',
            toString() {
                console.log('我是对象的toString方法');
                // 普通方法内 以 对象 的形式来调用super，调用父类的toString方法，方法内部的this指向当前的子类实例。
                return super.toString(); // 对象原型上的toString方法 --- 我是普通对象的name
            }
        }

        log(Obj.toString());
    ```

```
        const { log } = console;
        class Parent {
            constructor(name) {
                this.name = name;
                log('我是父类的构造函数...   ', name);
            }

            getName() {
                return '父类 - name';
            }
        }

        class Child extends Parent {
            constructor(name, age) {
                super(name);
                this.age = age;
                log('我是子类的构造函数...   ', name, age);
            }

            getName() {
                return '子类 - name';
            }
            
            getParentName() {
                return super.getName();
            }
        }

        class SubChild extends Child {
            constructor(name, age, country) {
                super(name, age);
                this.country = country;
                log('我是子子类的构造函数...   ', name, age, country);
            }

            getName() {
                return '子子类 - name';
            }

            getParentName() {
                return super.getName();
            }
        }

        let instance1 = new Parent('张三');
        let instance2 = new Child('李四', 20);
        let instance3 = new SubChild('王五', 30, '中国');

        log('--------super作为对象使用--------');
        log(instance2.getParentName());
        log(instance3.getParentName());
```

## 类的prototype属性和__proto__属性
大多数浏览器对ES5的实现中，每个对象都有一个`__proto__`属性，指向对应的构造函数的`prototype`属性。Class作为构造函数的语法糖，同时有prototype和__proto__属性，因此同时存在两条继承链。

- **子类的__proto__属性，表示构造函数的继承，总是指向父类** ---> **子类的原型就是父类**
- **子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性** ---> **子类的原型对象就是父类原型对象的实例**
- 理解：子类B的原型(__proto__属性)是父类A；子类B的原型对象(prototype属性)是父类的原型对象的实例。B.prototype = Object.create(A.prototype);
        ```
        class A {
            constructor() {
                console.log('A构造函数');
            }
        }
        class B extends A {
            constructor() {
                super();
                console.log('B构造函数');
            }
        }

        // log(B.__proto__ === A); // true
        // log(B.prototype.__proto__ === A.prototype); // true

        let a1 = new A();
        let b1 = new B();

        // a1 的 __proto__ 属性，指向的是A类的构造函数的 prototype属性
        log(a1.__proto__ === A.prototype)
        ```

- 类的继承的实现:
    ```
        class P1 {}
        class P2 {}

        // p2的实例继承p1的实例
        Object.setPrototypeOf(P2.prototype, P1.prototype);
            |
        P2.prototype.__proto__ = P1.prototype;

        // p2继承p1的静态属性
        Object.setPrototypeOf(P2, P1);
            |
        P2.__proto__ = P1;
    ```
- setPrototypeOf()的实现
    ```
        Object.setPrototypeOf = function (obj, proto) {
            obj.__proto__ = proto;
            return obj;
        }
    ```

### 实例的__proto__属性

**子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。也就是说子类实例的原型的原型，是父类的原型**
```
let p1 = new Point()
let p2 = new ColorPoint()

p1.__proto__ === p2.__proto__;   // false
p2.__proto__.__proto__ === p2.__proto__;    // true
```

## 原生构造函数的继承
原生构造函数 - 语言内置的构造函数，通常哟昂莱生成数据结构。
```
Boolean()
Number()
String()
Array()
Date()
Function()
RegExp()
Error()
Object()
```

ES5中，ES5的继承，是先新建子类的实例对象this，再将父类的属性添加到子类上。由于父类的内部属性无法获取，导致无法继承原生的构造函数。

ES6中，允许原生构造函数定义子类，因为ES6中，是先新建父类的实例对象this，然后再调用子类的构造函数修饰this。使得父类的所有行为都可以继承。

## Mixin模式
Mixin指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。
```
let a = {}
let b = {}

let c = { ...a, ...b};
```


