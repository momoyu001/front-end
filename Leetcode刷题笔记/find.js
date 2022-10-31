/**
 * 查找
 * **/

// 二维数组中的查找

let arr1 = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

function find1(nums, target) {
    // 从左下角开始查找
    let row = nums.length; // 行
    let column = nums[0].length; // 列

    let indexRow = row - 1;
    let indexColumn = 0;

    while(indexRow >= 0  && indexColumn < column) {
        if (nums[indexRow][indexColumn] < target) {
            // 往这一行的右边比较
            indexColumn++;
        } else if (nums[indexRow][indexColumn] > target) {
            // 往上比较
            indexRow--;
        } else {
            return target;
        }
    }

    return false;
}

// console.log(find1(arr1, 10));


// 旋转数组的最小数字
/**
 * 二分，二分之后，有一边是一定升序的，查找拼接点
 * **/
let arr2 = [3, 4, 5, 1, 2];

function find2(nums) {
    let left = 0;
    let right = nums.length - 1;

    while(left < right) {
        let mid = left + Math.floor((right - left) / 2);
        if (nums[mid] > nums[right]) {
            // 左边的是完全升序的，此时最小值一定出现在右边
            left = mid + 1;
        } else if (nums[mid] < nums[right]) {
            // 右边是完全升序的，此时最小值一定出现在中间位置或者左边
            right = mid;
        } else {
            // 此时不好判断，right--去尝试
            right--;
        }
    }

    return nums[left];
}

// console.log(find2(arr2));




// 在排序数组中查找数字：统计一个数字在排序数组中出现的次数

let arr3 = [1, 3, 4, 5, 5, 5, 6, 9];
// 第一种方法：
function find3(nums, target) {
    let index = 1;
    let count = 0;
    while(index < nums.length) {
        if (target === nums[index]) {
            count++;
        }
        index++;
    }

    console.log(count);
}
// find3(arr3, 9)

// 第二种方法：二分法：分别找到第一个目标值出现的位置和最后一个位置，O(logn)

function find4(nums, target) {
    // 第一次位置：找到目标值，并且前一位的数字和当前值不相等
    // 最后一次位置：找到目标值，并且后一位的数字和当前值不相等

    if (nums && nums.length > 0 && target != null) {
        const firstIndex = getFirst(nums, target, 0, nums.length - 1);
        const lastIndex = getLast(nums, target, 0, nums.length - 1);

        if (firstIndex != -1 && lastIndex != -1) {
            return lastIndex - firstIndex + 1;
        }

        return 0;
    }

    function getFirst(nums, target, left, right) {
        if (left > right) return -1;

        const mid = parseInt((left + right) / 2);
        if (nums[mid] === target) {
            if (nums[mid - 1] != target) {
                return mid;
            } else {
                return getFirst(nums, target, left, mid - 1);
            }
        } else if (nums[mid] > target) {
            return getFirst(nums, target, left, mid - 1);
        } else if (nums[mid] < target) {
            return getFirst(nums, target, mid + 1, right);
        }
    }

    function getLast(nums, target, left, right) {
        if (left > right) return -1;

        const mid = parseInt((left + right) / 2);
        if (nums[mid] === target) {
            if (target !== nums[mid + 1]) {
                return mid;
            } else {
                return getLast(nums, target, mid + 1, right);
            }
        } else if (nums[mid] > target) {
            return getLast(nums, target, left, mid - 1);
        } else if (nums[mid] < target) {
            return getLast(nums, target, mid + 1, right);
        }
    }
}

// find4(arr3, 9)


function mySqrt(target) {
    if (target === 0 || target === 1) return target;
    let left = 0;
    let right = target;

    while(right - left !== 1) {
        let mid = Math.floor((left + right) / 2);
        if (mid * mid > target) {
            right = mid;
        } else if (mid * mid < target) {
            left = mid;
        } else {
            return mid;
        }
    }

    return left;
}


// console.log(mySqrt(112));



// 猜数字大小 - leetcode
function find5(n) {
    let left = 0;
    let right = n;

    while(left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (guess(mid) === 0) {
            return mid;
        } else if (guess(mid) === -1) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
}
