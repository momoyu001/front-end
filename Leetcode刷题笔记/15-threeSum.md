# 三数之和

给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。


示例 1：

输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
示例 2：

输入：nums = []
输出：[]
示例 3：

输入：nums = [0]
输出：[]

# 解答

```js
var threeSum = function(nums) {
    // 三数之和转换为两数之和
    let arr = nums.sort((a, b) => a - b);
    let retMap = new Map();
    let retArr = [];
    for (let i = 0; i < arr.length - 2; i++) {
        // 目标数，在剩余数组中寻找两个数相加等于目标数
        let target = -arr[i];
        let map = new Map();

        for (let j = i + 1; j < arr.length; j++) {
            if (map.has(target - arr[j])) {
                let arrTemp = [-target, arr[map.get(target - arr[j])], arr[j]];
                if (retMap.has(JSON.stringify(arrTemp))) {
                } else {
                    retMap.set(JSON.stringify(arrTemp), '1');
                    retArr.push(arrTemp);
                }
            } else {
                map.set(arr[j], j);
            }
        }
    }

    return retArr;
};
```
