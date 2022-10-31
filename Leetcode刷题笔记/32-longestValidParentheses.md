# 最长有效括号
给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"

# 解答

```js
// 栈里面存储的是数组的下标
var longestValidParentheses = function(s) {
    let max = 0
    if (s.length < 1) return max

    let len = s.length

    // 栈顶之所有加入一个-1,纯粹是为了方便计算有效括号的长度
    // 不然就需要手动调整为i-j+1;同时而确保第一个字符为")"时不需要特殊处理
    let stack = [-1]

    for(let i = 0; i < len; i++) {
        let value = s[i]
        if (value === '(') {
            stack.push(i)
        } else if (value === ')') {
            stack.pop()

            // 栈顶加入一个pivot字符")",实际上是方便计算有效括号串长度
            if (stack.length < 1) {
                stack.push(i)
            } else {
                max = Math.max(max, i - stack[stack.length - 1])
            }
        }
    }

    return max
};
```