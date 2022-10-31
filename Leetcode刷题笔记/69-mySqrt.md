# x的平方根

给你一个非负整数 x ，计算并返回 x 的 算术平方根 。

由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。

注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。

示例 1：

输入：x = 4
输出：2
示例 2：

输入：x = 8
输出：2
解释：8 的算术平方根是 2.82842..., 由于返回类型是整数，小数部分将被舍去。

# 解答

```js
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(target) {
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
};
```
