# 最长连续序列

给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。

示例 1：

输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长数字连续序列是 [1, 2, 3, 4]。它的长度为 4。
示例 2：

输入：nums = [0,3,7,2,5,8,4,6,0,1]
输出：9


# 解答

```js
var longestConsecutive = function(nums) {
    if (!nums.length) return 0;
    nums = [...new Set(nums.sort((a, b) => a - b))];
    // console.log('新的nums数组：', nums);
    let ret = [nums[0]];
    let max = 1;

    for(let i = 1; i < nums.length; i++) {
        if (nums[i] === ret[ret.length - 1] + 1) {
            ret.push(nums[i]);
            if (max < ret.length) {
                max = ret.length;
            }
        } else {
            ret = [nums[i]];
        }
    }

    return max;
}

let arr = [1,2,0,1];

let ret = longestConsecutive(arr);
console.log(ret);
```
