# 两数之和

给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

# 解答：


## 双层循环嵌套
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let len = nums.length;

    for (let i = 0; i < len - 1; i ++) {
        let num1 = nums[i];

        for (let j = i + 1; j < len; j++) {
            let num2 = nums[j];

            if ((num1 + num2) === target) {
                return [i, j];
            }
        }
    }
}
```

## map
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let len = nums.length;
    let hashMap = new Map();
    nums.forEach((item, index) => {
        hashMap.set(item, index);
    })

    for (let i = 0 ; i < len; i++) {
        let numIndex = hashMap.get(target - nums[i]);

        if (numIndex && numIndex !== i&& i < numIndex) {
            return [i, numIndex];
        }
    }
}
```