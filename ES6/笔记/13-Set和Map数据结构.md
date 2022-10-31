# Set和Map数据结构

## Set

### 基本用法
- 类似于数组，但是成员的值都是唯一的，没有重复的。
- Set函数可以接收一个数组（或者具有Iterator接口的其他数据结构）作为参数，用来初始化。
- 数组去重
    ```
    [...new Set(arr)]; 
    [...new Set('hdakhdu')].join(); //  字符串的去重
    Array.from(new Set(arr));;  // Array.from 可以将Set转为数组
    ```
- 向Set加入值的时候，不会发生类型的转换。例如：`5`和`'5'`是两个不同的值。
- Set内部判断两个值是否相同，其行为逻辑类似于`===`运算符，不同的是，Set中，NaN等于本身。
- 两个对象总是不相等的。
- **Set结构的键名就是键值，两者是同一个值**

### Set实例的属性和方法
#### 属性
- `Set.prototype.constructor`：构造函数，默认就是Set函数
- `Set.prototype.size`：返回Set实例成员总数

#### 方法
- 操作方法
    - `Set.prototype.add(value)`：添加某个值，返回Set结构本身
    - `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示是否删除成功
    - `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员
    - `Set.prototype.clear()`：清除所有成员，没有返回值
- 遍历方法 - Set的 遍历顺序 就是 插入顺序
    - `Set.prototype.keys()`：返回 键名 的遍历器
        - Set结构没有键名，只有键值，keys与values行为完全一致。
    - `Set.prototype.values()`：返回 键值 的遍历器
    - `Set.prototype.entries()`：返回 键值对 的遍历器
    - `Set.prototype.forEach()`：使用回调函数遍历每个成员，同时包含键名和键值，所以每次输出一个数组，它的两个成员完全相等。
        - 用法与数组的`forEach`一致，第一个参数是一个回调函数
        - 可以用第二个参数，绑定新的this对象
    - `for...of`直接遍历Set结构

## WeakSet
- WeakSet结构与Set类似，也是不重复的值的集合，但它与Set有两个区别：
    - WeakSet的成员只能是对象，而不能是其他类型的值
    - WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占内存，不考虑该对象还存在与WeakSet之中。

- WeakSet适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在WeakSet里面的引用就自动消失。
- **WeakSet不可遍历**。
```
        let arr1 = [[2, 3], [4, 5]];
        // arr1 的成员是数组（特殊的对象）
        let ws1 = new WeakSet(arr1);
        console.log(ws1);

        let arr2 = [1, 2];
        // 此时 arr2 的成员不是对象了
        let ws2 = new WeakSet(arr2);    // 报错了
```
- WeakSet的方法
    - `WeakSet.prototype.add(value)`
    - `WeakSet.prototype.delete(value)`
        ```
        let ws3 = new WeakSet();
        let obj = {
            name: '1'
        }
        ws3.add(obj);
        console.log(ws3);
        console.log(ws3.delete(obj));   // 返回true或者false，表示是否删除了
        console.log(ws3)    // 变成空的了
        ```
    - `WeakSet.prototype.has(value)`
- 没有`size`属性，有没有办法遍历其成员


## Map

### 基本用法
- 类似于对象，是键值对的集合，但是‘键’的范围不限于字符串，各个类型的值都可以当做键。
    ```
        let arr1 = [
            ['name1', 'zhangsan'],
            ['name2', 'lalala'],
            ['name3', 'lisi'],
            ['name4', 'wangwu']
        ]

        let map1 = new Map(arr1);
        console.log(map1);

        // 实际是执行下面的代码
        // [key, value] 这里用了数组的解构赋值
        arr1.forEach(([key, value], index) => {
            console.log(key)
            console.log(value)
            // console.log(item)
            console.log(index)
        })
    ```
- 不仅仅是数组，任何具有Iterator接口，且每个成员都是一个双元素的数组的数据结构都可以当做Map构造函数的参数。

### 属性和操作方法

#### 属性
- `size`属性：返回成员总数

#### 方法
- 操作方法：
    - `Map.prototype.set(key, value)`：返回整个Map结构，因此可以使用链式写法。
    - `Map.prototype.get(key)`：找不到时，会返回undefined
    - `Map.prototype.has(key)`：返回一个布尔值
    - `Map.prototype.delete(key)`：返回一个布尔值，表示是否删除成功
    - `Map.prototype.clear(key)`：没有返回值
- 遍历方法 - 遍历顺序 就是 插入顺序
    - `Map.prototypoe.keys()`：返回 键名 的遍历器
    - `Map.prototypoe.values()`：返回 键值 的遍历器
    - `Map.prototypoe.entries()`：返回 所有成员 的遍历器
        ```
        let arr2 = [
            [ 'name', '123' ],
            [ 'age', 23 ]
        ]

        let map2 = new Map(arr2);
        console.log(map2);

        for(let item of map2.entries()) {
            console.log(item)
        }

        for(let [key, value] of map2.entries()) {
            console.log(key, value)
        }
        ```
    - `Map.prototypoe.forEach()`：遍历Map的所有成员

- Map转为数组： `...`扩展运算符
- 数组转为Map： 将数组传入Map的构造函数
- Map转为对象： 如果所Map的key都是字符串，可以无损转为对象
- 对象转为Map： Object.entries()


## WeakMap
- WeakMap结构与Map类似，也适用于生成键值对的集合，但有两个区别：
    - WeakMap只接受对象作为键名(null除外)，不接受其他类型的值作为键名
    - WeakMap键名所指向的对象，不计入垃圾回收机制。键名是弱引用，键值不是弱引用。
- 适用场景：想往对象上面添加数据，有不想干扰垃圾回收机制。 -- 在网页的dom元素上添加数据，可以使用WeakMap，当DOM元素被清除，对应WeakMap记录就会自动被移除。
- WeakMap的方法：
    - `get()`
    - `set()`
    - `has()`
    - `delete()`
- 没有`size`属性，不可遍历