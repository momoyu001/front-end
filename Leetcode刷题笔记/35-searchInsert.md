# 搜索插入位置
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。


示例 1:

输入: nums = [1,3,5,6], target = 5
输出: 2
示例 2:

输入: nums = [1,3,5,6], target = 2
输出: 1
示例 3:

输入: nums = [1,3,5,6], target = 7
输出: 4


# 解答

```js

const searchInserted = function (nums, target) {
    if (!nums.length) return -1;
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

    return left;
}

let nums =  [3];
let target = 3;
let ret = searchInsert(nums, target);
console.log(ret);
```