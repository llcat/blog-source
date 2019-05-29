---
title: leetcode(每日一练)
date: 2019-05-14 08:55:43
categories: leetcode
---

#### 2019/05/14
- 206(easy). reverse linked list(翻转链表)
description:
反转单链表
examples:
input: 1->2->3->4->5->NULL
output: 5->4->3->2->1->NULL
follow up:
一个单链表可以通过遍历或者递归进行翻转，你可以实现它吗？
思路：看到题目的提示说可以使用遍历或递归实现，我想递归应该可以实现。递归的出口是最后一个节点，如过到了最后一个节点，保留最后一个节点的引用并返回，否则依次更改每个传入node的引用即可。
solution:
```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    private ListNode reversedHead = null;
    public ListNode reverseList(ListNode head){
        // 防空
        if(head == null){
            return head;
        }
        ListNode temp = head.next;
        // 递归出口
        if(next != null){
            // 递归更改每个节点的引用
            reverseList(next);
            head.next = null;
            temp.next = head
        }else{
            reversedHead = head;
        }
        return reversedHead;
    }
}
```
感觉写的还不够精简，思路有点混乱，submit后看了看别人的答案，还有一种使用双引用(指针)遍历的方法来更改每个节点的引用从而达到翻转的目的。如下：

```java
class Solution {
    public ListNode reverseList(ListNode head){
        ListNode cur = null;
        while(head != null){
            ListNode temp = head.next;
            head.next = cur;
            cur = head;
            head = temp;
        }
        return cur;
    }
}
```

