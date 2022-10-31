# webpack

## 为什么需要webpack构建工具？
- 转换ES6语法
- 转换JSX
- CSS前缀补全/预处理器
- 压缩混淆
- 图片压缩

## 初识webpack
- 配置文件：默认配置文件 `webpack.config.js`。可通过webpack --config指定配置文件。
    ```
    // 开发环境
    webpack --config webpack.dev.config.js
    // 生产环境
    webpack --config webpack.product.config.js
    ```
- webpack配置组成
    ```
    module.export = {
        entry: './src/index.js',                        -----------打包的入口文件
        output: './dist/main.js',                       -----------打包的输出
        mode: 'production',                             -----------环境
        module: {
            rules: [                                    -----------loader配置，在这个rules数组里面配置
                { test: /\.txt$/, use: 'raw-loader' }
            ]
        },
        plugins: [                                      -----------插件配置，在这个plugins数组里面配置
            new HtmlwebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
    ```
- 零配置的webpack：webpack4.0中的零配置，包含了entry和output的配置

## 安装webpack
### 环境搭建
- 安装node和npm
- [安装nvm](https://github.com/nvm-sh/nvm)
    - nvm - Node.js Version Manager - 也就是Node.js的包管理器。可以通过它方便安装和切换不同的node.js版本。
    - 通过curl安装：`curl -o- https://raw.githubusercontent.com/nvm/v0.34.0/install.sh | bash` - IOS / Linux安装方式
    - 通过wget安装：``
    - window安装：`https://github.com/coreybutler/nvm-windows`
- 安装webpack、webpack-cli（webpack4.0以后，将webpack和webpack-cli进行分离，安装时，要两个一起安装）
    - 创建空目录和package.json
        ```
        mkdir my-project
        cd my-project
        npm init -y         ----- npm init 初始化  -y 默认所有选项都选择 yes
        ```
    - 安装webpack和webpack-cli
        ```
        npm install webpack webpack-cli --save-dev  ----- 将依赖安装到devDependencies里面
        ```
        - tips: **`devDependencies` 和 `dependencies`**
            - devDependencies：用于本地环境开发时候，只会在开发环境下以依赖的模块，生产环境不会被打入包内 `--save-dev`  `-D`
            - dependencies：用户发布环境。不仅在开发环境能使用，生产环境也能使用    `--save`  `-S`
    - 检查是否安装成功
        ```
        // 可以在 git bash 中运行成功，windows的cmd中会报错
        ./node_modules/.bin/webpack -v
        ```

### 栗子
- 直接运行打包：不指定webpack配置文件的名称，默认的就是webpack.config.js
    ```
    ./node_modules/.bin/webpack -v
    ```
- 通过npm script运行webpack
    ```
    "scripts": {
        "build": "webpack"
    },
    ```
    - 通过运行npm run build运行构建
    - 原理：模块局部安装如果有创建一些命令的话，会在node_modules/.bin目录创建软连接。package.json可以默认读取到.bin目录下这些命令。所以可以再package.json增加scripts，在scripts增加webpack

# webpack基础用法

## entry
- 指定webpack的打包入口

### 单入口
- entry是一个字符串
- 单页应用SPA
    ```
    module.exports = {
        entry: './path/to/my/entry/file.js'
    }

    ```
### 多入口
- entry是一个对象
- 多页应用MPA
    ```
    module.exports = {
        entry: {
            app: './src/app.js',
            adminApp: './src/adminApp.js'
        }
    }
    ```
1. 多个 entry 的时候，最基本的是输出的 js 数量和 entry 数量相同的，js 文件的名字通常是和 entry 的 key 名字一样。比如：
    ```
    entry: {
        index: './src/index/index.js',
        search: './src/searc/index.js'
    }
    ```
    对应输出的 js 文件应该是 index.js 和 search.js。当然了，如果你有做一些代码分割，那么生成的 js 文件会更多，不过页面的主 js 文件数量和 entry 数量是一致的。

2. html 的数量和 entry 的数量也是一致的，如果也是1里面提到的 entry，那么将会生成： index.html 和 search.html。这个可以借助 html-webpack-plugin(https://github.com/jantimon/html-webpack-plugin) 达到效果
## output
- 用来告诉webpack如何将编译后的文件输出到磁盘
- entry对应于源代码，output对应于结果代码
- path: path.join(__dirname, 'dist')。output的参数path必须是一个绝对路径，不能是相对路径

### 单入口配置
    ```
    module.exports = {
        entry: './path/to/my/entry/file.js',
        output: {
            filename: 'bundle.js',
            path: __dirname + './dist'
        }
    }
    ```

### 多入口配置
通过占位符确保文件名称的唯一

    ```
    module.exports = {
        entry: {
            app: './src/app.js',
            search: './src/search.js'
        }
        output: {
            filename: '[name].js',
            path: __dirname + './dist'
        }
    }
    ```
## loaders
- webpack开箱即用只支持`JS`和`JSON`两种文件类型，通过loaders去支持其他的文件类型并且把他们转换成有效的模块，并且可以添加到依赖图中。本身是一个函数，接口源文件作为参数，返回转换的结果。
- 常见loaders：
    - babel-loader：转换ES6、ES7等JS新特性语法
    - css-loader：支持CSS文件的加载和解析
    - less-loader：将less文件转换成CSS
    - ts-loader：将TS转换成JS
    - file-loader：进行图片、字体等的打包
    - raw-loader：将文件以字符串的形式导入
    - thread-loader：多线程打包JS和CSS
- 用法
    - test：指定匹配规则
    - use：指定使用的loader名称
    ```
    module.exports = {
        module: {
            rules: [
                { test: /\.txt$/, use: 'raw-loader' }
            ]
        }
    }
    ```
- tips:
    - less经过less-loader解析成css文件之后，也还要经过 css-loader 的处理，每个loader一般只做一件事情
    - raw-loader ？？？

## plugins
- 插件用于bundle文件的优化，资源管理和环境变量的注入，作用于整个构建过程
- 常见的plugins:
    - CommonsChunkPlugin：将chunks相同的模块代码提取成公共js。常用于多页面打包中。
    **在webpack4中已经不推荐使用了，换成了 splitchunksplugin**
    - CleanWebpackPlugin：清理构建目录
    - ExtractTextWebpackPlugin：将CSS从bundle文件里面提取成一个独立的CSS文件。**webpack4中已经换成了 mini-css-extract-plugin**
    - CopyWebpackPlugin：将文件或者文件夹拷贝到构建的输出目录
    - HtmlWebpackPlugin：创建html文件去承载输出的bundle
    - UglifyjsWenpackPlugin：压缩JS
    - ZipWebpackPlugin：将打包的资源生成一个zip包
- 用法：
    ```
    module.exports = {
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            })
        ]
    }
    ```

## mode
- 指定当前的构建环境：production development none。webpack4提出的概念
- 设置mode可以自动的触发，然后使用webpack内置的函数，默认值为production
- webpack不允许自定义mode

### mode的内置函数功能
- development：设置`process.env.NODE_ENV`的值为 `development`，开启`NamedChunkPlugin`和`NamedModulesPlugin`。这两个插件在热更新中很实用，可以再控制台打印出是哪一个模块发生了热更新以及模块的路径

- production：设置`process.env.NODE_ENV`的值为`production`，开启`FlagDependencyUsagePlugin`，`FlagIncludeChunksPlugin`，`ModuleConcatenationPlugin`，`NoEmitOnErrorsPlugin`，`OccurrenceOrderPlugin`，`SideEffectsFlagPlugin`，`TerserPlugin`

- none：不开启任何优化选项

- tips:
    - process.env会返回用户的环境变量，而NODE_ENV是环境变量中用到的较多的一个，用来设置当前构建脚本是开发阶段还是生产阶段。