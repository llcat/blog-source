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
这个我相信大家都有听到过或自己动手写过，它的思路很简单(这里我假定按照递增来讲)，我们划分为几个步骤描述下：
假定我们有一个N个元素的数组array，我们从位置0开始。
1. 比较一对相邻的元素(a,b)
2. 如果元素大小关系不正确，交换这两个元素的位置。(如定义a>b就交换)
3. 重复步骤1和2，直到我们到达数组的末尾(最后一对是array[N-2], array[N-1])
4. 到现在，最大的元素已经到了最末尾，将N-1,并重复上述步骤直到N=1

- code(js version):
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

- 算法分析
最好: 正向有序，比较n-1次，交换0次。
最坏: 反向有序时，比较和交换次数都为(1+N-1)(N-1)/2=(N^2/2)-(N/2)次
可知冒泡排序的时间复杂度是O(N^2)

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
选择排序的思路比上面的冒泡排序更容易理解，首先我们找到数组中最小的元素，将它与数组的第一个元素交换位置。其次，在剩下的元素中找到最小的元素，将它与数组中的第二个元素交换位置，如此往复，直到将整个数组排完序。

- code(js version)
```javascript
function selectionSort(arr){
    for(let i=0; i<arr.length; i++){
        let min = i;
        for(let j=i+1; j<arr.length; j++){
            if(arr[j]<arr[min]){
                min = j
            }
        }
        let temp = arr[i]
        arr[i] = arr[min];
        arr[min] = temp;
    }
}
```

- 算法分析
插入排序做多需要N次交换和(N-1)+(N-2)+...+2+1次比较。
它的时间复杂度也是O(N^2)

##### 插入排序
插入排序就像我们整理扑克牌一样，将后面拿到手的牌插入到我们手上已经有序的牌中的适当位置。只是在计算机中，我们要给插入的元素腾出一个位置，那么比它大的元素都要后移一位。

- code(js version)
```javascript
function insertionSort(arr){
    for(let i=1; i<arr.length; i++){
        for(let j=i; j>0&&(arr[j]<arr[j-1]); j--){
            let temp = a[j-1];
            a[j-1] = a[j]
            a[j] = temp
        }
    }
}
```

- 算法分析
最好的情况是数组有序，我们需要比较N-1次，交换0次
最坏的情况是数组逆向有序，我们需要~N^2/2次的比较和交换
所以插入排序的时间复杂度也是O(N^2)

- 优化
上面的代码为了表现的更简单，有几处可以优化的地方。
1. 减少数组访问次数。

