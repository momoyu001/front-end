
let nums = [1, 0, 3, 0, 12];

function func1() {
    // 第一个指针，从左到右去遍历，
    let index = 0;

    // 第二个指针，指向0存在的位置
    let position = 0;

    let len = nums.length;

    while(index < len) {
        if (nums[index] !== 0) {
            // 当前遍历到了非0元素，将前面记录的0的位置元素与之交换
            if (nums[position] === 0) {
                nums[position] = nums[index];
                nums[index] = 0;
            }
            position++;
        }

        console.log('遍历过程中', nums, '当前遍历到的元素', nums[index], '当前遍历到的下标', index);
        index++;
    }
}

/**
 * 快慢指针法
 * **/
function func2(nums) {
    let len = nums.length;
    // 慢指针
    let k = 0;

    for (let i = 0; i < len; i++) {
        if (nums[i] !== 0) {
            // k从头开始慢慢的放不为0的数
            nums[k++] = nums[i];
            console.log(nums)
        }
    }

    for (let i = k; i < len; i++) {
        // 剩下的置0
        nums[i] = 0;
    }
}

// func2(nums);
// console.log(nums);

function func3(nums) {
    let k = 0;
    while (nums[k] !== 0) {
        k ++;
    }
    
    console.log('第一个0index 为', k);
    for (let i = k + 1; i < nums.length; i++) {
        console.log('开始', nums);
        if (nums[i] === 0) {
            console.log(nums, i, nums[i])
        } else  {
            // 交换
            console.log('交换', nums[k], nums[i]);
            nums[k] = nums[i] + nums[k];
            nums[i] = nums[k] - nums[i];
            nums[k] = nums[k] - nums[i];
            k ++;
        }
        console.log(`第${i}遍结束 k ${k}：${nums}`)
    }
}


// func3(nums);
// console.log(nums);

