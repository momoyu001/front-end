# 两数相加

给你两个 非空 的链表，表示两个非负的整数。它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

# 解答
链表当作数组来看；只要下表相同的值相加由溢出，就存储在第三个值里面，留给下一位相加。提前声明好一个`e`，减少new ListNode的使用

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
var addTwoNumbers = function(l1, l2) {
    let start = n = new ListNode();
    let e = new ListNode(0);
    let added = 0;

    while(l1 || l2) {
        l1 = l1 || e;
        l2 = l2 || e;

        let sum = l1.val + l2.val + added;
        added = Math.floor(sum/10);
        n.next = new ListNode(sum % 10);
        n = n.next;
        l1 = l1.next;
        l2 = l2.next;
    }

    if (added) {
        n.next = new ListNode(added);
    }

    return start.next;
}

```