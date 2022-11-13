// 数组中重复的数字 --- 找出数组中任意一个重复的数字

/**
 * @param numbers 整型一维数组
 * **/
function duplicate(numbers) {
    if (!Array.isArray(numbers)) return -1;

    if (!numbers.length) return -1;

    if (numbers.length === [...new Set(numbers)].length) return -1;

    const map = {};

    numbers.forEach(item => {
        if (map[item]) {
            map[item] +=  1;
        } else {
            map[item] = 1;
        }
    })

    let ret = Object.keys(map).find(item => map[item] > 1);

    return ret || -1;
}


/**
 * 
    在数组中的两个数字，如果前面一个数字大于后面的数字，则这两个数字组成一个逆序对。输入一个数组,求出这个数组中的逆序对的总数P。并将P对1000000007取模的结果输出。 即输出P mod 1000000007

    数据范围：  对于 50% 的数据, size<=10^4 
    
    对于 100% 的数据, size\leq 10^5size≤10 
    
    数组中所有数字的值满足 0 \le val \le 10000000≤val≤1000000

    要求：空间复杂度 O(n)，时间复杂度 O(nlogn)
 * 
 * **/
