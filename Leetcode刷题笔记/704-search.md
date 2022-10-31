# 二分查找

给定一个 n 个元素有序的（升序）整型数组 nums 和一个目标值 target  ，写一个函数搜索 nums 中的 target，如果目标值存在返回下标，否则返回 -1。

示例 1:

输入: nums = [-1,0,3,5,9,12], target = 9
输出: 4
解释: 9 出现在 nums 中并且下标为 4
示例 2:

输入: nums = [-1,0,3,5,9,12], target = 2
输出: -1
解释: 2 不存在 nums 中因此返回 -1

# 解答

```js
// 一
// 定义target在左闭右闭的区间内 [left, right]
let left = 0;
let right = nums.length - 1;

// 当left == right 的时候，[left, right]依然有效，所以用 <=
while(left <= right) {

}

// 二
// 定义target在一个左闭右开的区间 [left, right)
let left = 0;
let right = nums.length;

// 当left === right的时候，[left, right) 是无效的，所以使用 < 
while(left < right) {

}

```

```js
const search = function(nums, target) {
    if (!nums.length) return -1;
    if (nums.length === 1 && nums[0] != target) return -1;
    if (nums.length === 1 && nums[0] === target) return 0;

    let left = 0;
    let right = nums.length;

    while(left < right) {
        let mid = left + Math.floor((right - left) >> 1);

        if (nums[mid] > target) {
            right = mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            return mid;
        }
    }

    return -1;
}

let nums =  [-1,0,3,5,9,12];
let target = 3;
let ret = search(nums, target);
console.log(ret);

```