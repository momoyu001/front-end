// vue3课程 - TypeScript实战练习
interface Todo {
    title: string,
    desc: string,
    done: string
}

// 第一题：实现类型函数Partial1，返回的类型是Todo所有属性都变成可选项
/**
 * 解题思路：使用泛型。把函数的参数定义成类型
 * keyof 关键字
 * type 关键字
 * **/
type partTodo = Partial1<Todo>

type Partial1<T> = {
    [K in keyof T]? : T[K]
}
