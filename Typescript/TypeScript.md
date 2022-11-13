[ts面试题总结](https://juejin.cn/post/6988763249982308382)

# TypeScript

- 基础类型
    - boolean
    - number
    - string
    - undefined
    - any
    - 数组
    - 元组
- 函数类型
    - 可选参数
    - 函数表达式
    - 函数赋值
- interface
    - 基本概念
    - 可选属性
    - 只读属性
    - interface描述函数类型
    - 自定义属性
    - duck typing的理解
- class
    - 基本写法
    - 继承
    - 多态
    - plubic
    - private
    - protected
    - static
- interface和class的关系
    - implements
    - 处理公共属性和方法
    - 约束构造函数和静态属性
- never:表示永远不会有值的类型
  - never类型是哪些总是会抛出异常或者根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型
  - 永远不可能存在的情况
  - 任何类型都不能赋值给never类型的变量

## 基础类型
- 默认情况下，null和undefined是所有类型的子类型。就是说，可以吧null和undefined赋给number类型的变量。但如果指定了`strictNullChecks`标记，null和undefined只能赋值给void和他们各自，否则会报错

- 数组类型
    ```
        let list: number[] = [1, 3, 5]
    ```
- 如果数组想每一项放入不同类型的数据，用元组类型
- 元组类型允许表示一个已知元素数量和类型的数组，各个元素的类型不必相同
    ```
    let test: [number, string] = [10, 'test'];
    ```

## 泛型
`<>`、`T` ---> 只要一看到`<>`，就知道这是泛型

类型变量,是一种特殊的变量,只用于表示类型而不是值.

```js
// T  就是类型变量
function identity<T>(arg: T): T {
    return arg;
}
```

泛型函数的类型与非泛型函数的类型没什么不同,只是有一个类型参数在最前面,像函数声明一样.

```js
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;

// <T>(arg: T) => T  --- 泛型函数类型

function setName(name: string): String {
    return 'name...';
}

let mySetName: (name: string) => string = setName;

// (name: string) => string --- 普通函数类型
```

### 泛型接口
```js
interface GenericIdentityFn {
    <T>(arg: T): T
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

### 泛型类
直接把泛型类型`T`放到类的后面,可以帮助我们确认类的所有属性都在使用相同的类型
```js
class GenericNumber<T> {
    zeroValue: T,
    add: (x: T, y: T) => T
}
```

### 泛型约束
```js
interface Lengthwise {
    length: number
}

// 这个泛型函数被定义了约束,不再是适用于任意类型,传入的值必须符合类型约束的值,必须包含必须的属性,如 .length
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
}
```

```js
// 用 属性名 从一个对象中获取属性值,并且确保这个属性存在于obj上,一个参数是对象,一个参数是对象的属性key
function getProperty(obj: T, key: K) {
    return obj[key];
}

let obj: TState = {
    name: '111',
    age: 12,
    like: ['12','34']
}

function getProps<T, K extends keyof T>(obj: T, key: K) {
    return  obj[key];
}

console.log(getProps(obj, 'age'));
console.log(getProps(obj, 'name'));
console.log(getProps(obj, 'like'));
```

## 函数类型
- 定义函数需要定义输入参数类型和输出类型
- 因为TS有类型推导，所以输出类型可以忽略
- 函数没有明确的返回值，就会默认返回void类型；void类型与any类型相反，它表示没有任何类型
- 函数的赋值
    ```
    // 先定义一个函数
    let add1 = (x: number, y: number): number => {
        return x + y;
    }

    // 给函数赋值
    let add2: (x: number, y: number) => number = add1
    // 有点像ES6的箭头函数 ，但是不是箭头函数

    // 直接赋值也是可以的，TS可以进行类型推导
    let add3 = add1

    ```
    **TS遇到`:`就知道后面的代码是写类型用的**

## interface类型
- 用于定义对象类型的
- 定义interface一般首字母大写
- interface不是JS中的关键字，所以TS编译成JS之后，这些interface是不会被转换过去的，都会被删除，interface只是在TS中用来做静态检查的
- interface用于描述函数类型
    ```
    // 描述普通的对象
    interface Person {
        name: string,
        age: 20
    }

    // 描述函数类型
    interface ISum {
        // 参数为数值类型，返回值为数值类型
        (x: number, y: number):number
    }

    const add: ISum = (num1, num2) => {
        return num1 + num2
    }
    ```
- 自定义属性（可索引的类型）
    ```
    interface RandomKey {
        [propName: string]: string
    }

    const obj: RandomKey = {
        a: 'hello',
        b: 'lin',
        c: 'welcome'
    }
    ```

**用interface可以创造一系列的自定义类型**

## 类
JS靠着原型和原型链来实现面向对象变成，es6新增了语法糖class来实现

TS通过`public`、`private`、`protected`三个修饰符来增强了JS中的类

### extends实现继承
子类没有定义自己的属性时，在继承时可以不使用`super`，但是如果子类有自己的属性，那就必须用到`super`关键字把父类的属性继承过来。

```
class Person {
    name: string

    constructor(name: string) {
        this.name = name;
    }

    speak() {
        console.log(`my name is ${this.name}`);
    }
}

class Student {
    age: number

    constructor(name, age) {
        // super --- 将父类的属性继承过来；子类有自己的属性，但是没有使用super，就会报错
        super(name);
        this.age = age;
    }

    hello() {
        console.log(123)
    }
}
```

### 多态
子类对父类的方法进行了重写，子类和父类调用同一个方法时会不一样

```
class SubPerson extends Person {
    age: number
    constructor(name: string, age: number) {
        super(name);
        this.age = age;
    }

    // 直接重写父类的方法即可
    speak() {
        console.log('我是在子组件里面重写的speak方法。。。')
    }
}
```

### public
公有的，一个类里默认所有的方法和属性都是public。`public`可写可不写，不写默认也是`public`

### private
私有的，只属于这个类自己，它的实例和继承它的子类都访问不到

```
class Person {
    private name: string
    constructor(name) {
        this.name = name;
    }
}

Person.name // 不会报错
```
### protected
受保护的，继承它的子类可以访问，实例不能访问


## TS 中的关键字

### extends

#### 用于类型的继承 --- 接口继承
```js
interface Person {
    name: string,
    age: number
}

interface Student extends Person {
    like: string[]
}

let stu: Student = {
    name: '1',
    age: 12,
    like: ['篮球', '排球']
}
```

#### 判断是否是能赋值给另一个类型 --- 条件判断

extends条件判断语法和JS的三元表达式很相似

extends判断真假的逻辑是什么?

**如果extends前面的类型能够赋值给extends后面的类型,那么表达式判断为真,否则为假.**

```js
interface Person {
    name: string,
    age: number
}
// 如果 T 可以满足类型Person则返回Person类型,否则为T类型
type IsPerson<T> = T extends Person ? Person : T;

let test1: IsPerson<Person> = {
    name: '1',
    age: 18
}

interface Student {
    grade: number
}

let test2: IsPerson<Student> = {
    grade: 2,
}
```

```js
// 泛型约束
interface TypeObj {
    length: number
}

function logging<T extends TypeObj>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

对于使用extends关键字的条件类型(即三元表达式类型),如果extends前面的参数是一个泛型类型,当传入该参数的是联合类型,则使用分配律计算最终的结果.分配律是指,将联合类型的联合项拆成单项,分别带入条件类型,然后将每个单项带入得到的结果再联合起来,得到最终的判断结果.

```js
type P<T> = T extends 'x' ? string : number;

type A = P<'x' | 'y'> // A 的结果是 string | number
```

### typeof
在TS中用于类型表达时,`typeof`可以用于从一个变量上获取它的类型.

`number`,`string`,`boolean`类型,在没有声明直接赋值的情况下,会有下面的问题.

```js
// 没毛病的
const value: number = 10;

const value2: typeof value = 100;

// 有毛病的
const value = 10; // 这个number类型,没有声明而是直接赋值了

const value2: typeof value = 100; // 会报错,  不能将类型100分配给类型10
```

对 `对象`,`数组`,`函数`使用typeof

```js
const data = {
    value: 123,
    text: 'text',
    subData: {
        value: false
    }
}

type Data = typeof data;
```

### keyof
是TS中的`索引类型`查询操作符, `keyof T`会得到由`T`上已知的公共属性名组成的联合类型.

常用于限制类型或者枚举属性.

```js
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}
```

### in
`in`操作符用于遍历目标的公开属性名,类似`for...in`的机制.

`in`可以用于联合类型或者枚举类型.

```js
enum Letter {
    A,
    B,
    C
}

type LetterMap = {
    [key in Letter]: string
}

// 相当于

type LetterMap = {
    0: string,
    1: string,
    2: string
}
```

```js
type Property = 'name' | 'age' | 'phoneNum';

type PropertyObject = {
    [key in Property]: string
}

// 相当于

type PropertyObject = {
    name: string,
    age: string,
    phoneNum: string
}

```

### infer
`infer`可以用来进行类型推测.

TS内置的`ReturnType`,他的实现就使用到了`infer`.

`infer R`中的`R`就表示了待推断的返回值类型.

[参考文章](https://jkchao.github.io/typescript-book-chinese/tips/infer.html#%E4%BB%8B%E7%BB%8D)

```js
type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
```

表示在extends语句待推断的类型变量

```js
type ParamType<T> = T extends (...args: infer P) => any ? P : T;
```

在这个条件语句中,`T extends (...args: infer P) => any ? P : T`中,`infer P`表示待推断的函数参数.整句表示为:如果`T`能赋值给`(...args: infer P) => any`,则结果是`(...args: infer P) => any`类型中的参数`P`,否则返回`T`.

```js
interface User {
    name: string,
    age: number
}

type Func = (user: User) => void;

type Param = ParamType<Func>; // Param = User
type AA = ParamType<string>;
```

#### TS中内置的与infer有关的

##### 用于提取函数类型的返回值类型
**ReturnType**
```js
type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;
```

#### 用于提取构造函数中参数(实例)类型
**ContrsuctorParameters**
**InstanceType**

构造函数的表示:
```js
type Constructor = new (...args: any[]) => any;
```

infer用于构造函数中,可用于参数位置或者返回值位置

获取参数类型:

```js
type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P): any ? P : never;
```

获取实例类型:

```js
type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer P ? P : any;
```

```js
class TestClass {
    constructor(public name: string, public age: number) {}
}

type Params = ConstructorParameters<typeof TestClass>; // [string, number]  是一个元组类型

type Instance = InstanceType<typeof TestClass>; // TestClass
```

#### infer的一些用例

##### tuple转union
`[string, number] -> string | number`

```js
// 这种场景下,元组是可以转换为联合类型的
type TTuple = [string, number];
type TArray = Array<string | number>;

type Res = TTuple extends TArray ? true : false; // true
type ResO = TArray extends TTuple ? true : false; // false
```

```js
type ElementOf<T> = T extends Array<infer E> ? E : never;

type TTuple = [string, number];

type ToUnion = ElementOf<TTuple>;
```

### is
is操作符用于TS的类型谓词中，是实现TS类型保护的一种方式。

```js
function dosomething(value: string | number) {
    if (typeof value === 'string') {
        //  TS可以识别这个分支中的value是string类型的参数，（这就叫类型保护）
    } else {
        // TS 可以识别这个分支中的value是number类型
    }
}
```

TS的类型谓词的实现：


```js
// 返回类型声明了类型谓词，可以帮助TS在代码分支中进行类型保护
function isString(value: any) value is string {
    return typeof value === 'string';
}
```