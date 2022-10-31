# 下一个排列

整数数组的一个 排列  就是将其所有成员以序列或线性顺序排列。

例如，arr = [1,2,3] ，以下这些都可以视作 arr 的排列：[1,2,3]、[1,3,2]、[3,1,2]、[2,3,1] 。
整数数组的 下一个排列 是指其整数的下一个字典序更大的排列。更正式地，如果数组的所有排列根据其字典顺序从小到大排列在一个容器中，那么数组的 下一个排列 就是在这个有序容器中排在它后面的那个排列。如果不存在下一个更大的排列，那么这个数组必须重排为字典序最小的排列（即，其元素按升序排列）。

例如，arr = [1,2,3] 的下一个排列是 [1,3,2] 。
类似地，arr = [2,3,1] 的下一个排列是 [3,1,2] 。
而 arr = [3,2,1] 的下一个排列是 [1,2,3] ，因为 [3,2,1] 不存在一个字典序更大的排列。
给你一个整数数组 nums ，找出 nums 的下一个排列。

必须 原地 修改，只允许使用额外常数空间。

（给定若干个数字，将其组合为一个整数。如何将这些数字重新排列，以得到下一个更大的整数。如 123 下一个更大的数为 132。如果没有更大的整数，则输出最小的整数。）

示例 1：

输入：nums = [1,2,3]
输出：[1,3,2]
示例 2：

输入：nums = [3,2,1]
输出：[1,2,3]
示例 3：

输入：nums = [1,1,5]
输出：[1,5,1]

# 解答

找到一个大于当前序列的新序列，且变小的幅度尽可能的小。
我们需要将一个左边的「较小数」与一个右边的「较大数」交换，以能够让当前排列变大，从而得到下一个排列。

同时我们要让这个「较小数」尽量靠右，而「较大数」尽可能小。当交换完成后，「较大数」右边的数需要按照升序重新排列。这样可以在保证新排列大于原来排列的情况下，使变大的幅度尽可能小。



```js
const nextPermutation = function (nums) {
    /**
     *  尾向首遍历, nums[i] < nums[i+1] 跳出 记作index
        遍历index+1到len 找出最小值的 && 不等于nums[index] 索引记作indexOfmin
        交换nums[indexOfmin] nums[index];
        升序排列 index+1 到len
     * **/
    const len = nums.length;

    if (len < 2) return nums.reverse();

    let index = len - 2;

    while (index > 0) {
        if (nums[index] < nums[index + 1]) {
            break;
        }
        index--;
    }

    if (index === 0 && nums.concat().sort((a, b) => b - a)[0] === nums[0]) {
        return nums.reverse();
    }

    let indexOfmin = index + 1;
    let min = nums[indexOfmin] - nums[index];

    for (let i = index + 1; i < len; i++) {
        if (nums[i] > nums[index] && Math.min(nums[i] - nums[index], min) !== min) {
            indexOfmin = i;
        }
    }

    [nums[index], nums[indexOfmin]] = [nums[indexOfmin], nums[index]];
    let arr = nums.slice(index + 1);
    arr.sort((a, b) => a - b);
    for (let i = index + 1; i < len; i++) {
        nums[i] = arr[i - index - 1];
    }

    return nums;
};


let nums = [1, 1, 5];
let ret = nextPermutation(nums);
console.log(ret);

```
