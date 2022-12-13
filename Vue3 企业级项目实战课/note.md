# Vue3 企业级项目实战课

## Vue 的编译和非编译模式

### Vue 代码的编译

1、把代码中的模板编译成基于 JavaScript 代码描述的 VNode；
2、把代码中的 JavaScript 逻辑代码，编译成运行时对应生命周期的逻辑代码；
3、把内置的 CSS 的样式代码抽离出来；

Vue 经过编译后产出的还是 JAvaScript 和 CSS 代码，也就是浏览器可以直接支持运行的代码

原生语法代码：

```vue
<template>
  <div class="v-counter">
    <div class="v-text">{{ num }}</div>
    <button class="v-btn" @click="click">点击数字加1</button>
  </div>
</template>

<script setup>
  import { ref } from 'Vue.js'
  const num = ref(0)
  const click = () => {
    num.value += 1;
  }
</script>

<style>
</style>
```

官方编译器编译之后的代码：

```js
import {
    toDisplayString,
    createElementVNode,
    openBlock,
    createElementBlock,
    ref,
} from "Vue.js";

const _hoisted_1 = {
    class: "v-counter"
}
const _hoisted_2 = {
    class: "v-text"
}

const __sfc__ = {
    __name: 'App',
    setup(__props) {
        const num = ref(0)
        const click = () => {
            num.value += 1;
        }
        return (_ctx, _cache) => {
            return (openBlock(), createElementBlock("div", _hoisted_1, [
                createElementVNode(
                    "div", _hoisted_2, toDisplayString(num.value), 1),
                createElementVNode("button", {
                    class: "v-btn",
                    onClick: click
                }, "点击数字加1")
            ]))
        }
    }

}
__sfc__.__file = "counter.Vue.js"
export default __sfc__
```

编译之后的结果，也就是最原始的 Vue.js 非编译模式的运行方式。

### Vue 的非编译模式

Vue 原生语法有两大块核心内容，就是模板和逻辑，相应的，非编译模式也有模板和逻辑这两个部分。

非编译模式中，模板和逻辑是耦合在组件对象的 setup 方法中的，也可以将模板代码抽离出来放在独立的 render 方法中。

书写模板时，需要使用 VNode 的 API，很繁琐，Vue3 本身提供了一种更加便捷的 API来统一描述VNode，而且不需要关心不同类型 VNode 的不同 API --- `Vue.js.h` 。

大致就是将 createElementVNode 等 VNode 的 API，使用 `h` 函数替换掉，写法上更加便捷。

更加简单的非编译模式就是 `template` 写法的非编译模式。这里的非编译只是在开发过程中不需要编译，最终还是需要编译成 VNode 在浏览器上运行（ `在浏览器中进行编译` ）。

```js
const counter = {
    template: `<div>{{ num }}</div>`,
    setup() {
        // ....
    }
}
```

**非编译模式的作用**

非编译模式直接可以书写出在浏览器运行的 Vue.js 代码，我们就可以跳过开发编译阶段，直接在浏览器里面组装 Vue.js 的代码结构，动态渲染出想要的页面功能。

“组装结构” + “动态渲染” ---> 适用于一切能在浏览器动态搭建的场景，就是低代码搭建页面的场景。

1、辅助排查报错

2、用于低代码的核心解决方案中

**Vue3 非编译模式和 jsx 语法有什么联系？**

jsx 写法来自 react，是一个语法糖，最终会通过编译工具（babel）转换成 `非编译模式` 代码

### 总结

Vue3 的编译模式，即官方提供的通用开发模式，写好的代码需要编译之后才能在浏览器运行

Vue3 的非编译模式有三种写法：（脱离了 webpack、rollup、vite 等构建工具，如何进行开发和在浏览器中运行）

1、使用 VNode 的 API，比如 `createElementVNode` 等编写模板，较为繁琐

2、使用 Vue 本身提供的 `Vue.js.h` ，即 `h` 函数来替代各种 VNode API 的写法

3、使用 `template` 选项直接编写模板。（最终也会在浏览中进行编译转换为 VNode 写法）

## Webpack编译搭建：如何用 Webpack 初构建 Vue 3项目

**webpack 和 vite**
vite --- Web “开发工具链”。其内置了一些打包构建工具，让开发者开箱即用。

webpack --- 构建“打包工具”。面向的是前端代码的编译打包过程。能力单一，仅提供打包功能，有特定构建需要，需要自行选择合适的 Loader 和 Plugin 进行组合配置。

```js
module.exports = {
    module: {
        rules: [] // loader 配置
    },
    plugin: [] // plugin 配置
    externals: {
        'vue': 'window.Vue'
    }
}
```

**externals字段**

用于声明在 webpack 打包编译过程中，有哪些源码依赖的 npm 模块需要“排除打包”处理，也就是不做打包整合处理。上面的配置，就是将 vue3 的运行源码进行“排除打包”处理，让代码最终依赖的 Vue3 运行时，从 window. Vue 全局变量处理。这么做的好处就是通过减少打包的内容来缩短打包时间。

通过 external 和 cdn 来导入库可以利用缓存，显著减少页面需要加载的内容

**webpack 的开发模式和生产模式**
开发模式下，需要安装 `webpack-dev-serve` 这个开发服务依赖模块，让编译的代码能在浏览器中访问。

与之对应的webpack配置：

```js
module.exports = {
    devServer: {
        static: {
            directory: path.join(__dirname),
        },
        compress: true,
        port: 6001,
        hot: false,
        compress: false,
    }
}
```

sourceMap 配置：

[devtool官方文档](https://webpack.js.org/configuration/devtool/#devtool)

```js
module.exports = {
    devtool: 'inline-cheap-module-source-map'
}
```

**htmlWebpackPlugin**
让webpack知道它应该访问哪个 html 文件的配置处理。

```js
module.exports = {
    // 其它 Webpack配置代码
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Hello Vue',
            filename: 'index.html',
            template: './index.html',
            minify: false,
            inject: false,
            templateParameters: {
                publicPath: path.join(__dirname),
                js: [
                    './node_modules/vue/dist/vue.runtime.global.js',
                    './index.js'
                ],
                css: [
                    './index.css'
                ],
            },
        })
    ]
    // 其它 Webpack配置代码
}
```

```html
<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.templateParameters.css[0] %>" />
    <script src="<%= htmlWebpackPlugin.options.templateParameters.js[0] %>"></script>
</head>

<body>
    <div id="app"></div>
</body>
<script src="<%= htmlWebpackPlugin.options.templateParameters.js[1] %>"></script>

</html>
```

## 模版语法和JSX语法

Vue的两种开发语法：模板语法和 JSX 语法

**模板语法**

HTML 语法的一种扩展，它所有的模板节点声明、属性设置和事件注册等都是按照 HTML 的语法来进行扩展设计的。

**JSX 写法**
JSX 写法，是 JavaScript 语法的一种语法扩展，支持在 JavaScript 中直接写类似 HTML 的模板代码，可以理解为 **HTML in JavaScript**。

Vue3 中，借助 `defineComponent` 这个 API 来声明定义。

JSX 中，都是用**单大括号“{state.count}”来作为内部变量处理，而 Vue 模板语法是通过双大括号来表示“{{state.count}}”**

JSX 开发组件，组件的 CSS 代码也是独立放在 CSS 文件，最后通过 import 引入。

```jsx
import {
    defineComponent
} from 'vue';

const Counter = defineComponent({
    // ...
    render(ctx) {
        const {
            state,
            onClick
        } = ctx;

        return ( <
            div class = "counter" >
            <
            div class = "text" > Counter: {
                state.count
            } < /div> <
            button class = "btn"
            onClick = {
                onClick
            } > Add < /button> < /
            div >
        )
    }
})
```

**模板语法和 JSX 语法的区别**

1、模板语法可以设置 `scoped` 属性，JSX 语法不可以设置

2、实现需求场景下的不同，例如“动态组件”的长江，JSX 更有优势

普通功能开发以模板语法为主，方便照顾到团队里不同技术能力程度的组员，让项目技术实现沟通起来方便些。

模板语法比较难实现的功能就换成 JSX 语法实现，例如一些对话框等动态组件场景，主要为了功能灵活实现和后续代码维护。

学习资源：

* [ant-desing-vue](https://github.com/vueComponent/ant-design-vue)

* [vant-ui](https://github.com/youzan/vant)

JSX 语法下，如何实现样式隔离呢？可以参考学习一下 `CSS in JS`
