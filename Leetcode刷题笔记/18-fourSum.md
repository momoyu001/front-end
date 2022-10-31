# 四数之和

给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]] （若两个四元组元素一一对应，则认为两个四元组重复）：

0 <= a, b, c, d < n
a、b、c 和 d 互不相同
nums[a] + nums[b] + nums[c] + nums[d] == target
你可以按 任意顺序 返回答案 。

示例 1：

输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
示例 2：

输入：nums = [2,2,2,2,2], target = 8
输出：[[2,2,2,2]]


# 解答

拆分为三数之和来求解。

```js
const fourSum = function(nums, target) {
    // 升序排序
    let retArr = [];
    let map = new Map();

    for (let i = 0; i < nums.length; i++) {
        let newTarget = target - nums[i];
        let ret = threeSum(nums.slice(i+1), newTarget) || [];
        // console.log('三数之和：', ret)
        if (ret.length) {
            ret.forEach(item => {
                let newArr = [nums[i], ...item].sort((a, b) => a - b);
                let str = JSON.stringify(newArr);
                if (!map.has(str)) {
                    retArr.push(newArr);
                    map.set(str, '1');
                }
            })
        }
    }
    return retArr;
}


const threeSum = function(nums, target) {
    nums = nums.sort((a, b) => a - b);
    let res = [];
    for (let i = 0; i < nums.length - 1;  i++) {
        let left = i + 1;
        let right = nums.length - 1;

        while(left < right) {
            let temp = nums[left] + nums[right] + nums[i];
            if (temp === target) {
                res.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
            } else if (temp < target) {
                left++;
            } else if (temp > target) {
                right--;
            }
        }
    }

    return res;
}
```