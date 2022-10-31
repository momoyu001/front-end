# 搜索旋转排序数组

# 解答

```js
const search = function(nums, target) {
    let start = 0;
    let end = nums.length;

    while (start <= end) {
        let mid = start + Math.floor((end - start) >> 1);
        console.log('mid---- ', mid);
        if (nums[mid] === target) {
            return mid;
        }

        if (target >= nums[0]) {
            // 在左端
            // 目标值在左半段时，若mid在右半段，则将mid索引的值改成Infinity无限大
            if (nums[mid] < nums[0]) {
                nums[mid] = Infinity;
            }
        } else if (target < nums[0]) {
            // 在右端
            // 目标值在右半段时，若mid在左半段，则将mid索引的值改成-Infinity无限小
            if (nums[mid] >= nums[0]) {
                nums[mid] = -Infinity;
            }
        }

        if (nums[mid] < target) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }

    return -1;
}

let arr = [4,5,6,7,0,1,2];
let ret = search(arr, 3);
console.log(ret);
```