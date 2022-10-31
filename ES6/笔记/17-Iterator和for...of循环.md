# Iterator 和 for...of循环

## Iterator遍历器
为各种不同的数据类型（数组、对象 、Map、Set）提供统一的访问机制，任何数据只要部署了Iterator接口，就可以完成遍历操作。Iterator接口主要供`for...of`使用。

- 遍历的过程：
    - 创建一个指针对象，指向当前数据结构的起始位置
    - 不断的调用指针对象的next方法，直到它指向数据结构的结束位置。
- 每一次调用next方法，都会返回数据结构中当前成员的信息：`value` - 当前成员的值  `done` - 布尔值，表示遍历是否结束。
    ```
    function makeItertor(array) {
        let index = 0;
        return {
            next: function() {
                return index < array.length ? { value: array[index++] } : { done: true }
            }
        }
    }
    ```

## 默认的Iterator接口
默认的Iterator接口部署在数据结构的`Symbol.iterator`属性，或者说只要一个数据结构具有`Symbol.iterator`属性，就可以认为是可遍历的。

`Symbol.iterator`属性本身是一个函数，就是当前数据结构默认的遍历器生成函数，执行这个函数就会返回一个遍历器。

```
const obj = {
    [Symbol.iterator]: function() {
        return {
            next: function() {
                return {
                    value: 1,
                    done: true
                }
            }
        }
    }
}
```

原生具备Iterator接口的数据结构如下：
- Array
- Map
- Set
- String
- TypedArray
- 函数的arguments对象
- NodeList对象

对于不具备Iterator的数据结构，需要自己在`Symbol.iterator`属性上面部署遍历器生成函数，才可以被`for...of`循环。

普通对象部署数组的`Symbol.iterator`方法，并无效果。

## 调用Iterator接口的场合
- 解构赋值
- 扩展运算符 `...`：只要某个数据结构部署了Iterator接口，就可以对他使用扩展运算符，将其转为数组。
- yield*：后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口
- 由于数组的遍历会调用遍历器接口，所以任何接收数组作为参数的场合，其实都调用了遍历器接口。
    - for...of
    - Array.from()
    - Map() Set() WeakMap() WeakSet()
    - Promise.all()
    - Promise.race()

## 遍历器对象的return方法和throw方法
- 遍历器对象的next方法，必须部署的
- 遍历器对象的return方法：如果for...of循环提前退出，就会调用return方法
