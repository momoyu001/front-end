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
  toDisplayString, createElementVNode, openBlock,
  createElementBlock, ref,
} from "Vue.js";

const _hoisted_1 = { class: "v-counter" }
const _hoisted_2 = { class: "v-text" }

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

书写模板时，需要使用 VNode 的 API，很繁琐，Vue3 本身提供了一种更加便捷的 API来统一描述VNode，而且不需要关心不同类型 VNode 的不同 API --- `Vue.js.h`。

大致就是将 createElementVNode 等 VNode 的 API，使用 `h` 函数替换掉，写法上更加便捷。

更加简单的非编译模式就是 `template` 写法的非编译模式。这里的非编译只是在开发过程中不需要编译，最终还是需要编译成 VNode 在浏览器上运行（`在浏览器中进行编译`）。

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

jsx 写法来自 react，是一个语法糖，最终会通过编译工具（babel）转换成`非编译模式`代码


### 总结
Vue3 的编译模式，即官方提供的通用开发模式，写好的代码需要编译之后才能在浏览器运行

Vue3 的非编译模式有三种写法：（脱离了 webpack、rollup、vite 等构建工具，如何进行开发和在浏览器中运行）

1、使用 VNode 的 API，比如 `createElementVNode` 等编写模板，较为繁琐

2、使用 Vue 本身提供的 `Vue.js.h` ，即 `h` 函数来替代各种 VNode API 的写法

3、使用 `template` 选项直接编写模板。（最终也会在浏览中进行编译转换为 VNode 写法）

