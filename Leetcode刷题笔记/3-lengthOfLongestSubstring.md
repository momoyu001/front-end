# 无重复字符的最长子串


# 解答
要找出没有重复值出现的子串的长度，所以将没有重复的值按顺序放入到新数组temp中，当出现重复元素是，则表示temp的第一个元素的子串出现了重复字符，重新以第二个为开头继续往下寻找。

在删除第一个元素时，要注意，在for循环中，要将i的值恢复为查找到循环字符的下标，保证将这个值压入到temp数组中。

```js
var lengthOfLongestSubstring = function(s) {
    let res = 0;
    let temp = [];

    for (let i = 0; i < s.length; i++) {
        if (temp.indexOf(s[i]) == -1) {
            // temp中没有重复的字符
            temp.push(s[i]);
        } else {
            // temp中有重复的字符，将第一个字符去掉，从下一个字符开始重新比对，记得i--
            temp.shift();
            i--;
            continue;
        }

        res = Math.max(res, temp.length);
    }

    return res;
};
```

滑动窗口：

其实就是一个队列，比如题中的中`abcabcbb`，进入到这个队列（窗口）为`abc`满足题目要求，当再进入`a`，队列变成了`abca`，这时候不满足要求，所以我们要移动这个队列，只需要把队列左边的元素移除就行了，直到满足要求。
