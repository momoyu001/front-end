# Proxy

## 概述
- proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种‘元编程’，即对编程语言进行编程。可以理解成，在目标对象之前架设了一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问操作进行过滤和改写。
- new Proxy(target, handler)
    - 生成一个Proxy实例。
    - target表示要拦截的目标对象。
    - handler参数也是一个对象，用来定义拦截行为。对于每个要代理的操作，需要提供一个对应的处理函数。该函数将拦截对应的操作。
    - 要是的`Proxy`起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作。
        ```
            let proxy = new Proxy({}, {
                get: function (target, propKey) {
                    console.log(target);    // {}
                    console.log(propKey);   // time
                    return 2000;
                }
            })

            console.log(proxy.time);        // 2000
        ```
    - 如果handler没有设置任何拦截，就相当于直接通向原对象。对于可以设置，但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式出生结果。
        ```
            let target = {};
            let handler = {};
            let proxy2 = new Proxy(target, handler);

            // handler是空的，访问proxy2相当于访问target

            proxy2.name = 'Proxy是空的';
            console.log(target.name);
            target.time = '2021';
            console.log(proxy2.time);
        ```
    - Proxy作为原型对象
        ```
            let proxy3 = new Proxy({}, {
                get: function(target, propKey) {
                    return 1000;
                }
            })
            // proxy实例作为对象的原型
            let Obj1 = Object.create(proxy3);
            Obj1.name = 'obj1新增的name属性';
            // 访问自己的属性，没问题
            console.log(Obj1.name);     // obj1新增的name属性
            // 访问自己没有的属性，就会往原型上去查找，然后被拦截
            console.log(Obj1.time);     // 1000
        ```
    - Proxy的拦截操作，见下一节

## Proxy实例的方法
### get(target, propKey, receriver)
- **拦截属性的读取**
    - proxy.foo、proxy['foo']
- get 方法可以继承
- 如果一个属性不可配置，且不可写，则Proxy不能修改该属性，会报错。
```
/**
* receiver: 实例本身，严格地说，是操作行为所针对的对象，可选参数
* **/
get: function(target, propKey, receiver) {
    console.log('get拦截...');
    if (propkey in target) {
        return target[propKey];
    } else {
        throw new ReferenceError(`Prop name ${propkey} does not exist`);
    }
},
```

### set(target, propKey, value, receiver)
- **拦截属性的设置**返回一个布尔值
    - proxy.foo = 'foo'、proxy['foo'] = 'foo'
- 利用set方法，可以绑定数据，即每当对象发生变化时，会自动更新DOM --- vue3？？？
- 如果目标对象自身的某个属性，不可写且不可配置，那么set方法将不起作用。
- `严格模式下`，set如果没有返回`true`，就会报错。即便返回了false或者undefined也会报错。
```
/**
 * 最后一个参数可选
**/
set: function(target, propKey, value, receiver) {
    console.log('set拦截...');
    target[propKey] = value;
    return true;
},
```

### apply(traget, object, proto)
- **拦截Proxy实例作为函数的调用、`call`、`apply`操作** - `目标对象是函数时`
    - proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
- 参数：目标对象target、目标对象的上下文对象this，目标对象的参数数组
- 


### has(target, propKey)
- **拦截`HasProperty`的操作，即判断对象是否具有某个属性，返回一个布尔值**
    - propKey in proxy
- 如果原对象不可配置或者禁止扩展，这时has拦截会报错
- has拦截对for...in不生效
- has方法不判断一个属性是对象自身的还是继承的属性
```
let obj = {
    a: 10
}

// 设置不可以扩展
Object.preventExtensions(obj);

let p = new Proxy(obj, {
    has: function(target, propKey) {
        // 如果某个属性不可以配置或者整个目标对象不可扩展，那么has方法就不可以返回false。
        return false;
    }
})

'a' in p;   // 会报错
```

### construct(target, args, newTarget)
- **拦截Proxy实例作为构造函数调用的操作，`new`命令，返回一个对象** - `目标对象是函数时`
    - new Proxy(...args)
- 参数：目标对象、构造函数的参数对象、创建实例对象，new命令作用的构造函数
- 返回值：必须是一个对象，否则会报错


### deleteProperty(target, propKey)
- **拦截`delete`的操作，返回一个布尔值。如果这个方法抛出错误或者返回false，当前属性就无法被delete删除**
    - delete proxy[propKey]
- 目标对象不可以配置的属性，不能被deleteProperty删除，否则会报错


### defineProperty(target, propKey,  propDesc)
- **返回一个布尔值**
    - Object.defineProperty(proxy,propKey, propDesc） Object.defineProperties(proxy, propDescs)
- 返回false时，只是用来提示操作失败，本身并不能阻止添加新属性
- 目标对象不可扩展，该方法不能增加新的属性
- 某个属性不可写或者不可配置，不能用该方法改变这两个设置

### getOwnPropertyDescriptor(target, propKey)
- **返回属性的描述对象，或者undefined**
    -  Object.getOwnPropertyDescriptor(proxy, propKey)

### getPrototypeOf(target)
- **拦截获取对象原型，返回一个对象或者null**
    - Object.getPrototypeOf(proxy)、Reflect.getPrototypeOf、instanceof、Object.prototype.__proto__、Object.prototype.isPrototypeOf
- 如果对象呢不可扩展，该方法必须返回目标对象的原型对象。

### isExtensible(target)
- **返回一个布尔值**
    -  Object.isExtensible(proxy)
- 只能返回布尔值，否则返回值会被自动转为布尔值。
- 一个强限制：它的返回值必须与目标对象的`isExtensible`属性一致，否则会抛出错误。`Object.isExtensible(proxy) === Object.isExtensible(target)`

### ownKeys(target)
- **拦截对象自身属性的读取操作。返回一个数组。返回目标对象自身所有的属性的属性名。而Object.keys()返回的结果仅仅包括目标对象自身的可遍历属性**
    -  Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in
- 返回的数组中的成员，只能是字符串或者Symbol值
- 如果目标对自身包含不可配置的属性，改属性必须被`ownKeys()`方法返回，否则报错。
- 如果目标对象是不可以扩展的，改方法的返回值中，必须包含目标对象的所有属性，且不能包含多余的属性，否则报错。

### preventExtensions(target)
- **返回一个布尔值**
    - Object.preventExtensions(proxy)
- 只有当目标对象不可扩展时，改方法才能返回true

### setPrototypeOf(target, proto)
- **返回一个布尔值**
    - Object.setPrototypeOf(proxy, proto)
- 若目标对象不可扩展，setProperty方法不的改变目标对象的原型。


## Proxy。revocable()
- 返回一个可取消的Proxy的实例。
    ```
    let target = {}
    let handler = {}

    let { proxy, revoke } = Proxy.revocable(target, handler);

    proxy.foo = 123;
    proxy.foo   // 123

    // 取消实例
    revoke();

    // 取消实例之后的访问，报错了
    proxy.foo;
    ```
- 一种使用场景：目标对象不可直接访问，只能通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

## Proxy - this 问题
- Proxy不是透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致，因为在Proxy代理的情况下，目标对象内部的`this`关键字会指向Proxy代理。
- 通过Proxy访问，this就指向了Proxy

## 实例：Web服务的客户端
