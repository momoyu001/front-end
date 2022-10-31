# 在排序数组中查找元素的第一个和最后一个位置

给你一个按照非递减顺序排列的整数数组 nums，和一个目标值 target。请你找出给定目标值在数组中的开始位置和结束位置。

如果数组中不存在目标值 target，返回 [-1, -1]。

你必须设计并实现时间复杂度为 O(log n) 的算法解决此问题。

 

示例 1：

输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]
示例 2：

输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]
示例 3：

输入：nums = [], target = 0
输出：[-1,-1]

# 解答

```js
const searchRange = function(nums, target) {
    if (!nums.length) return [-1, -1];

    let left = 0;
    let right = nums.length;
    let ret = [];

    while(left <= right && left < nums.length) {
        let mid = left + Math.floor((right - left) >> 1);

        if (nums[mid] === target) {
            let i = mid - 1;
            let j = mid + 1;
            
            while(true) {
                if (nums[i] !== target && nums[j] !== target) {
                    break
                }

                if (nums[i] === target) {
                    i--;
                }

                if (nums[j] === target) {
                    j++;
                }
            }

            ret = [i+1, j-1];
            return ret;
        }

        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return  [-1, -1];
}

```