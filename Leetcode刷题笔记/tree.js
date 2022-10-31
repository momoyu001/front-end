
function TreeNode(val) {
    this.val = val;
    this.left = null;
    this.right = null;
}

function Tree(rootVal) {
    this.root = new TreeNode(rootVal);
}

Tree.prototype.inserted = function(val) {
    let queue = [this.root];

    while(queue.length) {
        // 每一层从左至右的顺序遍历
        let node = queue.shift();

        if (node.left && !node.right) {
            node.right = new TreeNode(val);
            return this.root;
        }

        if (!node.left && !node.right) {
            node.left = new TreeNode(val);
            return this.root;
        }

        node.left && queue.push(node.left);
        node.right && queue.push(node.right);
    }
}

/**
 * 层遍历：
 * 1、递归的方式
 * 2、迭代的方式
 * **/
Tree.prototype.levelOrder1 = function() {
    if (this.root == null) return [];
    let res = [];

    function _levelOrder(node, level) {
        if (!node) return null;

        // 当前层数组初始化
        res[level] = res[level] || [];
        res[level].push(node.val);

        // 下一层的遍历
        _levelOrder(node.left, level + 1);
        _levelOrder(node.right, level + 1);
    }

    _levelOrder(this.root, 0);

    return res;
}

/**
 * 层遍历：
 * 1、迭代的方式
 * 用队列来保存节点，每轮循环中，都取一层出来，将它的左右孩子放入队列
 * **/
Tree.prototype.levelOrder2 = function() {
    if (this.root == null) return [];
    // 初始存放的是根节点
    let queue = [this.root];
    let res = [];
    let level = 0;

    while(queue.length) {
        res.push([]);
        const len = queue.length;

        // 通过遍历，提前执行完一层的所有元素，层级level就可以加一
        for (let i = 0; i < len; i++) {
            const node = queue.shift();
            res[level].push(node.val);
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }

        level++;
    }

    return res;
}

let root = new Tree(1);
root.inserted(2);
root.inserted(3);
root.inserted(4);
root.inserted(5);
root.inserted(6);
root.inserted(7);
root.inserted(8);
// console.log(root);

console.log(root.levelOrder1());
console.log(root.levelOrder2());