# 自己建一个前端工程

## 脚手架创建工程 - vue/cli 4.5.11
- vue create vue3-front-tims
    - 选择 vue3 的选项
- cd vue3-front-tims
- npm run serve

## 一些基础配置

### vue.config.js
- 新建vue-config.js文件
    - cmj模块化风格，module.export语法
    - 运行后自动打开浏览器的配置，默认端口号的配置
        ```
        module.export = {
            devServer: {
                compress: true,
                port: 8080,
                open: true
            }
        }
        ```


### 样式方面的配置

#### scss
- 安装：`npm install -D node-sass`；`npm install -D sass-loader@7.3.1`；`npm install -D sass`

### eslint
- 脚手架搭建的过程中已自带eslint

### husky
- 安装：`npm install -D husky`
- husky初始化：`npx husky install`
- 添加钩子文件：
    - 提交之前的钩子：`npx husky add .husky/pre-commit`
    - 提交的钩子：`npx husky add .husky/commit-msg`
- 提交之前进行eslint校验
    - package.json：scripts -- `"lint": "eslint --fix --ext .js, .vue src"`。配置完成后，可执行`npm run lint`进行eslint校验
    - 根目录下，husky文件夹内 -- pre-commit文件：写入`npm run lint`。代码提交之前，会执行pre-commit钩子，从而执行`npm run lint`
- 校验提交的信息
    - 根目录下，husky文件夹内 -- commit-msg文件：写入 `node scripts/verifyCommit.js`。代码提交之前，会执行该钩子函数，执行verifyCommit.js文件中的代码，校验提交信息

### element-plus
- 安装：`npm install element-plus --save`
- 全局注册：
    ```
    import ElementPlus from 'element-plus';
    import 'element-plus/lib/theme-chalk/index.css';

    app.use(ElementPlus);
    ```
### router
- 安装：`npm install vue-router@next`
- 使用：
    ```
    import { createRouter, createWebHashHistory } from 'vue-router';

    const routes = [

    ]

    const router = createRouter({
        history: createWebHashHistory(),
        routes
    })

    // main.js

    export default router;

    import router from './router/index.js';
    app.use(router);
    ```

### vuex
- 安装：`npm install vuex@next`
- 使用：
    ```

    ```