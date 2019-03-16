---
title: 排序算法
date: 2019-03-16 14:29:16
tags: sort
categories: algorithm
---

#### 简介
排序算法是对一个数组(或列表)按照一定的规则(递增，递减，字典等)对它的项进行排序。排序有很多解决方案，比如我们可以通过一系列的比较和交换操作让一组数据有序。我们也可以采用分治的思想让一组数据从部分有序向全部有序演进(如堆排和快排)，更还有一些不基于比较的排序算法。下面，我们从较基本的几个排序算法入手，开始我们的排序算法之旅。

> 参考资料
> [算法可视化visualgo](https://visualgo.net/zh)
> [算法4-Sorting](https://algs4.cs.princeton.edu/20sorting/)

<!-- more -->

#### 几个常见的基于比较的排序算法
##### 冒泡排序
这个我相信大家都有听到过或自己动手写过，它的思路很简单(这里我假定按照递增来讲)，每次将相邻的两项互相比较，将较大的项后移。那么经过一轮的比较后，最大的项就像气泡一样上浮到了最上层。

- code(javascript version):
```javascript
function bubbleSort(arr){
    for(let i=0; i<arr.length; i++){
        for(let j=0; j<arr.length-i-1; j++){
            if (a[j]>a[j+1]){
                let temp = a[j]
                a[j] = a[j+1]
                a[j+1] = temp
            }
        }
    }
}
```

- 时间复杂度
最好: 正向有序，比较n-1次，交换0次。
最坏: 反向有序时，比较和交换次数都为(1+n-1)(n-1)/2, 时间复杂度为O(n^2)

- 优化
我们可以通过提前终止的方式来优化冒泡排序。
```javascript
function betterBubbleSort(arr){
    for(let i=0; i<arr.length; i++){
        // 假定默认为有序, 如果某一轮遍历中不存在交换, 
        // 那么我们可以认为数组有序呢，可提前退出。
        let isOrdered = true
        for(let j=0; j<arr.length-i-1; j++){
            if(a[j]>a[j+1]){
                isOrdered = false
                let temp = a[j]
                a[j] = a[j+1]
                a[j+1] = temp
            }
        }
        // 提前终止
        if(isOrdered){
            break
        }
    }
}
```

##### 选择排序
选择排序的思路比上面的冒泡排序更容易理解，一开始我们假定第一项为最小的项，计最小项的索引为0，依次往后遍历其他项，比较大小并更新最小项的索引值，一轮完成后，交换最小项与第一项的位置。重复这个步骤，就可以完成排序操作。

- code(javascript version)
```javascript
function selectSort(arr){
    
}
```
