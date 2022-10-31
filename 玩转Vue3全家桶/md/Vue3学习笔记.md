# 前端框架 - 极客时间课程笔记

[toc]

## MVVM框架简介
前端MVVM框架实现的目标：**数据驱动页面**。但每个MVVM框架对于数据驱动页面的实现，基本都是不一样的。 - 即数据更新之后，我们怎么通知页面进行更新。

- Angular：**脏检查** 
    - 每次用户交互时，就去检查一次数据是否变化，有变化就去更新DOM
- Vue1：**响应式** 
    - 初始化的时候，`Watcher` 监听了数据的每个属性，这样数据发生变化时，就能精确知道数据的哪个`key`改变了，去针对性的修改DOM。
        - 
- Vue2、Vue3：**响应式 + 虚拟DOM** 
    - 组件间使用响应式：组件间的变化，响应式系统来通知更新；组件内使用虚拟DOM去更新页面。
    - 引入虚拟DOM，给vue带来了跨端的能力。就是我们可以使用JSON描述vue的项目，可以基于JSON在小程序渲染、在App渲染，这是vue1没有的能力。
    - `Vue3把虚拟DOM的静态标记做到了极致，让静态的部分越过了虚拟DOM的计算，真正做到了按需更新，提高性能`。
- React：**虚拟DOM** 
    - 用一个JavaScript对象来描述整个DOM树，通过对虚拟DOM的计算，知道变化的数据，进行精确的修改。
    - 数据有变化时，生成一份新的虚拟DOM，与之前的虚拟DOM进行计算，算出需要修改的DOM，再去页面进行操作。
    - 虚拟DOM的diff逻辑，可以尽可能的减少对DOM的操作。
        - 引入了fiber架构。时间切片，来解决卡顿的问题
    ```
    // 虚拟DOM...
    {
        tag: "div",
        attrs: {
            id: "app"
        },
        children: [
            {
            tag: "p",
                attrs: { className: "item" },
                children: ["Item1"]
            },
            {
            tag: "div",
                attrs: { className: "item" },
                children: ["Item2"]
            }
        ]
    }
    ```
## Vue和React的对比：
- 通知页面更新：
    - `Vue`：当数据发生变化后：框架会主动告知哪些数据发生了变化。
    - `React`：当数据发生变化后：只能通过新老数据的计算diff来得知数据的变化。
- 性能问题：
    - `Vue`：项目大了之后，每一个数据都有一个Watcher，`Watcher`多了会严重影响性能
    - `React`：项目大了之后，虚拟DOM树过于庞大，diff计算可能会造成卡顿。
- 解决性能问题的方案：
    - `Vue`：Vue2中引入虚拟DOM来解决性能的问题。响应式数据主动推送数据变化，虚拟DOM是被动计算数据的Diff。组件级别划分两种技术。
    - `React`：引入了操作系统的时间切片概念，引入了`fiber`架构。把整个虚拟DOM微观化，变成链表，然后再利用浏览器的空闲时间计算Diff。巧妙利用空闲时间计算，解决了卡顿的问题。树形结构的Diff很难中断（属性结构的diff用的是递归，递归本身就是难以中断的），链表结构的Diff可以随时中断和继续。


## vue3需不需要react的fiber？？？
不需要。时间切片解决的问题，在vue3里面基本碰不到。
- Vue2、3的虚拟DOM控制在组件级别，只在组件内部使用虚拟DOM，组件之间使用响应式，这就让vue的虚拟DOM不会过于庞大
- Vue3虚拟DOM的静态标记和自动缓存功能 ，让静态的节点和属性可以直接绕过Diff逻辑，也就大大减少了DOM的Diff事件
- 时间切片也会带来额外的系统复杂性。

# 初探Vue3新特性
[vue github](https://github.com/vuejs/vue-next)
## vue2 的核心模块
- 响应式驱动
- 内置虚拟DOM
- 组件化
- 用在浏览器开发
- 运行时，把以上模块很好的管理起来

## 历史遗留问题
- Vue2使用Flow.js来做类型校验，但目前Flow.js已经停止维护
- Vue2内部运行时，是直接执行浏览器API。但这样就会在Vue2的跨端方案中带来问题
- Vue2响应式并不是真正意义上的代理，而是基于Object.defineProperty（）实现的。这个API并不是代理，而是对某个属性进行拦截，比如 删除数据 就无法监听
- Option API在代码较多时不好维护
- 生命周期
    - vue3中，只有createApp,然后立刻调用mount()才可以进入生命周期。
    - vue2中，new Vue，但是没有给el，或者没有$mount挂载组件，这是组件的beforeCreate和created依旧会执行。

## Vue3新特性
**响应式系统**、**Composition API组合语法**、**新的组件**、**Vite**、**自定义渲染器 - 开发跨端应用**、**RFC机制 - 对Vue源码做贡献**

Vue2中可以在main.js中定义一些Vue.$xxx的全局变量，然后再JS里面使用，Vue3中取消了这种写法。

### RFC机制
与代码无关，是Vue团队的工作方式。
[RFC链接戳这里！](https://github.com/vuejs/rfcs)
### 响应式系统
Vue2：Object.defineProperty() - 拦截某个属性。对于不存在的属性是没有办法进行拦截的，所以Vue2中所有数据都要在data里面声明。

Vue3：Proxy - 真正的代理。拦截的是整个obj，具体obj有什么属性，Proxy并不关心。

### 自定义渲染器
Vue2：内部所有模块都是揉在一起的

Vue3：拆包。响应式、编译、运行时全部独立了。
- Vue2的响应式只服务于Vue，Vue3的响应式就和Vue解耦了，甚至可以再react、node中使用响应式。
- 渲染逻辑的拆分：`平台无关的渲染逻辑`、`浏览器渲染的API`

### 全部模块使用TypeScript重构
类型系统，对代码进行限制，代码更健壮。

### Composition API
所有的API都是import引入的，没有用到的，打包时会被清理掉

代码复用方便，可以把一个功能的所有的methods，data都封装在一个独立函数里面

return语句，在实际项目中使用`<script setup>`特性可以清除

```
        // 按需引入 reactive computed
        const { reactive, computed } = Vue;

        const App = {
            setup() {
                const state = reactive({
                    count: 1
                })

                function add() {
                    state.count++;
                }

                const double = computed(() => state.count*2);

                return { state, add, double };
            }
        }

        Vue.createApp(App).mount('#app');
```
### 新的组件
Fragment：Vue3组件不再要求有一个唯一的根节点，清除了很多无用的占位div。

teleport：允许组件渲染在别的元素内，主要开发弹窗组件的时候特别有用。

Suspense：异步组件，更方便开发有异步请求的组件。
### 新一代工程化工具Vite
webpack：要把所有路由的依赖打包之后，才能开始调试
vite：调试环境下，不需要全部打包，根据首页依赖模块，再去按需加载。

# Vue2升级到Vue3

## 不兼容的写法
- 项目启动上的不同：
    - Vue2：new Vue()
    - Vue3：createApp()，
- Vue3移除了filter、$on、$off、$set、$delete等API
- v-model用法更改
- slot slot-scope 的更改
- directive注册指令API更改

## 自动化根据的升级
- @vue/compat
- gogocode

# Vue3工程
## 项目的搭建
- 初始化项目：npm init @vitejs/app
- 路由管理、数据管理：npm install vue-router@next   npm innstall vuex@next **该命令安装的都是4.X版本的vue-router、vuex**，使用`@next`安装的是vue3版本的
- 创建vue实例：
    ```
    import { createApp } from 'vue';
    import App from './App.vue';

    createApp(App).mount('#app');
    ```
- 创建路由实例
    - 栗子中使用的`hash`模式的路由
    - `history`模式的路由：createWebHistory()
    ```
    import {
        createRouter,
        createWebHashHistory
    } from 'vue-router';

    const routes = [
        // 配置具体的路由
    ]

    const router = createRouter({
        history: createWebHashHistroy(),
        routes
    })

    export default router;
    ```
- 引入路由
    ```
    import router from './router.js';

    createApp(App).use(router).mount('#app');
    ```

## `composition API` + `<script setup>`代码组织方式
### 响应式数据
```
<script setup>
    import { ref } from 'vue';
    let count = ref(1);

    function add() {
        count.value++
    }
</script>
```

ref函数函数返回的`count`变量就是响应式数据，针对ref返回的响应式数据，需要修改 `.value`才能生效

### 组件的注册
在当前页面中`import`引入之后，`script setup`会自动将该组件注册到当前页面，不需要我们再手动注册。

### 计算属性
在Composition API的语法中，计算属性和生命周期等功能，都可以脱离Vue的组件机制单独使用。

```
import { computed } from 'vue';

let active = computed(() => {
    // ...
})

let allDone = computed({
    get: function() {
        // ...
    },
    set: function(value) {
        // ...
    }
})
```

### compisition API 拆分代码
使用composition API的逻辑来拆分代码，把一个功能相关的数据和方法都维护在一起。把功能独立的模块，封装成一个独立的函数，真正做到按需拆分。

把清单功能的所有变量和方法，都放在函数内部定义并且返回，这样就可以放在任意的地方来维护。

```
// Todolist.vue

// 可以放在一个 .vue 文件中 ，哪一个script文件在上无所谓
<script setup>

</script>

<script>
function useTodos() {
    // ... 具体代码逻辑

    return { title, todos, addTodo, clear, active, all, allDone };
}

</script>
```
拆分功能时，ref、computed等，都是从Vue中单独引入，而不是依赖于this上下文。

```
// Todolist.js

import { ref, computed } from 'Vue';

export function useTodo() {
    // ...
}

```
```
import { useTodo } from './Todolist.js';
let { title, active, ... } = useTodo();
```

### script setup 好用的功能
`<script setup>`是为了提高使用`composition API`的效率而存在的。

- 精简代码：
    - 举个栗子：累加器（有script setup 和 无script setup）

        ```
        // 有script setup
        <script setup>
        import { ref } from 'Vue';

        let count = ref(0);

        function addCount() {
            count.value++;
        }
        </script>
        ```

        ```
        // 无script setup

        <script >
        import { ref } from "vue";
        export default {
            setup() {
                let count = ref(1)
                function add() {
                    count.value++
                }

                return {
                    count,
                    add
                }
            }
        }
        </script>
        ```
- 可以使用顶层的await去请求后端的数据等等

### style样式的特性
- `scoped`属性：定义的css属性就只会应用到当前组件的元素上，避免样式上的冲突
- `:global`：在scoped中想写全局的样式的话，使用 :global 标记
- `v-bind`：直接在CSS中使用JavaScript中的变量
    ```
    import { ref } 'Vue';
    let color = ref('red');

    <style>
    h1 {
        color: v-bind(color);
    }
    </style>
    ```

## 深入理解Vue3的响应式机制

### 什么是响应式？
变量A由变量B计算之后得到，当修改变量B，变量A的值可以实时的改变，这就是响应式的雏形。

### 响应式的原理
vue中一共有三种响应式的解决方案：`defineProperty`，`Proxy`，`value setter`

#### defineProperty
vue2中，实现响应式的原理 - defineProperty()。

[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineproperty)

- 定义：Object.defineProperty()方法会直接在一个在对象上定义一个新属性，或者修改一个新对象的现有属性，并返回此对象。

- 语法：`Object.defineProperty(obj, prop, descriptor)`
- 参数：
    - obj: 要定义属性的对象
    - prop: 要定义或修改的属性的名称或`Symbol`
    - descriptor: 要定义或修改的属性描述符，是一个对象
- 返回值：被传递给函数的对象
- 通过一般的赋值操作添加的普通属性是可枚举的、可修改的、可删除的。默认情况下，使用该API添加的属性是不可修改(`immutable`)的。
- 描述符：（参数中的第三个参数）
    - 数据描述符：具有值的属性
        - `configurablle`: `true` - 属性的描述符可以改变，属性可以从对象上删除；`false` - 默认值
        - `enumerable`: `true` - 该属性出现在对象的枚举属性中；`false` - 默认值
        - `value`: 该属性对应的值，可以是任何有效的JavaScript值
        - `writable`：`true` - 属性的value可以被赋值运算符改变；`false` - 默认值
    - 存取描述符：getter和setter描述的属性
        - `configurablle`: `true` - 属性的描述符可以改变，属性可以从对象上删除；`false` - 默认值
        - `enumerable`: `true` - 该属性出现在对象的枚举属性中；`false` - 默认值
        - `get`: 属性的getter函数，访问改函数时会调用此函数
        - `set`: 属性的setter函数，当属性的值被改变时，会调用此函数，该方法接收一个参数
    - 两种描述符只能存在一种
- **栗子**：
    ```
        // 实现响应式：Object.definProperty
        let obj = {};
        let count = 2;
        let double = getDouble(count);

        function getDouble(count) {
            return count * 2;
        }

        Object.defineProperty(obj, 'count', {
            get() {
                return count;
            },
            set(value) {
                count = value;
                double = getDouble(value);
            }
        })

        console.log(double); // 4
        obj.count = 10;
        console.log(double); // 20
    ```
- Object.defineProperty的缺点
    - 不能响应一个属性的删除，只能通过 `$delete` 来实现响应。

#### Proxy
vue3实现响应式的原理 - Proxy

- Proxy是针对对象的监听，而不是针对某一个属性的监听，所以不仅可以代理哪些定义时不存在的属性，还可以代理更丰富的数据结构，比如Map、Set。

- **栗子**：
    ```
        let obj = {};
        let count = 2;
        let double = getDouble(count);

        function getDouble(count) {
            return count * 2;
        }

        let handler = {
            get: function(target, prop) {
                return target[prop];
            },
            set: function(target, prop, value) {
                target[prop] = value;
                if (prop === 'count') {
                    double = getDouble(value);
                }
            },
            deleteProperty(target, prop) {
                delete target[prop];
                if (prop === 'count') {
                    double = NaN;
                }
            }
        }
        let proxy = new Proxy(obj, handler);

        console.log(obj.count, double); // undefined 4
        proxy.count = 2;
        console.log(obj.count, double); // 2 4
        proxy.count = 10;
        delete proxy.count;
        console.log(obj.count, double); // undefined NaN
    ```
- Vue3中`reactive`函数可以把一个对象变成响应式数据，而reactive函数就是通过Proxy实现的
    ```
    import { reactive, computed, watchEffect } from 'vue';

    let obj = reactive({
        count: 1
    })

    let double = computed(() => {
        return count * 2;
    })

    obj.count = 10;

    watchEffect(() => {
        console.log('数据被修改了', obj.count, double);
    })
    ```


#### value setter
Vue3 响应式实现的原理：利用`对象的get和set函数`来进行监听

- 这中响应式的实现方式，只能拦截某一个属性的修改，这也就是Vue3中`ref`这个API的实现。

- **栗子**：
    ```
    let getDouble = n => n * 2;
    let _value = 1;
    let double = getDouble(_value);

    let count = {
        get value() {
            return _value;
        },
        set value(val) {
            _value = val;
            double = getDouble(val);
        }
    }

    console.log(count.value, double);
    count.value = 2;
    console.log(count.value, double);
    ```

#### 响应式实现原理的总结
![总结]("./img/响应式.png")

### 定制响应式数据
任意拆分出独立的函数。把一切项目中的状态和 数据都封装成响应式的接口，屏蔽了浏览器的API，对外暴露的就是普通的数据。

- **栗子**
    ```
    // 数据实时同步到localStorage，封装成一个独立的函数 useStorage
    import { watchEffect, ref } from 'vue';

    export function useStorage(name, value = []) {
        let data = ref(JSON.parse(localStorage.getItem(name) || '[]') || value);

        watchEffect(() => {
            localStorage.setItem(name, JSON.stringify(data.value));
        })

        return data;
    }

    // 使用时
    import { useStorage } from "../utils/useStorage";

    let todos = useStorage('todos', []);
    ```

-  **栗子**
    ```
    // 在loading状态下，修改浏览器的小图标favicon
    import { ref, watch } from 'vue';
    export function useFavicon(newIcon) {
        const favicon = ref(newIcon);

        const updateIcon = (icon) => {
            document.head.querySelectorAll(`link[ref="icon"]`).forEach(el => el.href = `${icon}`);
        }

        const reset = () => favicon.value = './favicon.ico';

        watch(favicon, (i) => {
            updateIcon(i);
        })

        return { favicon, reset };
    }

    ```

### VueUse工具包
- 提供了大量的工具包，包括全屏、网络请求、动画等。
- 插件安装
    ```
    npm install @vueuse/core
    ```

## Vue的组件化机制

### 组件属性的定义
- 使用`defineProps`来规范数传递的格式，参数是一个对象，对象中就是具体的属性定义
- **栗子**
    ```
    import { defineProps, computed } from 'vue';
    let props = defineProps({
        value: Number
    })

    // 组件内部使用属性时，都是  props.  的方式
    let rate = computed(() => '★★★★★☆☆☆☆☆'.slice(5 - props.value, 10 - props.value))
    ```

### 组件事件
- 使用`defineEmits`来传递事件。
    ```
    let emits = defineEmits('update-rate');

    function onRate(num) {
        emits('update-rate', num);
    }
    ```

### 组件的v-model
- 对于自定义组件来说，v-model是两个语法：`传入属性`和`接收组件传递数据`的简写
- Vue3中默认绑定的变量名变了，从`value`变成了`modelValue`;如果要改变变量的值，要执行一个事件`this.$emit('update:modelValue', value)`
- 对于没有使用默认绑定变量modelValue变量的情况：父组件使用`v-model:xxx="prop`来传递prop，子组件使用`$emit('update:xxx', argu)`返回给父组件值。`xxx`为组件传值的属性名，`argu`为子组件返回给父组件的值。`xxx`要 一致，能够对应上。
    - 子组件：使用v-model默认绑定变量的场景
    ```
    let props = defineProps({
        // 声明了v-model默认绑定的变量 - modelValue
        modelValue: Number
    })

    // 定义事件： 'update:modelValue'
    let emits = defineEmits(['update:modelValue']);

    function onRate(num) {
        // 执行事件： 'update:modelValue'
        emits('update:modelValue',num);
    }
    ```
    - 父组件：使用v-model默认绑定变量的场景
    ```
    // 使用时，对于默认绑定的变量，可以直接使用v-model
    <Rate v-model="score">
    ```
    - 子组件：使用其他变量的场景
    ```
    let props = defineProps({
        // 声明了v-model绑定的变量 - value
        value: Number
    })

    // 定义事件： 'update:value'
    let emits = defineEmits(['update:value']);

    function onRate(num) {
        // 执行事件： 'update:value'
        emits('update:value',num);
    }
    ```
    - 父组件：使用其他变量的场景
    ```
    <Rate v-model:value="score">
    ```
- [Element3评级组件的实现](https://github.com/hug-sun/element3/blob/master/packages/element3/packages/rate/Rate.vue)

### 插槽
- slot插槽，显示组件的子元素

## Vue中的动画

- Vue3中使用内置的`transition`组件来实现动画效果
- `transition`需设置name属性。mode属性
- 实现动画的原理
    - enter: v-enter-active
    ```
    opacity: 0 - v-enter-from
    opacity: 1 - v-enter-to 
    ```
    - leave: v-leave-active
    ```
    opacity: 1 - v-leave-from
    opacity: 0 - v-leave-to
    ```

- `transition-group`：
    - 在v-for渲染列表的场景下，我们使用`transition-group`组件去包裹元素，通过tag属性指定渲染一个元素。
    - 不仅可以进入和离开动画，还可以改变定位。这个功能新增了`v-move`类
- 更精准的控制动画：在transition组件上使用一下三个方法
    - `before-enter`：
    - `enter`：
    - `after-enter`：动画结束后的钩子函数

## Vuex

### vuex基础
- 集中式存储管理应用的所有组件的状态
- 安装：`npm install vux@next`
- 创建：
    ```
    import { createStore } from 'vuex';

    const store = createStore({
        state() {
            return {
                count: 666
            }
        },
        mutations: {
            add(state) {
                state.count++;
            }
        }
    })
    ```
- 注册：
    ```
    import store from './store/index.js';
    app.use(store);
    ```
- 使用：
    ```
    import { useStore } from 'vuex';
    let store = useStore();
    let count = computed(() => store.state.count)

    function add() {
        store.commit('add');
    }
    ```

### 手写迷你Vuex
- 创建一个变量store用来存储数据
- 将这个store包装成响应式数据，并提供给vue组价使用
- [`provide/inject`来做数据共享](https://v3.cn.vuejs.org/guide/component-provide-inject.html#%E5%A4%84%E7%90%86%E5%93%8D%E5%BA%94%E6%80%A7)
- 实现: **vue的插件机制 + reactive响应式功能**
    ```
    import { inject, reactive } from  'vue';

    const STORE_KEY = '__store__';

    function useStore() {
        return inject(STORE_KEY)
    }

    function createStore(options) {
        return new Store(options);
    }
    // Store 类来管理数据，内部使用 _state 来存储数据；mutations来存储 数据修改 的函数
    class Store {
        constructor (options) {
            // 用reactive包装成响应式对象
            this._state = reactive({
                data: options.state()
            })
            this._mutations = options.mutations
        }

        get state() {
            return this._state.data;
        }

        commit = (type, payload) => {
            const entry = this._mutations[type];
            entry && entry(this.state, payload);
        }

        // 为了让useStore能够正常工作，我们需要给给store增加一个install方法，这个方法会在app.use函数内部执行
        install (app) {
            app.provide(STORE_KEY, this);
        }
    }

    export { createStore, useStore }
    ```
- 使用：为了让useStore能够正常工作，我们需要给给store增加一个install方法，这个方法会在app.use函数内部执行。`app.provide`函数注册给全局的组件
    ```
    class Store {
        //....
        install(app) {
            app.provide(STORE_KEY, this)
        }
    }

    import store from './gvuex';
    app.use(store);
    ```

### Vuex实战
**vuex就是一个公用版本的ref**
- 使用getters来实现computed的功能
- 实际项目中，有很多数据我们都是从网络请求中获取到的。在Vuex中，mutation的设计就是用来实现`同步`的修改数据。如果数据`异步`修改的，我们需要一个新的配置`action`
    - 同步：mutation
    - 异步：action - 并不是直接修改数据，而是通过提交mutation的方式去修改数据。调用方式是 `store.dispatch`
- Vuex的整体逻辑：
    - Vue的组件负责渲染页面
    - 组件中的跨页面数据，用state存储
    - Vue通过actions / mutations 去做数据的修改
    - `view -> actions -> state -> view`
- Vuex中所有数据修改都是通过mutations来完成的。

### 下一代Vuex
- Vuex对TypeScript的类型推导的支持很复杂
- `Pinia` - 天然对类型推导非常友好。API设计非常接近Vuex5


## vue-router

### 前端路由的实现原理

#### hash模式
- 通过URL中#后面的内容做区分，称之为`hash-router`
- createWenHashHistory()函数
- `hashChange`监听变化
- hash值的变化并不会导致浏览器页面的刷新，只会触发hashChange事件。通过对hasChange事件的监听，我们可以在fn函数内部进行动态的的页面切换。
    ```
    window.addEventListener('hashchange', fn);
    ```
#### history模式
- 路由看起来和正常的URL完全一致
- createWebHistory()函数
- `popState`监听变化
- 2014年后，HTML5标准 发布，浏览器多了`pushState`和`replaceState`两个API。通过这两个API，我们可以改变URL的地址，并且浏览器不会向后端发送请求，同时还会触发`popState`事件。
    ```
    // 监听到通过pushState修改路由的变化，在fn函数中实现页面的更新
    window.addEventlistener('popstate', fn);
    ```

### 手写vue-router - hash模式的路由
- Router类管理路由
- creatWenHsahHistory()返回hash模式相关的监听代码。返回当前URL、监听hashchange事件的方法
- install方法注册实例
- createRouter方法创建Router实例
- useRouter方法获取路由实例
    ```
    import { ref, inject } from 'vue';
    import RouterLink from './RouterLink.vue';
    import RouterView from './RouterView.vue';

    const ROUTER_KEY = '__router__';

    // 创建路由
    function createRouter(options) {
        return new Router(options);
    }

    function useRouter() {
        return inject(ROUTER_KEY);
    }

    // 创建 hash 模式的路由
    function createWebHashHistory() {
        function bindEvents(fn) {
            window.addEventListener('hashchange', fn);
        }

        return {
            bindEvents,
            url: window.location.hash.slice(1) || ''
        }
    }

    // Router类管理路由
    class Router {
        constructor(options) {
            this.history = options.history;
            this.routes = options.routes;
            this.current = ref(this.history.url);

            this.history.bindEvents(() => {
                this.current.value = window.location.hash.slice(1);
            })
        }

        install(app) {
            app.provide(ROUTER_KEY, this);
            app.component('router-view', RouterView);
            app.component('router-link', RouterLink);
        }
    }

    export { createRouter, createWebHashHistory,  useRouter }

    ```
- 注册两个内置组件`router-view`、`router-view`
    - Router实例中，返回了current，即当前路由地址，是响应式的数据
    - router-view组件：当current变化时，去匹配current地址对应的组件，然后动态的渲染router-view
        ```
        <template>
            <component :is="comp"></component>
        </template>

        <script setup>
        import { computed } from 'vue';
        import { useRouter } from '../grouter/index.js';

        // 获取当前路由实例
        let router = useRouter();

        const comp = computed(() => {
            // 根据当前路由，在用户路由配置route中计算出匹配的组件，component动态渲染组件
            const route = router.routes.find((route) => route.path === router.current.value)

            return route ? route.component : null;
        })
        </script>
        ```
    - router-link组件：组件中有一个`a`标签，只是`a`标签的href属性前面加了一个#，实现hash的修改。
    - 在Router文件中引入，并在install方法中，注册两个组件
- 路由的懒加载
- 路由的正则匹配。。。

#### 路由实现的总结(HTML5标准出现后)
- API: location.hash; Event: hashchange -> `hash模式`
- API: history.pushState 、 history.replaceState; Event: popstate -> `history模式`
- API的介绍可参考红宝书第4版、12章
- 大致意思就是：hash的改变不触发页面reloads；pushState、replaceState改变history也不触发reloads。

### vue-router实战要点

#### 路由匹配
- 支持动态路由: `:id` 是路由的动态部分
    ```
    const routes = [
        { path: '/user/:id', name: 'user', component: User }
    ]
    ```

#### 路由导航守卫
- 支持做到根据用户对页面的控制

#### 动态导入功能
- 路由懒加载，解决首屏渲染性能问题

### tips
- 此前hash的运用是页面中的锚点定位
- history模式需要后端配合，nginx新增配置，将所有路由都指向index.html
- history路由与html5配合更好，能充分利用html5的特性，比如html5中监听滚动条的状态等，history都可以监听，也更利于SEO
- **不管是手写实现vuex还是手写实现vue-router，都会用到provide/inject**

## Vue Devtools - 调试工具

### 浏览器自带的调试工具

#### console
- [console的讲解-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Console)
- 在main.js中加入以下代码，可以直接在控制台中打印出stackoverflow搜索的地址
    ```
    window.onerror = function(e){
        console.log(['https://stackoverflow.com/search?q=[js]+'+e])
    }
    ```
- console.log
- console.info
- console.error
- console.table
- ...

**tips**

一道面试题：统计一个网页一共有多少种标签

```
new Set([...document.querySelectorAll('*')].map(n=>n.nodeName)).size
```

统计出现次数最多的三种标签

```
Object.entries([...document.querySelectorAll("*")].map(n=>n.tagName).reduce((pre, cur)=>{
  pre[cur] = (pre[cur] || 0) + 1;
  return pre;
}, {})).sort((a, b)=>b[1]-a[1]).slice(0, 3)
```

### Vue Devtools
- [安装](https://devtools.vuejs.org/guide/installation.html)

### 断点调试
- debugger

 ### 性能相关的调试
- `performace` tab页面
- [chorme官方文档](https://developer.chrome.com/docs/devtools/evaluate-performance)
- lighthouse 生成性能报告。根据性能报告中的相关建议。可以对网页进行性能的提升

## JSX

### h函数
- [官网教程](https://v3.cn.vuejs.org/api/global-api.html#createapp)
    - 返回一个”虚拟节点“，通常缩写为`VNode`：一个普通对象，其中包含向Vue描述它应在页面上渲染哪种节点的信息，包括所有子节点的描述，用于手动编写的`渲染函数`
    - 内部调用了`createVnode`来返回虚拟DOM。
    - 参数：`type`，`props`，`children`
        - **type**: HTML标签名、组件、异步组件或函数式组件 - `必须的参数` - `String | Object | Function`
        - **props**: 一个对象，与将在模板中使用的attribute、prop和事件对应 - `可选参数` - `Object`
        - **children**: 子代VNode，使用`h()`生成，或者使用字符串来获取`文本VNode`，或者带有插槽的对象 - `可选` - `String | Array | Object`
    - 栗子
        ```
        render() {
            return h('h1', {}, 'Some title')
        }


        h('div', {}, [
            'Some text comes first.',
            h('h1', 'A headline'),
            h(MyComponent, {
                someProp: 'foobar'
            })
        ])
        ```
- template是vue3的默认写法，Vue会把`<template>`解析为`render`函数，之后，组件运行的时候，通过render函数去返回虚拟DOM。`除了写template，在某些场景下，我们可以直接写render函数来实现组件。`
- 栗子
    ```
    import { defineComponent, h } from 'vue';

    export default defineComponent({
        props: {
            level: {
                type: Number,
                required: true
            }
        },
        setup(props, { slots }) {
            return () => h(
                'h' + props.level, // 标签名
                {}, // 标签的prop 或者 attribute
                slots.default() // 子节点
            )
        }
    })
    ```
- 手写h函数，可以处理动态性更高的场景，如果是复杂的场景，h函数处理起来就会很复杂，需要把所有属性都转为对象 --> 替代方案 `JSX`

### JSX
- **在JavaScript里面写HTML的语法，就叫JSX。**是对JavaScript语法的一个扩展。 - 是h函数的一个语法糖，本质上就是JavaScript
- [官方教程](https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md)
- JSX的语法：
    ```
    const element = <h1 id="app">Hello, World</h1>;
    ```
- JSX的本质：
    ```
    // h 函数内部也是调用这个函数返回虚拟DOM
    const element = createVnode('h1', { id: 'app' }, 'hello, world');
    ```
- JSX到createVnode的转换
    - 安装插件
        ```
        npm install @vitejs/plugin-vue-jsx -D
        ```
    - 配置
        ```
        // vite.config.js
        import vueJsx from 'vue-jsx'

        export default defineConfig({
            plugins: [vueJsx()]
        })
        ```
    - 定义
        ```
        import { defineComponent, h } from 'vue';

        export default defineComponent({
            props: {
                level: {
                    type: Number,
                    required: true
                }
            },
            // 标签名都需要动态处理的需求
            setup(props, { slots }) {
                // return () => h(
                //     'h' + props.level, // 标签名
                //     {}, // 标签的prop 或者 attribute
                //     slots.default() // 子节点
                // )

                // 引入JSX之后的写法
                const tag = 'h' + props.level;
                return () => <tag>{ slots.default() }</tag>
            }
        })
        ```
    - 使用：与组件使用方式一致
- Tips:
    - vModel取代v-model： `vModel={title.value}`
    - onClick取到@click
    - .map取到v-for
    - 三元表达式取到v-if

### JSX 和 Template
- JSX的优势
    - JSX可以支持更动态的需求，而template则因为语法限制的原因，不能够像JSX那样可以支持更动态的需求
    - JSX：可以正在一个文件返回多个组件
- Template的优势
    - 静态标签直接越过Diff过程
    - 高效利用缓存


## Vue3 中使用 TypeScript
提高代码可维护性和调试效率的强类型语言-TypeScript

### 什么是TypeScript
相当于在JavaScript外面包裹了一层类型系统。

[演示连接](https://www.typescriptlang.org/play?#code/FAGwpgLgBAxg9gVwE4GcwDkCGBbMAuFCJASwDsBzKAXigHJBK50Bt4gNQTAGZALRUDbtQNwtbQkKAAcSMfKQTYARmCTUoARgBMATkHRiKAPKkQZfNLhxwmUgqJtgwUcXELaACzAgQcKAHc4SEABMBQA)

### TypeScript进阶用法 - 泛型
- 泛型就是指有些函数的参数，你在定义的时候是不确定的类型，而是返回值类型需要根据参数来确定。
- 我们再函数名后面的用尖括号包裹一个类型占位符
    ```
    function test<某种类型> (args: 某种类型): 某种类型 {
        return args
    }

    // 调用
    test(1)
    test<number>(1)
    ```
- 栗子：实现一个函数getProperty，动态的返回对象的属性
    ```
    function getProperty<某种类型， 某种属性 extends keyof 某种类型>(o: 某种类型， name: 某种属性)： 某种类型[某种属性] {
        return o[name]
    }

    function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
        return o[name];
    }
    ```


### Vue3中的TypeScript
- 使用：lang="ts" 标记当前组件使用TypeScript
    ```
    <script lang="ts"></script>
    import { computed, reactive, ref, defineProps, defineEmits } from '@vue/runtime-core';

    interface 极客时间课程 {
        name: string,
        price: number
    }

    const msg = ref('') // 根据输入参数推导字符串类型
    const msg1 = ref<string>('') // 可以通过泛型显示约束

    const obj = reactive({})
    const obj2 = reactive<极客时间课程>({ name: '玩转Vue3全家桶', price: 129 })


    const msg2 = computed(() => '') // 默认推导参数
    const course2 = computed<极客时间课程>(() => {
        return { name: '玩转Vue3全家桶', price: 129 }
    })

    const props = defineProps<{
        title: string,
        value?: number
    }>()

    const emit = defineEmits<{
        (e: 'update', value: number): void
    }>()
    ```
- vue-router
    - vue-router提供了`Router`，`RouteRecordRaw`两个路由的类型。
    - 路由的配置：RouteRecordRaw
    - 返回的router实例：Router
    ```
    import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router'

    const routes: Array<RouteRecordRaw> = [
        ...
    ]

    const router: Router = createRouter({
        history: createWebHashHistory(),
        routes
    })

    export default router
    ```


## Vue项目规范和基础库
 - Vite + Vue3 + Vue Router + Vuex + Element3 + Axios + Sass
### 组件库
`npm install element3 --save`
```
import Element3 from 'element3';
import 'element3/lib/theme-chalk/index.css';
app.use(ELement3)
```
### 工具库
#### axios
`npm install axios --save`

#### sass
`npm install -D sass`
```
<style lang="scss>
$padding: 10px    // 变量

</style>
```
### 代码规范和提交规范

### ESLint - 代码规范
- 安装：`npm install eslint -D`
- 配置：根目录下执行`npx eslint --init`
- eslintric.json配置额外的校验规则
- `npx eslint src`：检测src目录下哪些代码不合规范
- 执行git commit命令的时候，同时执行ESLint：使用`husky`管理git的钩子函数，在每次代码提交至git之前去执行ESLint，校验通过才可以提交代码
### git - 提交规范
- Vue3的代码提交日志格式：【类别：信息】
    - fix - 修复
    - feat = 功能开发
- git提交规范：描述信息精准的git提交日志，会让我们在后期的维护和处理bug是有据可查


## 项目开发中的权限系统
- 栗子项目 Vite-Course

### 登录权限

#### mock模拟数据
- 安装mockjs
    ```
        npm install mockjs vite-plugin-mock cross-env -D
    ```
- 在vite.config.js中添加mockjs插件
    ```
    import { viteMockServe } from 'vite-plugin-mock'


    plugins: [vue(), vueJsx(), viteMockServe({
        // default
        mockPath: 'mock',
        localEnabled: true,
    })]

    ```
#### token
- 通常把用户名、过期日期等重要信心进行加密，生成一个token返回前端，前端后续的请求都需要带上token才可以认证通过
### 页面权限

#### 路由导航守卫
- [路由导航守卫官网地址](https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html)
### 角色权限
- 控制一类角色的页面权限：动态路由.
- 一部分页面是写在代码的src/router/index.js中，另外一部分是我们通过axios获取数据之后，通过调用vue-router的addRoute方法到动态的添加进项目整体的路由配置的。
- 静态路由与动态路由之分
#### 动态路由
- [动态路由](https://next.router.vuejs.org/zh/guide/advanced/dynamic-routing.html)



----- 还没有代码开放出来 -----
1、登录页面还没写
2、mock模拟数据不清楚
3、模拟请求不清楚

流程：
1、mock数据
2、jwt生成token
3、拦截器Token夹头
4、路由守卫权限验证
5、登录逻辑

## Vue3 中如何集成第三方框架

### 独立的第三方库
- 栗子 - NProgress 进度条工具
     - 安装： `npm install nprogress -D`
     - 使用：在需要使用的地方，import  `import NProgress from 'nprogress'` 。router.beforeEach来开始进度条；router.afterEach来结束进度条。

### 组件的封装
- 栗子 - 可视化组件的封装（echart   G2）
- 在vue3中继承ECharts的最简单的方式，就是封装一个Chart组件，吧option配置以参数的形式的形式传递给Chart组件
- PS：记个坑 - 
    ```
    <div ref="chartRef" class="chart" style="height: 300px; width: 200px"></div>

    // 通过ref获取DOM - PS --- 这里的名称必须和 ref="chartRef"名称一致
    let chartRef = ref();
    ```

### 指令的封装
- 栗子 - 图片懒加载，在img标签之上加上v-lazy的属性；聚焦指令
    ```
    app.directive('focus', {
        // 当被绑定的元素挂载到DOM中时
        moumted(el) {
            // 聚焦
            el.foucs()
        }
    })
    ```
- 指令的生命周期和组件的类似。指令要支持vue的插件机制，所以需要install方法
    ```
    const lazyPlugin = {
        install(app, options) {
            app.directive('lazy', {
                mounted: ...,
                updated: ...,
                unmounted: ...
            })
        }
    }
    ```
- v-loading指令的实现
    ```
    const loadingDirective = {
        mounted: function (el, binding, vnode) {
            const mask = createComponent(Loading, {
                ...options,
                onAfterLeave() {
                    el.domVisible = false
                    const target =
                    binding.modifiers.fullscreen || binding.modifiers.body
                        ? document.body
                        : el
                    removeClass(target, 'el-loading-parent--relative')
                    removeClass(target, 'el-loading-parent--hidden')
                }
            })
            el.options = options
            el.instance = mask.proxy
            el.mask = mask.proxy.$el
            el.maskStyle = {}

            binding.value && toggleLoading(el, binding)
        },

        updated: function (el, binding) {
            el.instance.setText(el.getAttribute('element-loading-text'))
            if (binding.oldValue !== binding.value) {
                toggleLoading(el, binding)
            }
        },

        unmounted: function () {
            el.instance && el.instance.close()
        }
    }

    export default {
        install(app) {
            // if (Vue.prototype.$isServer) return
            app.directive('loading', loadingDirective)
        }
    }
    ```

    ```
    createComponent - 是Element3的工具函数，其实就是使用h包裹了一下组件
    https://github.com/hug-sun/element3/blob/master/packages/element3/src/composables/component.js#L11
    ```

### Vue3 中的全局变量
- `app.config.globalPropertoes.xxx` 注册全局变量

## Vue3中的性能优化

### 项目整体执行流程

#### 用户输入URL到页面显示的过程
- 输入URL
- DNS域名解析获取IP地址
- 向服务器发起HTTP请求（基于TCP）
- 后端返回内容
- 浏览器解析HTML
- 加载HTML代码中的需要加载的CSS和JavaScript
- 执行JavaScript代码（执行VUE）
- vue-router解析路由
### 网络请求优化
- 首页的标签中，使用标签去通知浏览器对页面中出现的其他域名去做DNS的预解析。比如页面中的图片通常都是防止在独立的CDN域名下，这样页面首页的时候就能预先解析域名并把结果缓存起来。
- 获取网络文件的优化。http请求底层的TCP协议每次都需要进行三次握手，获取的文件较多时，三次握手的消耗也会比较大。
    - 让文件尽可能的减少。 - 文件打包之后再上线；CSS雪碧图进行图片打包。（HTTP2之前，文件打包还是有效的，HTTP2全面普及之后，多路复用可以降低三次握手的消耗）
    - 让文件尽可能的小一些。文件的压缩
- 图片懒加载
- 路由懒加载
- 文件大小方面，使用可视化的插件来查看包大小的分布。
    ```
    npm install rollup-plugin-visualizer

    // viet.config.js文件中
        
    import { visualizer } from 'rollup-plugin-visualizer'
    export default defineConfig({
        plugins: [vue(),vueJsx(), visualizer()],
    })

    npm run build 打包，根目录下的stat.html文件，打开后可以看到分析报告
    ```

    ```
    webpack项目中；
    npm install webpack-bundle-analyzer

    ```
- 浏览器的缓存机制：高效利用文件缓存。 Expires  Cache-control   last-modify  etag

### 代码效率优化
- 栗子
    ```
    function fib(n){
        if(n<=1) return 1
        return fib(n-1)+fib(n-2)
    }

    let count = ref(fib(38))
    ```
    ```

    function fib(n){
        let arr = [1,1]
        let i = 2
        while(i<=n){
            arr[i] = arr[i-1]+arr[i-2]
            i++
        }
        return arr[n]
    }
    ```

### 性能检测报告
- lighthouse性能报告
    - FCP：First Content Paint - 页面上呈现第一个DOM元素的时间。在此之前，页面都是白屏状态
    - TTI：Time To Interactive - 页面可以开始交互的时间。
    - LCP：Largest Contentful Paint - 页面视口上最大的图片或者文本块渲染的时间
- 可以通过代码中的performance对象去动态获取性能指标数据，并且统一发送给后端，实现网页性能的监控 [!performance](./img/performance.png)
    ```
    let timing = window.performance && window.performance.timing
    let navigation = window.performance && window.performance.navigation

    DNS 解析：
    let dns = timing.domainLookupEnd - timing.domainLookupStart

    总体网络交互耗时：
    let network = timing.responseEnd - timing.navigationStart

    渲染处理：
    let processing = (timing.domComplete || timing.domLoading) - timing.domLoading

    可交互：
    let active = timing.domInteractive - timing.navigationStart
    ```

## 加餐

### 项目中的亮点 - 文件上传

#### 文件断点续传
- 文件上传的实现：axios.post
- 把文件切成数据块一次上传，若上传的过程中出现了网络错误，那么再次上传的时候，就会把已经存在的切片列表过滤掉，只上传其他的切片
- 文件上传之前，需要在前端计算出一个文件的Hash值作为唯一标识，用来向后端询问切片的列表。采用MD5算法求hash值，也会造成浏览器的卡顿，通过web-worker可以解决主这一问题；或者借鉴react时间切片来解决计算hash卡顿的问题。
- [文件上传的演示代码](https://github.com/shengxinjing/file-upload)

### 项目中的亮点 - 列表渲染

#### 虚拟列表
- 只渲染可视区域内的DOM元素，避免因为页面中DOM元素过多，而引起的卡顿问题。


## 打包发布Vue3应用

## 加餐 - TypeScript

### TypeScript入门
- TypeScript可以在JavaScript的基础上，对变量的数据类型加以限制。最基本的数据类型包括：`布尔`、`数字`、`字符串`、`null`、`undefined`
- 当不确定一个变量应该使用哪种类型的变量时，使用`any`来声明变量
- `enum`定义枚举类型，可以把类型限制在指定的场景之内
- 通过`|`组合出新的类型
- 通过`interface`接口可以定义对象的类型限制，
    - readonly可限制某个属性是否可编辑
    - `?`可设置 为可选属性
- 函数的类型限制
    ```
    // 大致语法
    function 函数名(参数: 参数类型): 返回值类型 {}
    ```
- 使用变量的方式去定义函数 - （可读性稍微差点）
    ```
    // 大致语法
    (参数类型) => 返回值类型
    let add1: (a: number, b: number) => number = function(x: number, y: number) {
        return x + y;
    }

    // 使用type关键字去定义函数的类型
    type addType = (a: number, b: number) => number
    let add2:addType = function(x: number, y:number) {
        return x+ y
    }

    // 使用interface关键字去定义函数类型
    interface addType1 {
        (a: number, b: number): number
    }
    let add3:addType2 = function(x: number, y: number) {
        return x + y;
    }

    ```
- 函数重载 - 函数支持多个类型的参数  --  [vue3源码](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/src/ref.ts#L72)
    ```
    // 要求。参数是数字，返回的是数字；参数是字符串，返回的是字符串
    function reverse(x: number): number
    function reverse(x: string): string
    function reverse(x: number | string): number | string | viod {
        if (tyoeof x === 'string') {
            return x.split('').reverse().join();
        } else if (typeof x === 'number') {
            return Number(x.toString().split('').reverse().join());
        }
    }
    ```

- **浏览器变量和属性** [typeScript源码](https://github.com/Microsoft/TypeScript/tree/main/src/lib)
    - Window : window类型
    - HTMLElement ：dom元素类型
    - NodeList ：节点列表类型
    - MouseEvent ：鼠标点击事件类型

    ```
    // window对象
    let w:Window = window;
    // dom元素
    let ele:HTMLElement = document.createElement('div');
    // 节点列表
    let allDiv:NodeList = document.querySelectorAll('class-name');
    // 鼠标事件
    ele.addEventListener('click', function(e:MouseEvent) {
        const args:IAguments = arguments;
        w.alert(1)
        console.log(args);
    }, false)
    ```

- 一些第三方框架的数据类型
    ```
    import { ref, Ref } from 'vue';

    interface Todo {
        title: string,
        done: boolean
    }

    let todos:Ref = ref([{ title: '学习Vue', done: false }])
    ```

### 泛型
TypeScript可以进行类型编程，极大提高TypeScript在复杂场景下的应用场景

- 栗子：返回值的类型和参数的类型一致。
    ```
    // T 相当于给函数定义了一个类型变量， 【type T = arg的类型】
    function identity<T>(arg: T): T {
        return arg
    }

    // 此时的T是string，返回值的类型也是string
    identity<string>('玩转Vue3全家桶')
    identity<number>(1)
    ```
- 利用泛型，把函数参数定义成类型
    ```
    interface VueCourse5 {
        name: string,
        price: number
    }

    // 只能是name和price中选一个 --- 使用了 keyof 语法，获得已知类型VueCourse5的属性列表
    type courseProps = keyof VueCourse5
    let k:CourseProps = 'name'
    let k1:CourseProps = 'price'
    ```
- `keyof`：可以用来拆解已有类型
- `extends`：实现类型系统中的条件判定 -- `T extends U ? X : Y` -- 类型三元表达式
    ```
    // 定义ExtendsType函数，接收泛型参数T，通过判断T是不是布尔值，来返回不同类型的字符串。实现通过传入不同的参数来返回不同的类型
    type ExtendsType<T> = T extends boolean ? '重学前端' : '玩转Vue3全家桶'
    type ExtendsType1 = ExtendsType<boolean> // type ExtendsType1 = '重学前端'
    type ExtendsType2 = ExtendsType<string> // type ExtendsType2 = '玩转Vue3全家桶'
    ```
- `in`：实现遍历
    ```
    type Course = '玩转Vue3全家桶' | '重学前端'
    type CourseObj = {
        [k in Course]: number // 遍历Course类型作为key
    }

    // 等同于
    type Course = {
        '玩转Vue3全家桶': number,
        '重学前端': number
    }
    ```
- 栗子
    ```
    // K extends keyof T  // 限制K的类型必须是T的属性之一
    functiongetProperty<T, K extends keyof T>(o: T, name: K): T[K] {
        return o[name]
    }

    const coursePrice:CourseObj = {
        '玩转Vue3': 129,
        '重学前端': 129
    }

    getProperty(coursePrice, '玩转Vue3')；
    getProperty(coursePrice, '重学前端');
    getProperty(coursePrice, '重学');
    ```
- `infer`：**<T>**可以给函数参数定义类型变量，**infer**则可以在**extends**关键字之后的变量设置类型变量，更加细致的控制类型。**不是很理解？？？**
    ```
    type Foo = () => CourseObj

    // 如果T是一个函数，并且函数返回类型是P就返回P - infer P
    type ReturnType1<T> = T extends () => infer P ? P: never
    type Foo1 = ReturnType1<Foo>
    ```

### 实战练习


[TypeScript练习题](https://github.com/type-challenges/type-challenges/blob/master/README.zh-CN.md)


## 如果设计自己的通用组件库？

**项目名称：vue-ts-ailemente**

基础组件 + 数据组件 + 表单组件+ 通知组件
### 技术栈
vite + TypeScript + Sass + ESLint

### 环境搭建
**Tips : 安装第三方包的时候，用npm，但是到了初始化的时候，用npx，？**

**npm 是把包安装到本地的node_modules里，比如我们安装了husky，但是并没有全局安装，直接执行husky会提示找不到，npx就是可以直接使用mode_moudulesn内部安装命令的工具**

- npm init vite@latest
- project-name: ailemente
- cd ailemente
- npm install
- npm run dev
- npm install -D husky `配置Git的钩子函数 - 安装husky`
- npx husky install `初始化husky - 根目录下生成 .husky 文件夹`
- npx husky add .husky/commit-msg "node scripts/verifyCommit.js" `npx husky add 命令 新增 commit msg 钩子`
    - windows系统中，执行上面的命令，可能会识别不了，需要分开执行
    - 第一步：`npx husky sdd .husky/commit-msg`
    - 第二部：`在.husky文件下的commit-msg文件中，写入 node scripts/verifyCommit.js`
- **package.json中，配置githooks**
    ```
    "scripts": {
        "gitHooks": {
            "commit-msg": "node scripts/verifyCommit.js"
        }
    }
    ```
- `.git/COMMIT_EDITMSG`保存git提交时的描述信息的文件
- verifyCommit.js
    ```
    1、读取.git/COMMIT_EDITMSG文件中的commit提交的信息
    2、正则校验提交信息的格式等
    3、校验不通过，终止代码的提交
    ```
- git钩子
    - commit-msg：提交代码的时候执行的 -- 校验提交的信息
    - pre-commit：提交代码之前执行的 -- ESLint检测代码格式
- 添加代码格式校验
    - `npx husky add .husky/pre-commit "npm run lint"`
    - 以上命令同样可以拆解
    - package.json文件中配置命令`lint: eslint --fix --ext .ts, .vue src`
    - Vue3不要求只有一个根元素，在eslint的rules中配置`"vue/no-multiple-template-root": "off"`，关闭一个根元素的校验
    - vue3.2中不需要显式的引入`definProps`等，需要在eslint配置中加入：
        ```
        "env": {
            "vue/setup-compiler-macros": true
        },
        ```

### 布局组件

##### 样式的处理
scss 的mixin：

```
$namespace: 'el';
@mixin b($block) {
    $B: $namespace + '-' + $block !global; // 通过传进来的block生成新的变量$B，拼接上了 饿了
    .#{$B} {
        @content;
    }
}

// 添加后缀啥的
@mixin when($state) {
    @at-root {
        &.#{$state-prefix + $state} {
            @content;
        }
    }
}
```
```
@import '../styles/mixin.scss';
@include b(container) {
    display: flex;
    flex-direction: row;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
    min-width: 0;
    @include when(vertical) {
        flex-direction: column;
    }
}
```

##### 组件注册
使用插件机制对外暴露安装的接口
```
import {App} from 'vue'
import ElContainer from './Container.vue'
import ElHeader from './Header.vue'
import ElFooter from './Footer.vue'
import ElAside from './Aside.vue'
import ElMain from './Main.vue'

export default {
  install(app:App){
    app.component(ElContainer.name,ElContainer)
    app.component(ElHeader.name,ElHeader)
    app.component(ElFooter.name,ElFooter)
    app.component(ElAside.name,ElAside)
    app.component(ElMain.name,ElMain)
  }
}
```

## 单元测试
写好测试的函数，可以`node`命令运行函数来测试；在提交代码之前，执行测试函数。

-- TDD开发 -  测试驱动开发

### Jest
#### 安装
```
npm install -D jest@26 vue-jest@next @vue/test-utils@next
npm install -D babel-jest@26 @babel/core @babel/preset-env
npm install -D ts-jest@26 @babel/preset-typescript @types/jest
```

- vue-jest 和 @vue/test-utils 是测试 Vue 组件必备的库
- babel转码的库
- Jest 适配 TypeScript 的库

#### 配置
- .babel.config.js文件配置 -- 为了让babel解析到node和typescipt环境中
    ```
    module.exports = {
        presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-typescript',
        ],
    }
    ```
- 新建`jest.config.js`文件 -- 配置jest的测试行为。
- 不同格式的文件需要使用不同的命令来配置。
    - .vue：vue-test
    - .js .jsx: babel-test
    - .ts: ts-test
- 匹配文件名是`xx.spec.js`。Jest 只会执行.spec.js 结尾的文件
- package.json文件中：scripts中 增加 `"test": "jest"`

#### button组件
- 配置vue全局变量
    ```
    const app = createApp(App);

    app.config.globalProperties.$AILEMENT = {
        size: 'large'
    }
    ```
- vue3获取当前的实例
    ```
    getCurrentInstance获取当前的实例 ; 对应的TS类型 - ComponnetIternalInstance
    import { getCurrentInstance } from 'vue';

    export function useGlobalConfig() {
        const instance:ComponentInternalInstance|null = getCurrentInstance();
        if (!instance) {
            console.log('useGlobalConfig必须得在setup里面整');
            return;
        }

        return instance.appContext.config.globalProperties.$AILEMENTE || {}
    }
    ```

- jest.config.js文件增加配置
    - collectCoverage: true // 表示需要收集代码测试覆盖率
    - 以上配置之后，执行npm run test，根目录下会有coverage目录，index.html文件 打开之后会有报告

- husky/pre-commit文件
    - 增加npm run test命令，每次提交代码之前，都会先执行测试，测试通过才可以提交代码
## 表单组件

## 弹窗组件

## 树组件

## 表格组件

## 组件的可交互式文档

## 自定义渲染器

## 手写响应式系统

## vue运行时

## 虚拟DOM

## 编译原理





## 自定义渲染器
渲染器是围绕虚拟DOM存在的。

### 渲染器的创建

runtime-core模块暴露的接口：createElement　createText insert    remote  setText patchProps等

runtime-dom中传入以上方法的具体实现（不同平台的不同实现）

### 渲染器的实现
渲染到小程序平台：vue3-miniapp
渲染到canvas：vue3-canvas

**以canvas渲染器为例**
将canvas维护成一个对象，每次操作的时候直接把canvas重绘一下就可以

```
import { createRender } from '@vue/runtime-core'

const { createApp: originCa } = createRender({
    insert: (child, parent, anchor) => {

    },
    createElement(type, isSVG, isCustom) {

    },
    setElementText(node, text) {

    },
    patchProp(el, key, prev, next) {

    }
})
```

每次直接更改对应的虚拟DOM，然后重绘。

**自定义渲染器的原理：就是把所有的增删改查操作暴露出去，使用的时候不需要知道内部的实现细节，我们只需要针对每个平台使用不同的API即可。**

适配器设计模式的一个实现。


## vue2 VS vue3
https://github.com/shengxinjing/vue3-vs-vue2.git


## 响应式
把普通的JavaScript对象封装成响应式对象，拦截数据的获取和修改操作。实现依赖数据的自动化更新。

一个简单的响应式模型，我们可以通过reactive或者ref函数，把数据包构成响应式对象，并且通过effect函数注册回调函数，然后在数据修改之后，响应式的通知effect去执行回调函即可。

![get和set]("./img/getAndSet.webp")


### track
track函数：targetMap去存储依赖关系。map的key是我们要代理的target对象呢，值还是一个depsMap。存储着每一个ky依赖的函数，每一个key都可以依赖多个effect。

依赖地图：
targetMap = {
    target: {
        key1: [回调函数1， 回调函数2],
        key2: [回调函数3， 回调函数4]
    },
    target1: {
        key3: [回调函数5 ]
    }
}

```track.js


const targetMap = new WeakMap()

export function track(target, type, key) {

  // console.log(`触发 track -> target: ${target} type:${type} key:${key}`)

  // 1. 先基于 target 找到对应的 dep
  // 如果是第一次的话，那么就需要初始化
  // {
  //   target1: {//depsmap
  //     key:[effect1,effect2]
  //   }
  // }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    // 初始化 depsMap 的逻辑
    // depsMap = new Map()
    // targetMap.set(target, depsMap)
    // 上面两行可以简写成下面的
    targetMap.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
  }
  if (!deps.has(activeEffect) && activeEffect) {
    // 防止重复注册
    deps.add(activeEffect)
  }
  depsMap.set(key, deps)
}

```


### trigger
trigger函数的实现思路就是**从targetMap中，根据target和key找到对应的依赖函数集合deps，然后遍历deps执行依赖函数**

### effect
我们需要在effect函数中把依赖函数进行包装，并对依赖函数的执行时机进行控制（scheduler）。

依赖的收集：
    把传递进来的fn函数通过effectFn函数包裹执行，在effectFn函数内部，把函数赋值给全局变量activeEffect；然后执行fn()的时候，就会触发响应式对象的get函数，get函数内部就会把activeEffect存储到依赖地图中，完成依赖的收集。

```

export function effect(fn, options = {}) {
  // effect嵌套，通过队列管理
  const effectFn = () => {
    try {
      activeEffect = effectFn
      //fn执行的时候，内部读取响应式数据的时候，就能在get配置里读取到activeEffect
      return fn()
    } finally {
      activeEffect = null
    }
  }
  if (!options.lazy) {
    //没有配置lazy 直接执行
    effectFn()
  }
  effectFn.scheduler = options.scheduler // 调度时机 watchEffect回用到
  return effectFn
  
}
```

scheduler：手动控制函数执行的时机，方便应对一些性能优化的场景。比如：数据在一次交互中可能会被修改多次，我们不想每次修改都重新执行effect函数，而是合并最终的状态之后，最后统一修改一次。

### ref
ref也可以包裹复杂的数据结构，内部会直接调用reactive来实现。

### computed
是一个特殊的effect函数。computed可以传递一个函数或者对象，实现计算属性的读取和修改。

拦截computed的value属性，并且定制了effect的lazy和scheduler配置，computed注册的函数就不会直接执行，而是要通过scheduler函数中的_dirty属性决定是否执行。

## 运行时
**首次渲染 + 更新后的渲染** -- 前端框架需要处理的两个最核心的流程。

### 首次渲染
createApp - 项目初始化渲染的入口。

app.mount() - mount的参数：Element、ShadowRoot、string --> normalizeContainer --> 将传递的参数统一变为浏览器的DOM元素。

ensureRender函数，内部通过createRenderer函数，创建了一个浏览器的渲染器，并且缓存了渲染器的renderer。（使用闭包做缓存）

createRenderer函数的参数：rendererOptions -- 浏览器里面标签的增删改查API。通过调用baseCreateRenderer创建的。

baseCreateRenderer 是学习Vue源码最复杂的一个函数。

nodeOps传递进来的 -- 平台上所有的insert、remove函数；vue更新、渲染的函数。

![createApp]('./../img/createAPP.webp')

- createApp -- 就是createAppAPI(render, hudrate)
    - createAppAPI方法：
        - 内部创建了app对象
        - app上注册了use、component、mount等方法
        - mount内部执行的是传递进来的render函数
        - container就是我们app.mount中传递的DOM元素，对DOM元素进行处理之后，执行patch函数实现整个应用的加载
    
    - render方法：内部判断了container容器上有没有_vnode属性，有则执行unmount方法，卸载掉老的虚拟dom，没有的话就执行patch方法，然后把vnode信息存储在contianer._vnode上。

### patch函数

patch函数传递的是container._vnode，也就是上一次渲染缓存的vnode、本次渲染组件的vnode以及container。

```
// n1 上次渲染的虚拟DOM
// n2 下次要渲染的虚拟DOM
const patch: patchFn = (n1, n2, container) {}
```

- patch的规则：
    - n1 n2 节点类型不同，直接unmount之前的节点
    - n1 n2 节点类型相同，根据具体的类型执行不同的patch函数
      - processText
      - processFragment
      - processElement
      - processComponent --> 首次渲染时的App是一个组件，走的是processComponent方法
      - 。。。等等

### processComponent方法
- mountComponent
  - 对组件的类型进行一系列的判断
  - setupComponent函数
    - createComponentInstance --- 创建组件实例
    - setupComponent --- 执行setup函数（就是我们写的script setup）
      - 在这个函数内部从component中获取了setup属性
    - setupRenderEffect --- 监听副作用（reactivity -- 响应式effect）
  - setupRenderEffect函数 -- 为了后续数据修改注册的函数
    - 组件首次加载会调用patch函数去初始化子组件，setupRenderEffect函数本身就是在patch函数内部执行的，所以这里就会递归整个虚拟DOM树，然后触发生命周期mounted，完成这个组件的初始化。。首次更新结束之后，setupRenderEffect函数不仅实现了组件的递归渲染，还注册了组件的更新机制。
- updateComponent


Vue通过createApp创建应用，并且执行返回的mount方法实现在浏览器的中的挂在，在createApp中，通过传递浏览器平台的操作方法nodeOps创建了浏览器的渲染器renderer。

首次执行Vue项目，通过patch实现组件的渲染，最终通过setupComponent执行组件的setup函数，setupRenderEffect中使用响应式的effect函数监听函数数据变化。

[weiyuyi -- 迷你版vue](https://github.com/shengxinjing/weiyouyi/blob/main/src/runtime-core/renderer.js)

## 虚拟DOM

### vue虚拟DOM执行流程
template会被解析成JavaScript函数，这个函数会返回虚拟DOM

```
function render() {
    return h('div', { id: 'app' }, children: [
        h('p', {}, 'hello world'),
        h(Rate, { value: 4 })
    ])
}
```

### DOM的创建
**createVNode**函数创建虚拟DOM。

- mount函数的核心逻辑：
    - setupComponent执行我们写的script setup函数
    - setupRenderEffect监听组件的数据变化

给组件注册了update方法，这个方法用effect包裹之后，当组件内的ref、reactive包裹的响应式数据变化时就会执行这个update方法，触发组件内部的更新机制。

effect函数，负责注册组件，这个函数也是Vue组件更新的入口函数。

### patch函数

数据更新之后，就会执行patch函数。在patch函数中，会针对不同的组件类型执行不同的函数。

- updateComponent
  - 由于更新之后不是首次渲染了，patch函数内部会执行updateComponent（首次渲染 执行mountComponent）
  - shouldUpdateComponent会判断组件是否需要更新
  - 实际执行的是 instance.update
  - 组件的子元素是由HTML标签和组件构成，组件内部的递归处理最终也是对HTML标签的处理，所以，最后组件的更新都会进入到processElement内部的patchElement函数中。

### patchElement
- 通过patchFlag可以做到按需更新（性能的优化）
    - 如果标记了FULL_PROPS，就直接调用patchProps
    - 如果标签了CLASS，说明节点只有class属性是动态的，其他style等属性都不需要进行判断和DOM操作

做的两件事
- 更新节点自己的属性：patchFlag按需更新
- 更新子元素：patchChildren执行子元素的更新

### 子元素的更新
由patchChildren函数负责，难度最高的一个函数。

**实现思路：**

子元素分为了数组、文本、空，三种状态

- 如果新的子元素是空，老的子元素不为空，直接卸载unmount即可
- 如果新的子元素不为空，老的子元素是空，直接加载即可
- 如果新的子元素是文本
  - 老的子元素如果是数组，就全部unmount
  - 老的子元素是文本，就执行hostSetElementText
- 如果新的子元素是数组，比如用v-for渲染出来的列表，老的子元素如果是空的或者文本，直接unmount后，渲染新的数组
- 新的子元素是数组，老的子元素也是数组
  - 需要判断出可以服用的DOM元素。如果一个虚拟DOM没有改动或者属性变了，不需要完全销毁重建，而是更新一下属性 ---> **patchKeyedChildren函数**
  - patchKeyedChildren做的就是尽可能高效的把老的子元素更新成新的子元素


### patchKeyedChildren

双端对比算法比较新老子节点的差异，尽可能少的减少更新次数。

最长递增子序列算法来实现，相比react的虚拟DOM diff，新增了双端的预先判断 + 最长递增子序列算法来实现。

### 位运算
使用位运算来实现Vue中的按需更新，让静态节点可以越过虚拟DOM的计算逻辑。

- 通过虚拟DOM节点的patchFlag属性判断是否需要更新节点。使用的就是 **&** （按位与） 操作符来判断操作的类型。
  - patchFlag & PatchFlags.CLASS 判断当前元素的class属性是否需要计算diff
  - shape & ShapeFlags.ELEMENT 判断当前虚拟DOM是HTML组件还是Component组件。
  
- 在JavaScript中，我们可以很方便的使用`toString(2)`的方式，把十进制数据转换为二进制数据
```
(12).toString(2) // 1100

1 << 2 // 1左移两位，变成 100,转换为十进制就是 4
```

- 两个二进制的与运算`&`：只有两个位置都是1的时候，结果才为1，其余结果都是0
- 两个二进制的或运算`|`：只有两个位置都是0的时候，结果才为0，其余结果都为1
- 左移 `<<` ，右移 `>>`操作符，实现乘以2和除以2的效果
- 在二进制上的计算，性能通常会比字符串和数字的要好

```
    var isPowerOfTwo = function(n) {
        if(n === 1) return true
        while( n > 2 ){
            n = n / 2
            if(n % 2 !== 0) return false
        }
        return n===2
    };

    var isPowerOfTwo1 = function(n) {
        return n > 0 && (n & n - 1) === 0;        
    }

    let num = 1209902300798019300;

    console.time('2的幂次方');
    isPowerOfTwo(num);
    console.timeEnd('2的幂次方');

    
    console.time('2的幂次方');
    isPowerOfTwo1(num);
    console.timeEnd('2的幂次方');
```

- diff算法中使用位运算
  - Vue中的动态属性：文本、class、style、props等，使用二进制中的一个位置来表示权限。下列代码，使用左移的方式在四个二进制上标记了1，代表四种不同的权限，使用按位或的方式实现权限授予。
    ```
    const PatchFlags = {
        TEXT: 1,        // 0001
        CLASS: 1 << 1,  // 0010
        STYLE: 1 << 2,  // 0100
        PROPS: 1 << 3   // 1000
    }

    const flag1 = PatchFlags.TEXT | PatchFlags.STYLE; // 0101

    // 权限校验
    flag1 & PatchFlags.TEXT // 有权限 0001
    flag1 & PatchFlags.CLASS // 无权限 0000
    ```

### 最长递增子序列
**虚拟DOM中的diff算法**

```
给你一个整数数组nums，找到其中最长严格递增子序列的长度

子序列是由数据派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序
例如：[3, 6, 2, 7]是数组[0, 3, 1, 6, 2, 2, 7]的子序列

输入：nums = [10, 9, 2, 5, 3, 7, 101, 18];
输出：4
解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
```

patchKeyChildren的核心逻辑就是，在进行双端对比之后，对无法预判的序列计算出最长递增子序列之后，我们通过编译数组，对其余的元素进行patch或者move的操作，完整的实现了虚拟DOM的diff。

#### 动态规划
```
/**
 * @params { number [] } nums
 * @return { number }
 **/

const lengthOfLIS = function(nums) {
    let n = nums.length;
    if (n == 0) {
        return 0;
    }

    let dp = new Array(n).fill(1);

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j ++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }

    return Math.max(...dp);
}

双层嵌套循环：时间复杂度n的平方
```

#### 贪心 + 二分
- 贪心：寻找递增的子序列，上升的过程，要尽可能的慢。这样才有可能让后面的元素尽可能的也递增。
```
const lengthOfLIS = (nums) => {
    let len = nums.length;

    if (len < 1) {
        return 0;
    }

    // 定义一个空数组，存放子序列数组，初始即为数组第一个元素
    let arr = [nums[0]];

    for (let i = 0; i < len; i++) {
        // 如果nums[i]大于arr尾元素，则arr新增一个元素
        if (nums[i] > arr[arr.length - 1]) {
            arr.push(nums[i]);
        } else {
            // 否则，查找递增子序列中，第一个大于nums[i]的元素，替换它
            // 二分的方法来查找
            let left = 0;
            let right = arr.length - 1;

            while(left < right) {
                // 位运算，每右移一位，相当于除2，左移一位相当于乘2
                let mid = (left + right) >> 1;
                if (arr[mid] < nums[i]) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }

            arr[left] = nums[i];
        }
    }

    return arr.length;
}
```

- getSquenece -- 生成最长递增子序列
  - 1.创建一个空数组result，存储各个元素的索引，最后根据索引值可以找到最长递增的子序列的值
  - 1.遍历nums，将当前项current和result的最后一项对应的值进行比较
    - 当前项大于最后一项，result新增一项
    - 否则针对result数组进行二分查找，找到并替换比当前项大的那项。
  - 2.以上完成之后，因为‘贪心’导致了结果的错乱。
    - 使用**前驱节点**的概念，需要再创建一个数组p，在步骤一往result中新增或者替换新值的时候，同时p新增一项，该项为当前项对应的前一项的索引。
    - result的结果是不准确的，但是result的最后一项是正确的，最后一项最大，根据最后一项的索引，可以查询前一项的索引，依次类推可以查询出正确的result
```js

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
  function getSequence(arr: number[]): number[] {
    const p = arr.slice() //赋值一份arr
    const result = [0] // result中存放的是索引值，第一个元素就是nums的第一个索引 0
    let i, j, u, v, c
    const len = arr.length
    for (i = 0; i < len; i++) {
      const arrI = arr[i]
      if (arrI !== 0) {
        j = result[result.length - 1]
        if (arr[j] < arrI) {
          p[i] = j  // 存储在result最后一个索引的值
          result.push(i)
          continue
        }
        u = 0
        v = result.length - 1
          // 二分查找，查找比arrI小的节点，更新result的值
        while (u < v) {
          c = (u + v) >> 1
          if (arr[result[c]] < arrI) {
            u = c + 1
          } else {
            v = c
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]
          }
          result[u] = i
        }
      }
    }
    u = result.length
    v = result[u - 1]
      // 查找数组p 找到最终的索引
    while (u-- > 0) {
      result[u] = v
      v = p[v]
    }
    return result
  }
```

- 进一步讲解：
    - 首先遍历新列表，通过key去查找在原有列表中的位置，从而得到新列表在原有列表中位置所构成的数组。现在的算法就是通过位置数组判断最小化移动次数。
    - 计算最长递增子序列：在位置数组中递增就能保证在就数组中的相对位置的有序性，从而不需要移动，因此最长递增子序列的最长，可以保证移动的次数最少。


## 编译原理 - compiler
Vue中，组件都是以虚拟DOM的形式存在，加载完毕之后注册effect函数。

组件内部数据变化之后，用vue的响应式机制做到了通知组件更新。

内部使用patch函数实现了虚拟DOM的更新（中间包括了位运算、最长递增子序列等）

[vue编译在线演示](https://vue-next-template-explorer.netlify.app/#eyJzcmMiOiI8ZGl2IGlkPVwiYXBwXCI+XG4gICAgPGRpdiBAY2xpY2s9XCIoKT0+Y29uc29sZS5sb2coeHgpXCIgOmlkPVwibmFtZVwiPnt7bmFtZX19PC9kaXY+XG4gICAgPGgxIDpuYW1lPVwidGl0bGVcIj7njqnovax2dWUzPC9oMT5cbiAgICA8cCA+57yW6K+R5Y6f55CGPC9wPlxuPC9kaXY+XG4iLCJzc3IiOmZhbHNlLCJvcHRpb25zIjp7ImhvaXN0U3RhdGljIjp0cnVlLCJjYWNoZUhhbmRsZXJzIjp0cnVlLCJvcHRpbWl6ZUJpbmRpbmdzIjpmYWxzZX19)

Vue的compiler实现了template到render函数的转变

### 整体流程
- 代码会被解析成一个对象（类似于虚拟DOM的对象，描述template的代码关系） -- 抽象语法树（简称ATS）
- transform模块对代码进行优化
- generate模块最终生成render函数
- 即：**template -- 词法分析 -- 语法分析（tokenziner函数） -- AST（parse函数） -- transform模块（transform函数 -- travese函数，标记静态节点） -- generate模块（generate函数 -- 遍历AST，拼接最后要执行的函数字符串） -- render函数**

```
function compiler(templte) {
    const ast = parse(template);
    transform(ast);
    const code = generate(ast);
    return code;
}

let template = `<div id="app">
        <div @click="()=>console.log(xx)" :id="name">{{name}}</div>
        <h1 :name="title">玩转vue3</h1>
        <p >编译原理</p>
    </div>`

const renderFunction = compiler(template);
console.log(renderFunction);
```

### 具体实现

#### tokenizer
- 词法分析，将 `<div>` `@click` `{{}}`等语法识别出来，转换成一个个的token。可以理解为把template的语法进行了分类，这一步就叫tokenizer
- tokens数组存储解析的结果，对模板字符串进行循环 -- `< > / 空格` -- 字符串中的关键分隔符
- push方法将分割后的token存储在数组tokens中

#### 生成抽象语法树 AST
根据tokenziner函数的返回值数组，按照标签的嵌套关系转换成树形结构 -- parse函数

```
[
  { type: 'tagstart', val: 'div' },
  { type: 'props', val: 'id="app"' },
  { type: 'tagstart', val: 'div' },
  { type: 'props', val: '@click="()=console.log(xx)"' },
  { type: 'props', val: ':id="name"' },
  { type: 'text', val: '{{name}}' },
  { type: 'tagend', val: 'div' },
  { type: 'tagstart', val: 'h1' },
  { type: 'props', val: ':name="title"' },
  { type: 'text', val: '玩转vue3' },
  { type: 'tagend', val: 'h1' },
  { type: 'tagstart', val: 'p' },
  { type: 'text', val: '编译原理' },
  { type: 'tagend', val: 'p' },
  { type: 'tagend', val: 'div' }
```

- 首先使用一个ast对象作为根节点
    ```
    let ast = {
        type: 'root',
        props: [],
        children: []
    }
    ```
- walk函数遍历整个tokens数组，根据token的类型不同，生成不同的node对象
- 根据tagend的状态来决定walk的递归逻辑


```
{
  "type": "root",
  "props": [],
  "children": [
    {
      "type": "element",
      "tag": "div",
      "props": [
        {
          "key": "id",
          "val": "\"app\""
        }
      ],
      "children": [
        {
          "type": "element",
          "tag": "div",
          "props": [
            {
              "key": "@click",
              "val": "\"()"
            },
            {
              "key": ":id",
              "val": "\"name\""
            }
          ],
          "children": [
            {
              "type": "text",
              "val": "{{name}}"
            }
          ]
        },
        {
          "type": "element",
          "tag": "h1",
          "props": [
            {
              "key": ":name",
              "val": "\"title\""
            }
          ],
          "children": [
            {
              "type": "text",
              "val": "玩转vue3"
            }
          ]
        },
        {
          "type": "element",
          "tag": "p",
          "props": [],
          "children": [
            {
              "type": "text",
              "val": "编译原理"
            }
          ]
        }
      ]
    }
  ]
}
```


#### 语义分析和优化

**transform函数**

transform函数实现语义的分析和优化。理解Vue中的语法，并为最后的生成代码做准备。

traverse函数递归整个AST，并且在这一步实现简单的静态标记。

当节点标记为`element`，默认使用`ast.flag`标记节点的动态状态。

如果属性是`@`开头的，就认为它是Vue中的事件绑定，使用`arg.flag |= PatchFlags.EVENT`标记当前节点的事件是动态的。

`冒号`开头的就是动态的属性，并且把class和style标记了不同的flag。

如果都没有命中的话，就使用`static:true`，标记当前节点是静态节点

**generate函数**
walk函数遍历整个AST，拼接成最后要执行的函数字符串。

遍历过程中，会收集依赖

最后在createVNode函数的最后 一个参数带上ast.flag进行状态的标记。

最终生成了目标代码render函数，这个函数最终会和组件的setup函数一起组成运行时的组件对象。

**vue的compiler输出的代码会有几个hoisted开头的变量，这些变量是用于静态节点提升，就是在整个生命周期中只需要进行一次创建，有效节省不必要的性能开销**

### vue compiler入口
- 四个和compiler相关的包
  - compiler-core：浏览器端的编译（需深入研究）。实际使用的方法是core提供的
  - compiler-dom：浏览器端的编译（需深入研究）。负责传入浏览器DOM相关的API
  - compiler-ssr：服务端渲染
  - compiler-sfc：编译.vue单文件的
  
```
export function compiler(template: string, options: CompilerOptions = {}): CodegenResult {
    return baseCompiler(
        template,
        extend({}, parseOptions, options, {
            nodeTransforms: [
                ignoreSideEffectTags,
                ...DOMNodeTransforms,
                ...(options.nodeTransforms || {})
            ],
            directiveTransforms: extend(
                {},
                DOMDirectiveTransforms,
                options.directiveTransforms || {}
            ),
            transformHoist: __BROWSER__ ? null : stringifyStatic
        })
    )
}
```

#### compiler-dom
负责传入浏览器Dom相关的配置。

- baseCompiler:
    - parseOptions中的isNativeTag区分了element和component。内部把所有的html标签存储在一个对象中，用于对比是不是浏览器自带的element。


### Vue浏览器端编译的核心流程
- baseCompiler函数，是vue浏览器端编译的核心流程
    - baseParse -- **createPaseContext**
      - parseInterpolation负责标识变量的分隔符
      - parseTextData获取变量的值，并且通过innerStart和innerEnd去记录插值的位置
      - parseText处理模板中的普通文本，主要是把文本包裹成AST对象。
      - parseElement
        - 首先判断pre和v-pre标签，
        - 然后通过isVoidtag判断 标签是否是自闭和
        - 递归调用parseChidlren，再解析开始标签、子节点，最终解析结束标签
        - parseTag解析节点
          - parseAttribute处理属性，对pre和v-pre标签进行检查
          - isComponent判断是否为组件
            - 通过isNativeTag辅助判断，最终返回一个描述节点的对象，包含当前节点所有解析之后的信息，tag - 标签名，children - 子节点的数组

### AST的语义化分析
transform函数的核心逻辑就是识别一个个的Vue语法，并且进行编译器的优化，我们常提到的静态标记就是这一步完成的。

**createTransformContext**

- transform
  - traverseNode函数，可编译AST所有的节点。内部通过nodetype来具体执行不同的函数
  - tranformElement函数，转换节点，用来处理props和children的静态标记
  - transformText函数转换文本
  - transformIf：v-if的语法转换
  - transformFor：v-for的语法转换
  - transformOn：v-on的语法转换
  - transformModel：v-model的语法转换

### template到render函数的转化
generate函数，首先通过 createCodegenContext 创建上下文对象，然后通过 genModulePreamble 生成预先定义好的代码模板，然后生成 render 函数，最后生成创建虚拟 DOM 的表达式

**createCodegenContext**

- generate函数
  - genModulePreamble：生成预先定义好的代码模板，生成import风格的代码
  - genNode：生成创建虚拟DOM的代码，针对变量、标签、v-if等等有不同的代码生成逻辑

### 编译原理带来的好处

#### vite插件

利用编译原理的思想，通过正则匹配的方式，完全可以分析出来当前组件依赖的API有哪些，这样就可以在组件执行之前自动导入这些API。

[auto-import](https://github.com/antfu/unplugin-auto-import)

[vite插件开发文档](https://cn.vitejs.dev/guide/api-plugin.html)

#### Babel
编译原理思想，代码转换自动处理`async``await`，以及`try...catch`

- babel提供了完整的代码解析的能力，包括AST的解析，语义分析，代码生成等。
  - @babel/parse：提供了代码解析的能力，能够把js代码解析成AST，代码就从字符串变成树形结构
  - @babel/traverse：提供了遍历AST的能力，可以从traverse中获取每一个节点的信息去修改它
  - @babel/types：提供了类型判断的函数，方便的判断每一个节点的类型
  - @babel/core：提供了代码转换的能力


## vite原理

### webpack
webpack的核心原理就是通过分析JavaScript中的require语句，分析出当前JavaScript文件所有的依赖文件，然后递归分析之后，就得到了整个项目的一个依赖图。对依赖图中不同的文件执行不同loader，比如会把css文件解析成加载CSS标签的JavaScript，最后基于这个依赖图获取所有的文件。

进行打包处理之后，放在内存中提供给浏览器使用，然后dev-server会启动一个测试服务器打开页面，并且在代码文件修改之后，可以通过`WebSocket`的方式通知前端自动更新页面，也就是我们熟悉的热更新功能。

webpack项目调试之前，要把所有的文件依赖关系收集完，打包处理后才能启动测试，对开发效率方面就会产生一定的影响。针对webpack这种bundle的思路，社区就诞生了bundless的框架，vite就是其中之一。

前端项目之所以需要打包，是因为浏览器里的JavaScript没有很好的方式去引入其他文件，webpack 提供的打包功能可以帮助我们更好地组织开发代码，但是现在大部分浏览器都支持了 ES6 的 module 功能，我们在浏览器内使用 type="module"标记一个 script 后，在 src/main.js 中就可以直接使用 import 语法去引入一个新的 JavaScript 文件。这样我们其实可以不依赖 webpack 的打包功能，利用浏览器的 module 功能就可以重新组织我们的代码。

```
// 目前浏览器可以支持这样的写法
<script type="module" src="/src/main.js"></script>
```

### vite原理

- 浏览器的module功能：浏览器识别出JavaScript中的import语句之后，会发起一个新的网络请求去获取新的文件，所以只支持`/`, `./`, `../`开头的路径
- 对CSS的解析，如果url是.css结尾的，就返回一段JavaScript代码，这段JavaScript会再浏览器内创建一个style标签，标签内部放入我们读取的CSS文件代码
    ```
        if(url.endsWith('.css')){
            const p = path.resolve(__dirname,url.slice(1))
            const file = fs.readFileSync(p,'utf-8')
            const content = `
            const css = "${file.replace(/\n/g,'')}"
            let link = document.createElement('style')
            link.setAttribute('type', 'text/css')
            document.head.appendChild(link)
            link.innerHTML = css
            export default css
            `
            ctx.type = 'application/javascript'
            ctx.body = content
        }
    ```
- 热更新实现：在客户端注入一个额外的JavaScript文件，这个文件用来和后端实现`websocket`通信

- webpack启动服务器之前需要进行项目的打包，vite则是直接启动服务，通过浏览器运行时的请求拦截，实现首页文件的按需加载，实现开发服务器启动的时间和整个项目的复杂度解耦。
- vite的主要目的是提供一个调试服务器，vite也可以和Vue解耦，实现对任何框架的支持，只需要使用对应框架的vite插件就可以支持任意框架。
- vite能够这么快，还有一个原因就是使用了esbuild去解析JavaScript文件


```
1.  请求 首页http://xxx.xxx.xxx/ 
2.  返回 index.html
3.  请求 /src/main.js
4. 发现请求js文件，替换路径为相对路径后，返回修改后的js文件
5.  请求 @module/vue
6.  发现请求@module内的文件，替换文件内为相对路径后，返回package.json中module定义的入口文件
7.  请求 ./App.vue
8.  判断 .vue 的请求后，通过 compilerSFC.parse解析 Vue 组件，通过返回的 descriptor.script 获取 js 代码
9.  请求 ./App.vue?type=template
10.  调用 compilerDom.compile 解析 template 内容，直接返回 render 函数
```

[mini-vite源码](https://github.com/shengxinjing/geektime-vue-course/tree/main/vite-mini)

## 数据流原理 Vuex & Pinia

### vuex5
- 支持compositionAPI和OptionAPI
- 去掉了namespace模式
- 使用组合store的方式更好的支持了ts的类型推导
- 去掉了容易混淆的`mutation``action`概念，只保留了`action`
- 支持自动的代码切割

### pinia - 未来的vuex
- [pinia地址](https://pinia.vuejs.org/)
- 安装：`npm install pinia@next`
- 导入：`import { createPinia } from pinia`
- 使用：`const pinia = createPinia(); app.use(pinia)`

    ```
    // 定义count
    import { defineStore } from 'pinia';
    export const useCounterStore = defineStore('count', {
        id: 'count',
        state: () => {
            return { count: 1 }
        },
        actions: {
            add() {
                this.count++;
            }
        }
    })

    // 使用
    import { useCounterStore } from '../store/count';

    const count = useCounterStore();
    function add() {
        count.add(); // 触发actions，实现数据的修改
        // count.$patch({ count: count + 1 }) // 还可以通过调用内部方法的方式来更新store数据
    }
    ```
    ```
    // composition方式定义count
    import { defineStore } from 'pinia';

    export const useCounterStore = defineStore('count', () => {
        const count = ref(0);
        function increment() {
            count.value++;
        }

        return { count, increment };
    })
    ```

### pinia源码
- [pinia的github](https://github.com/vuejs/pinia)
- createPinia函数
  - ref创建响应式数据对象`state`
  - `install`方法支持`app.use`的注册
  - 内部通过`provide`的语法和全局`$pinia`配置pinia对象
  - use方法和toBeInstalled数组实现了Pinia的插件机制
  - pinia.use(devtoolsPlugin)实现了对VueDevtools的支持 
  - pinia实例就是ref({})包裹的响应式对象，项目中用到的state都会挂载到Pinia这个响应式对象内部
- defineStore函数
  - useStore方法定义每一个store，每个store都会标记`唯一的id`
    - getCurrentInstance获取当前组件的实例，如果useStore参数没有Pinia的话，就会`inject`去获取Pinia的实例，`这里的inject就是createPinia方法中install方法提供的`
    - setActivePinia函数
    - 根据创建实例时使用composition还是option，使用`createSetupStore`或者`createOptionsStore`

## 前端路由原理

### 入口分析
createRouter方法创建路由，app.use加载vur-router插件，并且注册内置组件router-view、router-link

### 路由安装 - install方法
install方法内部注册了RouterLink和RouterView两个全局组件。

app.provide给全局注册了route和reactive包裹之后的reactiveRoute对象（provide提供的数据没有做响应式封装，需要响应式的时候需要自己使用ref或者reactive封装为响应式对象）


- router-view
  - setup函数返回了routerview组件的render函数
  - 直接使用`<router-view/>`，没有slot的情况下，返回的就是component变量。component变量使用h函数返回ViewComponent的虚拟DOM
  - ViewComponent根据matchedRoute.components[props.name]计算来的
  - matchedRoute最终来源于Router的install方法中注入的currentRoute对象

### 路由更新
**router-view渲染的组件是根据当前匹配的路由变量matchedRoute决定的**

- matcher的由来：
  - createRouterMatcher方法，传入routes配置的路由数组，返回创建的RouterMatcher对象，内部遍历routes数组，通过addRoute挨个处理路由配置。

`createWebHashHistory和createWebHistory`方法内部，都是通过`useHistoryListener`实现路由的监听，通过`useHistoryStateNavigation`实现路由的切换。`useHistoryStateNavigation`会返回push和replace方法来更新路由。

## 服务端渲染原理
SSR- Server Side Rendering

### SSR

#### 为什么有SSR？
MVVM盛行，Vue和React的全家桶都有框架的身影，所有页面的渲染流程也全部都是浏览器加载完JavaScript文件后，由JavaScript获取当前的路由地址，再决定渲染哪个页面。

- CSR - 客户端渲染：
  - 首页白屏时间可能过长。
  - 搜索引擎爬虫抓取到页面数据，body还为空，不利于SEO

在用户访问页面的时候，能够把首页渲染的HTML内容写入到body内部，也就是说我们需要再服务端实现组件的渲染。

#### 如何实现SSR？
- 库：`@vue/server-renderer`
- 创建文件夹vue-ssr
- 安装`server-renderer`,`vue`,`express`
- 新建server.js
  ```
       /**
        * 实现在服务端解析Vue的组件，直接把渲染结果返回给浏览器
        * **/

        const express = require('express');
        const app = express();
        const Vue = require('vue');
        const renderer3 = require('@vue/server-renderer');
        const vue3Compile = require('@vue/compiler-ssr');

        // vue组件
        const vueapp = {
            template: `<div>
                <h1 @click="add">{{ num }}</h1>
                <ul>
                    <li v-for="(todo, n) in todos">{{ n + 1 }}--{{ todo }}</li>
                </ul>
            </div>`,
            data() {
                return {
                    num: 1,
                    todos: ['吃饭', '睡觉', '打豆豆'],
                };
            },
            methods: {
                add() {
                    this.num++;
                },
            },
        };

        // 使用@vue/compiler-ssr解析template
        vueapp.ssrRender = new Function('require', vue3Compile.compile(vueapp.template).code)(require);

        // 路由首页返回结果
        app.get('/', async function (req, res) {
            let vapp = Vue.createSSRApp(vueapp);
            let html = await renderer3.renderToString(vapp);
            const title = 'Vue SSR';
            let ret = `<!DOCTYPE html>
                            <html lang="en">
                                <head>
                                    <meta charset="UTF-8" />
                                    <link rel="icon" href="/favicon.ico" />
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                                    <title>${title}</title>
                                </head>
                                <body>
                                    <div id="app">${html}</div>
                                </body>
                            </html>`;
            res.send(ret);
        });

        app.listen(9093, () => {
            console.log('listen 9093');
        })

  ```

#### 源码


