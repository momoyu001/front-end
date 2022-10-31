# 最大子数组和

给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

子数组是数组中的一个连续部分。

输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

示例 2：

输入：nums = [1]
输出：1

示例 3：

输入：nums = [5,4,-1,7,8]
输出：23

# 解答

```js
// 考虑sum的增益，舍弃掉负增益
const maxSubArray = function(nums) {
    let sum = 0;
    let res = nums[0];
    for (let i = 0; i < nums.length; i++) {
        console.log(`前sum：${sum}`, `res：${res}`, `nums[${i}]：${nums[i]}`);

        if (sum <= 0) {
            // 以当前的 nums[i] 开头，重新计算sum
            sum = nums[i];
        } else {
            sum += nums[i];
        }

        console.log(`后sum：${sum}`, `res：${res}`, `nums[${i}]：${nums[i]}`);

        res = Math.max(sum, res);
    }

    return res;
}



const maxSubArray = function(nums) {
    if (nums.length === 0) return 0;
    let max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        // 当前这一项元素的取值：当前值、当前值加上前一项，取两者中的最大值。如果相加之后是变小了，那么从当前项开始，重新计算最大和
        nums[i] = Math.max(nums[i] + nums[i - 1], nums[i]);
        // max 要取最大值
        max = Math.max(max, nums[i]);
    }
}
```
