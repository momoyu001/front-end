# vue路由

## 路由模式
- `new Router`的时候，`mode`设置使用哪种模式，默认是`hash`模式
    ```
    const routes = [];

    const router = new Router({
        routes,
        mode: 'hash'    // mode: 'history'
    })
    ```
### hash模式
- 在链接后面添加 `#`+路由名称， 根据匹配这个字段的变化，触发`hasChange`事件。类似于页面上的a标签的锚点。不会刷新页面。
- 使用URL的hash来模拟一个完整的URL，页面不会重新加载。
### history模式
- 使用浏览器的`historyAPI`：`pushState`, `replaceState`。
- 通过调用`pushState`来操作浏览器的`history`对象，改变当前地址，同时结合`window.onpopState`监听浏览器的前进和后退，实现无刷新的页面跳转。
- `pushState`：添加一条记录。
- `replaceState`：替换一条记录。
- 该模式需要服务端进行配合，否则刷新页面会造成404错误，找不到页面。服务端需要进行重定向的配置，将页面都指向index.html。
### abstract模式
### 两种路由模式的区别

## 传参的两种方式
### query
- 参数以`?query=foo`这种形式展示在地址栏中。
- query传参时，既可以使用`path`，也可以使用`name`。
### params
- 通过在路由定义中配置，params参数可以`/`的形式显示在地址栏里面，刷新也不会消失。没有配置的话，params参数不会显示到地址栏中，这时刷新页面params参数就消失了。
- params传参，不可以搭配`path`进行路由跳转，否则参数会失效。

## 路由的使用
- 路由匹配到的组件将渲染到`<router-view></router-view>`标签中。
### 标签形式（声明式导航）
- `<router-link></router-link>`标签：`to`属性指定链接。
- 该标签会被默认渲染成一个`<a></a>`标签。
- 当`<router-link></router-link>`对应的路由匹配成功，将自动设置class属性值`.router-link-active`。
- 点击该标签，会在内部调用`router.push()`方法。
- `<router-link :to="" replace></router-link>` 调用的是`router.replace()`方法。
### 编程式导航
- `router.push(location, onComplete？, onAbort？)`，这个方法会向history栈添加一个新的记录（浏览器的前进后退按钮）。
    - location参数
        - 字符串参数
        - 对象参数
            - 提供了`path`参数，`params`就会被忽略
    - onComplete：导航成功完成之后调用的回调函数；可选参数
    - onAbort：导航终止（导航到相同的路由或者当前导航完成之前导航到另一个不同的路由）的回调函数；可选参数
- `router.replace(location, onComplete？, onAbort？)`，这个方法不会向history栈添加记录，是替换掉当前的history记录。
- `router.go(n)`在history记录中向前或者向后退多少步，类似于`window.history.go(n)`
- 和historyAPI的关系：
    - historyAPI：`window.history.pushState`, `window.history.replaceState`, `window.history.go`

### 动态路由匹配
- `{ path: '/user/:id', component: user }` - 匹配`/user/123`，`/user/345`等路由，路由配置中设置了动态的参数，匹配上该路由时，对应的参数值会被设置到`this.$route.params`中
- 路由定义时的‘路径参数’，都会设置到`$route.params`中
    ```
    /user/:username/post/:post_id
    /user/evan/post/123
    { username: 'evan', post_id: 123 }
    ```
- 路由参数变化，组件会复用，不会销毁并重新创建，这也就意味着`组件的生命周期钩子函数不会被调用`，可以使用watch、beforeRouteUpdated来解决。
- 路由的通配符*匹配
    - 通配符路由应当放在路由配置的最后
    - 通配符的路由，`$route.params`内会自动添加一个名为`pathMatch`参数，包含了通过通配符被匹配的部分。
- 路由定义的优先级：路由定义的越早，优先级越高。
### 命名视图
- 用于需要同时展示多个视图，而不是嵌套展示的场景。
- router-view如果没有名字。默认为`default`；`<router-view></router-view>`相当于`<router-view name="default"></router-view>`
- 此时的路由配置，使用components配置组件（有几个命名视图，就要配置几个组件）。
    ```
    <router-view></router-view>
    <router-view name="a"></router-view>
    <router-view name="b"></router-view>

    const routes = new Router({
        routes: [
            {
                path: '/',
                components: {
                    default: Foo,
                    a: Boo,
                    b: Coo
                }
            }
        ]
    })
    ```
### 路由重定向
- redirect配置。
- 导航守卫并不会应用到跳转路由上，只会应用到目标上。
### 别名
- alias配置
- 当给一个路由配置了别名之后，访问别名时，地址栏显示的是别名，访问原path时，显示的这个path
- redirect，地址栏显示一直是redirect的配置
###  路由组件传参
- 将路由的组件解耦
- `{ path: '/user/:id', component: User }`，参数和路由时耦合的。
- props设置为true时，`$route.params`就会被设置为组件的props属性。
- 通过Props解耦
    ```
    // 路由的定义
    {
        path: '/testDom/:id',
        name: 'testDom',
        meta: { title: 'testDom' },
        component: () => import('@/views/testDom/testDom.vue'),
        props: true
    }
    ```
    ```
    // 访问的路由地址
    /testDom/123
    ```
    ```
    // testDom.vue
    {
        props: {
            id: {
                type: String,
                default: null
            }
        },
        created() {
            console.log(this.id);   // 输出 123
        }
    }
    ```
- 路由定义中的Props：当要匹配命名视图时，需要为各个命名视图都进行配置：`props: { default: true, foo: true }`
- 如果Props被设置对象形式的，那么该对象会按照原样设置为组件的参数，当props静态的时候有用。
- 函数模式：以函数的形式传参。函数只会在路由发生变化时起作用。
    ```
    <script>
        function dynamicPropsFn (route) {
            const now = new Date()

            return {
                name: (now.getFullYear() + parseInt(route.params.years)) + '!'
            }
        }

        let Hello = {
            template: `<div>hello world!!!</div>`,
            props: {
                name: {
                    type: String,
                    default: null
                }
            },
            created() {
                console.log(this.name);
            }
        }


        const router = new VueRouter({
            mode: 'hash',
            // base: __dirname,
            routes: [
                { path: '/', component: Hello }, // No props, no nothing
                { path: '/hello/:name', component: Hello, props: true }, // Pass route.params to props
                { path: '/static', component: Hello, props: { name: 'world' }}, // static values
                { path: '/dynamic/:years', component: Hello, props: dynamicPropsFn }, // custom logic for mapping between route and props
                { path: '/attrs', component: Hello, props: { name: 'attrs' }}
            ]
        })

        new Vue({
            router,
            template: `
                <div id="app">
                <h1>Route props</h1>
                <ul>
                    <li><router-link to="/">/</router-link></li>
                    <li><router-link to="/hello/you">/hello/you</router-link></li>
                    <li><router-link to="/static">/static</router-link></li>
                    <li><router-link to="/dynamic/1">/dynamic/1</router-link></li>
                    <li><router-link to="/attrs">/attrs</router-link></li>
                </ul>
                <router-view class="view" foo="123"></router-view>
                </div>
            `,
            component: {
                Hello
            }
        }).$mount('#app')

    </script>

    // 后四个路由依次打印的内容：you world 2022 attrs
    ```

## 导航守卫
### 全局导航守卫
`router.beforeEach(to, from, next)`：可以创建多个，按照创建的顺序来执行。在所有守卫完成之前，一直处于等待状态。另外两个全居守卫也是可以创建多个的。
`router.beforeResolve(to, from, next)`：路由跳转之前。导航被确认之前，所有`组件内守卫`和`异步路由组件`被解析之后触发，解析守卫就被调用。
`router.beforeAfter(to, from)`：发生在路由跳转完之后，不接受next参数也不会改变导航本身。
### 路由独享守卫
`router.beforeEnter(to, from, next)`：只在进入路由时触发，紧跟在`beforeEach`之后触发。
### 组件独享守卫
`router.beforeRouteEnter(to, from, next)`：不能获取组件的实例，支持给next传递回调（只有它支持给next传递回调）。在`beforeEach`、`beforeEnter`之后执行，此时组件还没有解析完成，在`beforeResolve`和`afterEach`之前触发
`router.beforeRouteUpdate(to, from, next)`：动态参数路径改变，组件被复用时调用。
`router.beforeRouteLeave(to, from, next)`：可以获取组件this实例。可以用于：禁止用户在还未保存之前突然离开。

## 导航解析流程
- 导航被触发
- 在失活的组件里面调用`beforeRouteLeave` - 先离开当前的组件
- 调用全局的`beforeEach` - 在进入下一个路由之前，会先经过全局的导航钩子
- 在重用的组件里面调用`beforeRouteUpdate`   - 
- 在路由配置里面调用`beforeEnter`
- 解析异步路由组件（路由配置中的，异步路由）
- 在被激活的组件里面 调用`beforeRouteEnter`
- 调用全局的`beforeResolve`守卫
- 导航被确认
- 调用全局的`afterEach`
- 触发更新
- 调用`beforeRouteEnter`守卫中传给`next`的回调，创建好的组件实例会作为回调函数的参数传入。

    ![image](../img/路由导航流程.png)


## 过渡动效
- 给所有路由的设置
    ```
    <transition>
        <router-view></router-view>
    </transition>
    ```
- 单个路由的设置
    ```
    const Foo = {
        template: `
            <transition name="slide">
                <div></div>
            </transition>
        `
    }
    ```
- 具体动画效果的定义
    ![image](../img/transition.png)

## 路由中的滚动行为
- 定义路由时的`scrollBehavior`方法来定义滚动行为
    ```
    const router = new Router({
        routes,
        scrollBehavior: (to, from, savedBehavior) => {
            // return 期望滚动到的位置
        }
    })
    ```
    - 第三个参数，当且仅当popState导航才有用，即通过浏览器的前进后退按钮触发的路由变化。
    - 返回值的格式
        ```
        { x: number, y: number }

        { selector: string, offset: { x: number, y: number } }  // selector 滚动到某一个元素的位置（类似锚点定位）

        { selector: string, behavior: 'smooth' }    // 提供原生的平滑的滚动
        ```
