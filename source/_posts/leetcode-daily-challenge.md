---
title: leetcode(每日一练)
date: 2019-05-14 08:55:43
categories: leetcode
---
#### 引言
leetcode每日一练, 随手写写篇~

<!-- more -->

### Tree
#### 2020/04/29
- [590(easy) N-ary Tree Postorder Traversal](https://leetcode.com/problems/n-ary-tree-postorder-traversal/)
N叉树的后序遍历，先遍历所有的子节点，最后访问根节点。子节点不为空，向下按照规则遍历子节点的子节点。
solution(递归)
```java
class Solution {
    public List<Integer> postorder(Node root) {
        List<Integer> r = new ArrayList<>();
        if (root == null) return r;
        if (root.children != null) {
            for (Node node : root.children) {
                if (node.children != null) {
                    r.addAll(postorder(node));
                } else {
                    r.add(node.val);
                }
            }
            r.add(root.val);
        }
        return r;
    }
}
```
solution(迭代):
```java
class Solution {
    public List<Integer> postorder1(Node root) {
        List<Integer> r = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        Node nextRoot = root;
        while (nextRoot != null) {
            if (nextRoot.children != null) {
                stack.push(new Node(nextRoot.val));
                for (int i = nextRoot.children.size()-1; i>=0; i--) {
                    stack.push(nextRoot.children.get(i));
                }
            } else {
                r.add(nextRoot.val);
            }
            if (!stack.isEmpty()) {
                nextRoot = stack.pop();
            } else {
                nextRoot = null;
            }
        }
        return r;
    }

    /**
     * 别人的solution, 这个写法很清晰简单
     * @param root
     * @return
     */
    public List<Integer> postorder2(Node root) {
        List<Integer> r = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            if (node == null) continue;
            r.add(0, node.val);
            for(Node n : node.children) {
                stack.push(n);
            }
        }
        return r;
    }
}
```
#### 2020/04/28
- [589(easy) N-ary Tree Preorder Traversal](https://leetcode.com/problems/n-ary-tree-preorder-traversal/)
N叉树的先序遍历，用迭代不要用递归
不难，数据结构课后作业的水平，题目要求最好用迭代实现，首先回忆下二叉树先序遍历的口诀, 根左右，先访问根节点，然后遍历左子树，最后遍历右子树，N叉树结构也是同理，只不过我们子节点的数目从2个变成了N个, 从左至右按照子节点的顺序遍历，如果子节点不是叶子节点，从左到右遍历子节点的子节点。
soluton(递归):
```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;

    public Node() {}

    public Node(int _val) {
        val = _val;
    }

    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
    public List<Integer> preorder(Node root) {
        List<Integer> r = new ArrayList<>();
        if (root == null) return r;
        r.add(root.val);
        if (root.children != null) {
            for (Node node : root.children) {
                r.addAll(preorder(node));
            }
        }
        return r;
    }
}
```

soluton(迭代):
```java
/**
* 迭代遍历的情况下，我们需要找一个位置将我们暂时遍历不到的节点
* 存起来，在递归时，这些值是存在函数栈里面的，这里我们也用一个栈来保存当前还没访问到* 的节点。
*/
class Solution {
    public List<Integer> preorder(Node root) {
        List<Integer> r = new ArrayList<>();
        Stack<Node> stack = new Stack<>();
        if (root == null) return r;
        Node nextRoot = root;
        while (nextRoot != null) {
            r.add(nextRoot.val);
            if (nextRoot.children != null) {
                for (int i = nextRoot.children.size()-1; i>=0; i--) {
                    stack.push(nextRoot.children.get(i));
                }
            }
            if (!stack.isEmpty()) {
                nextRoot = stack.pop();
            } else {
                nextRoot = null;
            }
        }
        return r;
    }
}
```

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

