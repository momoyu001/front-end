/**
 * 几种排序算法
 * **/


// 冒泡排序

let nums1 = [1, 45, 23, 7, 12, 43];

function sort1(nums) {
    for (let i = 0; i < nums.length - 1; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] > nums[j]) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
            }
        }

        console.log(`第${i+1}交换之后`, nums);
    }
}

// sort1(nums1);


let nums2 = [1, 45, 23, 7, 12, 43];

// 插入排序
function sort2(nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i - 1; j >= 0; j++) {
            if (nums[i] < nums[j]) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
            } else {
                break;
            }
        }
    }

    console.log(nums);
}

// sort2(nums2);


let nums3 = [10, 45, 23, 7, 12, 43];

// 快速排序
function sort3(nums) {
    if (nums.length < 2) {
        return nums;
    }
    let target = nums[0];
    let left = [];
    let right = [];
    let index = 1;
    
    while(index < nums.length) {
        if (nums[index] < target) {
            left.push(nums[index]);
        } else {
            right.push(nums[index]);
        }
        index++;
    }

    console.log(nums);
    return sort3(left).concat([target], sort3(right));
}

// console.log(sort3(nums3));


// 选择排序：每次排序，取一个最大或最小的放到前面的有序序列中
let nums4 = [10, 45, 23, 7, 12, 43];

function sort4(nums) {
    for (let i = 0; i < nums.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[j] < nums[minIndex]) {
                minIndex = j;
            }
        }

        [nums[minIndex], nums[i]] = [nums[i], nums[minIndex]];
    }

    console.log(nums);
}

sort4(nums4);
