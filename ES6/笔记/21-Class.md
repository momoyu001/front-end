# Class - 类
```
Class Point {
    contructor(name) {
        this.name = name;
    }

    toString() {
        console.log(this.name);
    }
}

```

类的数据类型就是函数，类本身指向构造函数。类的所有方法都定义在类的`prototype`上面。

prototype的constructor属性，直接指向‘类’本身。

类的内部定义所有方法都是不可枚举的。

constructor 方法是类的默认方法，没有显示定义时，会默认添加一个空的constructor方法。

默认返回对象实例（即`this`)，完全可以指定返回另一个对象。

实例的属性如果不是显示的定义在其本身（this上），否则全都是定义在原型上（即定义在Class上） - 与ES5是一致的

类的所有实例都共享一个原型对象。可以使用`__proto__`属性来为类添加方法。Object.getPrototypeOf来获取__proto__，不建议直接使用__proto__。

在类的内部，可以使用`get`、`set`关键字。对**某个属性**设置存值函数取值函数，拦截该属性的存取行为。存值函数和取值函数是设置在属性的`Descriptor`对象上的 - Object.getOwnPropertyDescriptor()。

类的属性名，可以使用表达式：[表达式]() {}

Class可以使用表达式的形式来定义
```
        // 表达式的声明Class
        // Me只能在内部使用 - 知道当前类，外部使用的时候，只能使用MyClass1
        const MyClass1 = class Me {
            constructor(name) {
                this.name = name;
                log(name);
            }

            getName() {
                return Me.name
            }
        }

        let class2 = new MyClass1('张三');

        // 简写形式的
        const MyClass2 = class {

        }

        // 立即执行的Class
        const class1 = new Class {

        }
```

**注意**
类和模块的内部，默认就是严格模式

不存在变量提升。与ES5不同。
```
new Foo();  // 报错
class Foo {}
```

name属性：Class.name

## 类的静态方法

在方法前加上`static`关键字，该方法不会被实例继承，而是直接通过类来调用 - 静态方法。

如果静态方法中包含this关键字，这个this指向的是类，不是类的实例。

```
        class StaticClass {
            // 定义在类的顶层的实例属性。
            count = 0;
            constructor(name) {
                this.name = name;
            }

            static getName() {
                log('静态方法');
                this.bar()
            }

            getName() {
                log('实例方法')
                this.bar()
            }

            bar() {
                log('实例的 - bar 方法');
            }

            static bar() {
                log('类的 - bar 方法');
            }
        }

        let class3 = new StaticClass('huqiqi');
        StaticClass.getName();
        class3.getName();
        log(class3.count);  // 0
```

父类的静态方法，可以以被子类继承。

## 实例属性的定义
实例属性可以定义在`constructor`方法里面，也可以定义在类的最顶层。

## 静态属性 - 只能由类访问，实例不能访问
指的是Class本身的属性，即Class.propName，而不是定义在实例对象(this)上的属性。
```
class MyClass {

}

// 类的静态属性
MyClass.prop = 1;
console.log(MyClass.prop);
```

提案：在类的内部通过static关键字来定义静态属性。

## 私有属性和私有方法 - `#` - 只能 在类的内部使用
提案：在属性名之前加上 # ，标识这个属性是私有的，外部访问会报错。
提案：在方法名之前加上 # ，标识这个方法时私有的，外部访问会报错。

```
        class PrivateClass {
            #count = 1000;
            name = '我是prop'

            getCount() {
                return this.#count;
            }

            runMethod() {
                this.#outter();
            }

            #outter() {
                log('我是私有方法');
            }
        }

        let pClass1 = new PrivateClass();
        log(pClass1.getCount());
        log(pClass1.name);
        // pClass1.#outter();   // 报错
        pClass1.runMethod();
```
只要是在类的内部，实例也可以引用私有属性。

私有属性和私有方法之前，也可以加上static关键字，表示这是一个静态的私有属性或私有方法。


## new.target 属性
用于构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令或者Rflect.construct()调用的，new.target会返回undefined。

该属性可以用来确定构造函数是怎么调用的。

```
function Person (name) {
    if (new.target === Person) {
        this.name = name;
    } else {
        throw new Error('必须使用new命令生成实例。')
    }
}
```

子类继承父类时，new.target会返回子类。可以利用该特点，实现某些不能被实例化，只能被继承之后才能使用的类。
