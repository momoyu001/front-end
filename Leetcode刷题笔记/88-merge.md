# 合并两个有序数组
给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。

请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。

注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。

示例：
```
输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
输出：[1,2,2,3,5,6]
解释：需要合并 [1,2,3] 和 [2,5,6] 。
合并结果是 [1,2,2,3,5,6] ，其中斜体加粗标注的为 nums1 中的元素。

```

# 解答

```js
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    if (m == 0) {
        nums2.forEach((item, index) => {
            nums1[index] = item;
        })
        return;
    }
    let newNums1 = nums1;

    newNums1 = newNums1.slice(0, m);

    let i = 0;
    let j = 0;
    let arr = [];

    while(i < m && j < n) {
        if (newNums1[i] < nums2[j]) {
            arr.push(newNums1[i]);
            i++;
        } else {
            arr.push(nums2[j]);
            j++;
        }
    }

    if (i == m) {
        // nums1数组先处理完了
        arr = arr.concat(nums2.slice(j));
    }

    if (j == n) {
        // nums2数组先处理完了
        arr = arr.concat(newNums1.slice(i));
    }

    arr.forEach((item, index) => {
        nums1[index] = item;
    })
};
```
先将nums1的0替换为nums2的值，然后sort排序

```js
 var merge = function(nums1, m, nums2, n) {
    if (m == 0) {

        nums2.forEach((item, index) => {
            nums1[index] = item;
        })

        return;
    }
    let count = 0;
    for (let i = nums1.length - 1; i >= m; i--) {
        if (nums1[i] === 0) {
            console.log(i)
            nums1[i] = nums2[count];
            count++;
        } else if (nums1[i] !== 0) {
            break;
        }
    }

    nums1.sort((a, b) => a - b);
};

```
