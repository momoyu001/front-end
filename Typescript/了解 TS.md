# ts -- TypeScript
- ts 解决JavaScript的‘痛点’
    - 1、弱类型和没有命名空间，导致很难模块化
    - 2、不适合开发大型程序
    - 3、提供了一些语法糖来帮助大家更方便的实践面向对象编程。（类、接口、枚举、泛型、方法重载等）
    - 4、没有抛弃TypeScript，而是变成了JavaScript的超集，任何合法的JavaScript代码，在ts下都是合法的

- ts 的缺点
  - 学习成本高
  - 开发成本高

- 不能直接引用到HTML中，要转换成js之后才能引用

- ts的编译安装
    - `npm install -g typescript`
    - `tsc`指向`ts`结尾的文件

- 借助vscode上面的终端
    - 执行命令：tsc --init，生成一个`tsconfig.json`文件
    - Run Task：（终端-运行任务-选择`typescript`-选择`tsc:监视`）
    - 选中TypeScript
    - tsc:watch
    - `tsconfig.json`文件中，找到`outDir`的配置，这个负责配置转换成的`js`文件的输出目录
