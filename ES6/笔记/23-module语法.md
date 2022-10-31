# module的语法

ES5模块化：CommonJS、AMD。运行时才能确定导入的东西。CommonJS模块就是对象，输入是必须查找对象属性。CommonJS输出的值是缓存，不存在动态更新。

ES6模块不是对象，而是通过export命令显示指定输出的代码，再通过import命令输入。编译时就可以确定导入的东西。

require是运行时加载模块，import无法 取代require的动态加载功能。

ES6的模块自动采用严格模式（Class中的代码也是）。

ES6中，顶层的this指向undefined，即不应该在顶层代码中使用this。

ES6模块功能中的命令：export和import
- `export`：规定模块的对外接口。export规定的是对外的接口，必须与模块内部的`变量`建立一对一关系。export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。`export命令可以出现在模块的任何位置，只要位于顶层模块就可以`。

- `import`：用于输入其他模块提供的功能。import命令会被JavaScript引擎静态解析，先于模块内的其他语句执行。import 导入变量的名称必须与export中的变量名一直，或者可以通过as来重命名。输入的变量都是只读的，对变量重新赋值会报错，但若变量是对象，修改对象的属性是可以的。`import命令具有提升效果，会提升到整个模块的头部，首先执行`。重复的import只会执行一次。

- `export default`：为模块指定默认输出。import的时候不需要{}，import后面的变量不需要与模块中的一致。一个模块只能有一个默认输出。本质上，export default就是输出一个叫做`default`的变量或者方法，然后系统允许你为它取任意名字。export default后面不能跟上变量声明语句（输出了一个default变量）

- export 和 import的复合写法：export { foo } from './a.js'。这种写法实际明没有导入foo，只是做了转发，当前js文件不能使用foo。

- `export *` - 模块之间的继承 ：输出某个模块的所有方法，会忽略该模块的`default`方法。

- `import()`函数：支持动态加载模块。返回一个Promise对象。该函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用。在运行时执行，类似于node的require方法，区别在于，import()是异步加载，require是同步加载。加载的模块会.then方法的参数。
