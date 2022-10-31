# Reflect
为操作对象而提供的新API

## 概述
- 将Object一些明显属于语言内部的方法（`Object.defineProperty`），方到Reflect对象上。
- 修改某些Object方法返回的结果，让其变得更合理。
- 让Object的操作都变成函数行为
    - name in obj       --->    Reflect.has(obj, name)
    - delete obj[name]  --->    Reflec.deleteProperty(obj, name)
- Reflec对象的方法，与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。

## Reflect的静态方法

### Reflect.get(target, name, receiver)
- receiver - 实例本身，严格来说是操作行为所针对的对象
- 如果第一个参数不是对象，会报错。
- 如果name属性部署了读取函数getter，则读取函数getter的this绑定receiver


### Reflec.set(target, name, value, receiver)
- 如果name属性部署了赋值函数getter，则读取函数getter的this绑定receiver
- Proxy和Reflect联合使用，前者拦截赋值的操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.definProperty拦截。若没有传入receiver，就不会触发。
- 返回一个布尔值
- 如果第一个参数不是对象，会报错。


### Reflect.has(obj, name)
- name in obj 里面的 in 运算符
- 返回一个布尔值
- 第一个参数不是对象，会报错


### Reflect.deleteProperty(obj, name)
- delete obj[name]
- 删除成功或者被删除的属性不存在，返回true
- 删除失败。返回false
- 第一个参数不是对象，会报错


### Reflect.construct(target, args)
- new target(...args)
- 提供了一种不使用new来调用构造函数的方法。
- 第一个参数不是对象，会报错


### Reflect.getPrototypeOf(obj)
- 用于读取对象的`__proto__`属性：Object.getPrototyoeOf()
- 如果第一个参数不是对象，会报错；Object.getPrototypeOf()，如果第一个参数不是对象，会将它转为对象。


### Reflect.setPrototyoeOf(obj, newProto)
- 用于设置目标对象的原型：Object.setPrototypeOf(target, newProto)
- 返回一个布尔值，表示是否设置成功，成功会返回true，失败返回false
- 第一个参数不是对象，会报错。Object.setPrototypeOf(target, newProto) 第一个参数不是对象，会返回第一个参数本身。第一个参数是undefined或者null，不管哪种方法都会报错。


### Reflect.apply(func, thisArg, args)
- 等同于`Function.prototype.apply.call(func, thisArg, args)`，用于绑定`this`对象之后，执行给定函数。
- 一般来说，`fn.apply(obj, args)`即可绑定一个this；若函数定义了自己的apply方法，就需要用 `Function.prototype.apply.call(func, thisArg, args)`。


### Reflect.defineProperty(traget, propertyKey, attributes)
- 用来为对象定义属性：Object.defineProperty
- 第一个参数不是对象，会报错


### Reflect.getOwnPropertyDescriptor(target, propKey)
- 用于得到指定属性的描述对象：Object.getOwnPropertyDescriptor
- 如果第一个参数不是对象，会报错。Object.getOwnPropertyDescriptor：如果第一个参数不是对象，会返回undefined


### Reflect.isExtensible(target)
- 表示当前对象是否可扩展：Object.isExtensible
- 返回一个布尔值
- 如果第一个参数不是对象，会报错。Object.isExtensible会返回false，非对象本来就是不可以扩展的


### Reflect.preventExtensions(target)
- 用于让一个对象变为不可扩展： Object.preventExtensions
- 返回一个布尔值
- 如果参数不是对象，会报错。


### Reflec.ownKeys(target)
- 返回对象的所有属性：Object.getOwnPropertyNames 与 Object.getOwnPropertySymbols 之和
- 参数不是对象，会报错

## 实例：使用Proxy实现观察者模式
- 观察者模式：函数自动观察数据对象，一旦对象有变化，函数就睡自动执行。
