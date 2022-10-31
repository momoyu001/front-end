/**
 * 栈和队列
 * **/

// 两个栈实现队列：栈-先进后出，队列-先进先出
// 栈1：入队存储
// 栈2：出队

class myQueue {
    constructor() {
        this.stack1 = [];
        this.stack2 = [];
    }

    // 入队操作
    inqueue(value) {
        this.stack1.push(value);
    }

    // 出队操作
    dequeue() {
        if (!this.stack2.length) {
            // 当前栈2是空的
            while(this.stack1.length) {
                this.stack2.push(this.stack1.pop());
            }

            return this.stack2.pop();
        } else {
            // 当前栈2有数据，先将已有数据出队列
            return this.stack2.pop();
        }
    }

    print() {
        let ret = [];
        let index1 = this.stack2.length - 1;
        let index2 = this.stack1.length - 1;
        while(index1 >=0) {
            ret.push(this.stack2[index1]);
            index1--;
        }

        let temp = [];
        while(index2 >= 0) {
            temp.unshift(this.stack1[index2]);
            index2--;
        }

        let arr = ret.concat(temp);
        console.log(arr);
        return ret.concat(temp);
    }
}

// let queue = new myQueue();
// queue.inqueue(1);
// queue.inqueue(2);
// queue.inqueue(3);
// queue.inqueue(4);
// queue.print();
// queue.dequeue();
// queue.print();
// queue.dequeue();
// queue.print();
// queue.inqueue(10);
// queue.print();

// 包含min函数的栈
// 两个栈，一个存放数据，两一个存放的是当前栈中的最小值，这样保证，pop一个元素之后，最小值栈的栈顶元素还是当前栈的最小值
class Stack {
    constructor() {
        // 存放栈的数据
        this.stack1 = [];
        // 存放最小值的数据，每添加一个栈元素，这个栈也会添加一个元素
        this.stack2 = [];
    }
    push(value) {
        if (!this.stack1.length) {
            // 添加第一个元素的时候
            this.stack1.push(value);
            this.stack2.push(value);
        } else {
            let top = this.stack2[this.stack2.length - 1];
            if (value < top) {
                this.stack2.push(value);
            } else {
                this.stack2.push(top);
            }

            this.stack1.push(value);
        }
    }

    pop() {
        if (this.stack1.length) {
            this.stack2.pop();
            return this.stack1.pop();
        }

        return null;
    }

    print() {
        console.log('栈数据', this.stack1);
        console.log('最小值栈的数据', this.stack2);
    }
}

// let stack = new Stack();
// stack.push(5);
// stack.push(6);
// stack.push(3);
// stack.push(7);
// stack.push(-1);
// stack.print();
// stack.pop();
// stack.print();





// 栈的压入、弹出序列
// 输入两个整数序列，第一个序列表示栈的压入顺序，请判断第二个序列是否可能为该栈的弹出顺序。
// 假设压入栈的所有数字均不相等。例如序列1,2,3,4,5是某栈的压入顺序，
// 序列4,5,3,2,1是该压栈序列对应的一个弹出序列，但4,3,5,1,2就不可能是该压栈序列的弹出序列。
// （注意：这两个序列的长度是相等的）







// 滑动窗口的最大值
function masSlidingWindow(nums, k) {

}