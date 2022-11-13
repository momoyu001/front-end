
function Student(name, age) {
    this.name = name;
    this.age = age;
}

Student.prototype.id = 100;

// 创建一个新的实例对象；实例对象的__proto__与构造函数的prototype相等；改变this的指向为新的实例对象
let stud1 = new Student('aaa', 18);
console.log(stud1.name);
console.log(stud1.age);
console.log(stud1.__proto__  === Student.prototype);

// 实现。。。。
function myNew() {
    // 创建一个新的实例对象 --- new Object
    const obj = new Object();

    // arguments  是一个类数组对象，不是严格意义上的数组，不能直接使用shift方法。 --- 截取传入的第一个参数
    Constructor = Array.prototype.shift.call(arguments);

    // 使得生成的实例对象的__proto__与构造函数的prototype一致
    obj.__proto__ = Constructor.prototype;

    // 使用apply改变构造函数的this指向，指向新生成的实例对象。 --- obj就可以访问到构造函数中的属性
    Constructor.apply(obj, arguments);

    return obj;
}

let stud2 = myNew(Student, '李四', 30);
console.log(stud2.name);
console.log(stud2.age);
console.log(stud2.__proto__ === Student.prototype);

// 创建实例对象；实例对象的__proto__与构造函数的prototype一致；改变this的指向，指向新生成的实例对象，使得实例对象可以访问构造函数中的属性。


// 有显示的返回对象的构造函数（通常情况下，构造函数是没有返回值的）
function Person(name, age) {
    this.job = 'programer';
    return {
        name: name,
        age: age
    }
}

let person1 = new Person('111', 23);
console.log(person1.name);
console.log(person1.age);
console.log(person1.job);
// 如果构造函数有返回值，那么只返回构造函数返回的对象。（如上，没有class这个属性，只返回了name和age属性）

function  myNew2() {
    // 生成一个新的对象实例
    let obj = new Object();
    // 取到传入的第一个参数 -- 即  构造函数
    Constructor = Array.prototype.shift.call(arguments);

    // 将实例对象的__proto__指向构造函数的prototype
    obj.__proto__ = Constructor.prototype;

    // 改变this的指向，指向新创建的实例对象，使得实例对象可以访问构造函数的属性 --- 这里要判断一下，这个构造函数有没有返回值
    let ret = Constructor.apply(obj, arguments);

    // 构造函数有返回值，那么就返回构造函数返回的对象；没有返回值，就返回新创建的对象实例。
    return typeof ret === 'object' ? ret : obj;
}