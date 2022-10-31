# 寻找两个正序数组的中位数
给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

算法的时间复杂度应该为 O(log (m+n)) 。

# 解答

```js
var findMedianSortedArrays = function(nums1, nums2) {
    let len1 = nums1.length;
    let len2 = nums2.length;
    let middle;
    let flag;
    if ((len1 + len2) % 2 === 0) {
        middle = parseInt((len1+len2)/2);
        flag = 0;
    } else {
        middle = parseInt((len1+len2)/2) + 1;
        flag = 1;
    }
    let i = 0, j = 0;
    let arr = [];
    // 这里只处理，相同长度的部分
    while(i < len1 && j < len2) {
        if (nums1[i] < nums2[j]) {
            arr.push(nums1[i]);
            i++;
        } else {
            arr.push(nums2[j]);
            j++;
        }
    }
    // 若是数组1先处理完了，则数组2剩余部分，都应该是大于数组1的
    if (i === len1) {
        arr = arr.concat(nums2.slice(j));
    }

    // 若是数组2先处理完了，则数组1剩余部分，都应该是大于数组2的
    if (j === len2) {
        arr = arr.concat(nums1.slice(i));
    }

    if (flag === 0) {
        return parseFloat((arr[middle-1] + arr[middle]) / 2);
    } else {
        return arr[middle-1];
    }
};

```

可以尝试一下88题，合并两个数组。。。。。。
