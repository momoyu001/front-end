/**
 * 数据结构---数组
 * **/

/**
 * 双指针
 * **/

// 调整数组顺序使奇数位于偶数面前
function reOrderArray(array) {
    if (!array.length) return;

    let start = 0;
    let end = array.length - 1;

    while (start < end) {
        // let flag1 = array[start] % 2 === 0;
        // let flag2 = array[end] % 2 === 0;

        // // 若偶数在前，奇数在后，则调换位置，左右指针都移动
        // if (flag1 && !flag2) {
        //     [array[start], array[end]] = [array[end], array[start]];
        //     start++;
        //     end--;
        // } else if (!flag1 && !flag2) {
        //     // 前面是奇数，后面也是奇数，左指针右移
        //     start++;
        // } else {
        //     // 前面奇数，后面偶数
        //     start++;
        //     end--;
        // }

        while(array[start] % 2 === 1) {
            // 奇数，继续遍历
            start++;
        }

        while(array[end] % 2 === 0) {
            // 偶数，继续遍历
            end--;
        }

        if (start < end) {
            [array[start], array[end]] = [array[end], array[start]];
        }
    }
}

let arr1 = [1, 42, 2, 4, 11, 45, 23, 97];
// reOrderArray(arr1);
// console.log(arr1);

// 和为S的两个数
// 递增排序的数组和数字S，查找两个数使得它们的和为S，如果右多对组合，则输出两个数乘积最小的
function FindNumbersWithSum(nums, target) {
    if (!nums.length || nums.length === 1) return [];

    let start = 0;
    let end = nums.length - 1;
    let ret = [];

    while(start < end) {
        let value = nums[start] + nums[end];

        // 相加之和大于target，右指针左移
        if (value > target) {
            end--;
        } else if (value < target) {
            // 相加之和小于target，左指针右移
            start++;
        } else {
            // 相加之和等于target
            if (ret.length && ret[0] * ret[1] > nums[start] * nums[end]) {
                ret = [nums[start], nums[end]];
            } else if (!ret.length) {
                ret = [nums[start], nums[end]];
            }
            start++;
            end--;
        }

    }

    return ret;
}

let arr2 = [1, 2, 4, 7, 10, 13, 36, 40];
// console.log(FindNumbersWithSum(arr2, 17));

// 和为S的连续正整数序列

// 输入一个正数S，打印出所有和为S的连续正数序列。

// 例如：输入15，有序1+2+3+4+5 = 4+5+6 = 7+8 = 15 所以打印出3个连续序列1-5，5-6和7-8。

function FindContinuousSequence(sum) {
    const result = [];
    // 初始数组，存放了1，2
    const child = [1, 2];
    let big = 2;
    let small = 1;
    let currentSum = 3;

    // 当子序列child的和大于目标值，small向右移动
    // 当子序列child的和小于目标值，big向右移动
    while(small < big) {
        while(currentSum < sum && big < sum) {
            child.push(++big);
            currentSum += big;
        }

        while(currentSum > sum && small < big) {
            child.shift();
            currentSum -= small++;
        }

        if (currentSum === sum && child.length > 1) {
            result.push(child.slice());
            child.push(++big);
            currentSum += big;
        }
    }

    return result;
}

// console.log(FindContinuousSequence(15));


// 两数之和
function twoSum(nums, target) {
    let hashMap = new Map();

    for (let i = 0; i < nums.length; i++) {
        if (!hashMap.has(target - nums[i])) {
            hashMap.set(nums[i], i);
        } else {
            return [hashMap.get(target - nums[i]), i];
        }
    }

    return [];
}

let arr3 = [2, 7, 11, 15];
// console.log(twoSum(arr3, 26));


// 三数之和
function threeSum(nums, target) {
    nums = nums.sort((a, b) => a - b); // 升序排序一下，方便去重
    let result = [];

    for (let i = 1; i < nums.length - 1; i++) {
        if (i && nums[i] === nums[i - 1]) {
            continue;
        }

        let left = i + 1;
        let right = nums.length - 1;

        while(left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum > target) {
                right--;
            } else if (sum < target) {
                left++;
            } else {
                result.push([nums[i], nums[left++], nums[right--]]);

                // 跳过重复的数字
                while(nums[left] === nums[left - 1]) {
                    left++;
                }

                // 跳过重复的数字
                while(nums[right] === nums[right + 1]) {
                    right--;
                }
            }
        }
    }

    return result;
}

let arr4= [-1, 0, 1, 2, -1, -4];
// console.log(threeSum(arr4, 0))


function fourSum(nums, target) {
    if (nums.length < 4) return [];

    let result = [];
    
    // 升序排序
    nums = nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 3; i++) {
        if (nums[i] === nums[i+1]) {
            continue;
        }

        if (nums[i] + nums[i+1] + nums[i+2] + nums[i+3] > target) {
            break;
        }

        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j && nums[j] === nums[j - 1]) continue;
            let left = j + 1;
            let right = nums.length - 1;

            while(left < right) {
                let value = nums[i] + nums[j] + nums[left] + nums[right];

                if (value > target) {
                    right--;
                } else if (value < target) {
                    left++;
                } else {
                    result.push([nums[i], nums[j], nums[left++], nums[right--]]);

                    while(nums[left] === nums[left + 1]) {
                        left++;
                    }
    
                    while(nums[right] === nums[right - 1]) {
                        right--;
                    }
                }

            }
        }
    }

    return result;
}

let arr5 = [1, 5, 2, 4, 3, 7, 9, 10, 3];
// console.log(fourSum(arr5, 19));



/**
 * 构建矩阵乘积:
 * 分为两个三角型来处理，上三角 * 下三角，可以得到结果
 * **/

function multiple(nums) {
    const result = [];

    if (!Array.isArray(nums) || !nums.length) return [];

    // 下三角
    result[0] = 1;
    for (let i = 1; i < nums.length; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }

    let temp = 1;
    // 上三角
    for (let j = nums.length - 2; j >= 0; j--) {
        temp = temp * nums[j + 1];
        result[j] = result[j] * temp;
    }

    return result;
}

function multiply(array) {
    const result = [];
    if (Array.isArray(array) && array.length > 0) {
      // 计算下三角
      result[0] = 1;
      for (let i = 1; i < array.length; i++) {
        result[i] = result[i - 1] * array[i - 1];
      }
      // 乘上三角
      let temp = 1;
      for (let i = array.length - 2; i >= 0; i--) {
        temp = temp * array[i + 1];
        result[i] = result[i] * temp;
      }
    }
    return result;
  }



let arr6 = [1, 2, 3, 4];
// console.log(multiple(arr6));


/**
 * 数组中出现次数超过数组长度一半的数字
 * **/
// 确保数组中一定存在这样一个数的情况下
function moreThanHalfNum1(nums) {
    nums = nums.sort((a, b) => a - b);

    let len = nums.length;
    let half = Math.floor(len / 2);

    return nums[half];
}

// 要先自己去判断有没有这样一个数据，有就输出
function moreThanHalfNum2(nums) {
    // 开辟额外的空间
    let temp = {};

    for (let i = 0; i < nums.length; i++) {
        if (temp[`${nums[i]}`]) {
            temp[`${nums[i]}`]++;
        } else {
            temp[`${nums[i]}`] = 1;
        }

        if (temp[nums[i]] > nums.length / 2) {
            return nums[i];
        }
    }

    return -1;
}

let arr7 = [1,2,3,2,2,2,5,4,2];
// console.log(moreThanHalfNum1(arr7));
// console.log(moreThanHalfNum2(arr7));



let arr8 = [1, 3, 9, -2, -10, 2, -3, 6, 7];

function continuousMaxSum(nums) {
    let i = 1;
    let len = nums.length;
    let res = 0;

    while(i < len) {
        nums[i] = Math.max(nums[i - 1] + nums[i], nums[i]);
        res = Math.max(nums[i], res);
        i++;
    }

    return res;
}

// console.log(continuousMaxSum(arr8))

/**
 * 顺时针打印数组
 * **/

let arr9 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16]
]

function printNums(nums) {
    let len_row = nums.length;
    let len_column = nums[0].length;

    // 循环的过程中，动态的改变这几个值
    let init_i = 0; // 第一个下标
    let init_j = 0; // 第二个小标
    let end_i = nums.length - 1; // 第一个下标结束位置
    let end_j = nums[0].length - 1; // 第二个下标结束位置

    let direction = 'left_right';

    let count = 0;
    let all = len_row * len_column;
    let ret = [];

    while(count < all) {
        switch(direction) {
            case 'left_right':
                console.log('left_right', ret.length, init_i, end_i, init_j, end_j)
                // 左 - 右
                for (let j = init_j; j <= end_j; j++, count++) {
                    ret.push(nums[init_i][j]);
                }

                direction = 'top_bottom';
                // 这一行遍历完了，下一次这个方向的，就是下一行的数据来遍历
                init_i++;
                break;
            case 'top_bottom':
                console.log('top_bottom', ret.length, init_i, end_i, init_j, end_j)
                // 上 - 下
                for (let i = init_i; i <= end_i; i++, count++) {
                    ret.push(nums[i][end_j]);
                }

                direction = 'right_left';
                end_j--;
                break;
            case 'right_left':
                console.log('right_left', ret.length, init_i, end_i, init_j, end_j)
                for (let j = end_j; j >= init_j; j--, count++) {
                    ret.push(nums[end_i][j]);
                }

                direction = 'bottom_top';
                end_i--;
                break;
            case 'bottom_top':
                console.log('bottom_top', ret.length, init_i, end_i, init_j, end_j)
                for (let i = end_i; i >= init_i; i--, count++) {
                    ret.push(nums[i][init_j]);
                }
                init_j++;
                direction = 'left_right';
                break;
        }
        console.log(count)
    }

    console.log(ret)
}

printNums(arr9);

