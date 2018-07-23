---
title: SQL基础
date: 2017-04-20 19:53:45
tags: MySQL
categories: database
---

#### 梳理一遍SQL的基本语法

本文是对SQL基础语法( 主要是MySQL）的一个回顾和总结，从最基础的单表查询开始，对查询结果进行过滤，排序，分组，聚合等操作，以及后续表连接查询，插入，更新删除数据，使用视图，存储过程，管理事务处理等知识点的回顾。

> 参考书目
《SQL必知必会》，下面实验中使用表及数据均是本书作者提供的，我写这篇文章的目的是对本书中所有的例子进行动手实现，加强自己对SQL语法的理解。如果你感兴趣的话和我一起吧！
[建表及数据资源](http://www.forta.com/books/0672336073)
 
目录：

- [检索数据](#ch2)
- [排序检索数据](#ch3)
- [过滤数据](#ch4)
- [使用函数](#)
- 

<br>
<h5 id='ch2'>检索数据</h5>

**虽然SQL并不区分大小写，但由于不同软件的实现不同，导致有差异，如mysql忽略关键字和列名大小写，但是对表名的大小写是敏感的，这里我们规定下SQL的写法，对于关键字统一采用大写，表名使用大写开头，列名默认情况下使用小写，方便理解**

1. 单列，多列，所有列 ( *通配 )
```sql
-- 检索单列
SELECT prod_name FROM Products;
-- 检索多列
SELECT prod_id, prod_name, prod_price FROM Products;
-- 检索表中的所有列
SELECT * FROM Products; 
```

2. 检索不同的值(去重)&限制结果集大小

**DISTINCT关键字：**
DISTINCT关键字作用于后面跟随的所有列，不仅仅是只作用于紧跟于其后的一列

**LIMIT 和 OFFSET 关键字：**
LIMIT关键字是用来限制返回结果集的大小的，而OFFSET关键字是定义开始限制的位置，也就是在结果集中的偏移量。
一般我们这样使用: LIMIT 5 OFFSET 2；
在MYSQL中可以只使用LIMIT关键字来定义偏移值和返回的结果集大小：LIMIT NUM1, NUM2 {NUM1:偏移量，NUM2：返回结果集大小}

```sql
-- 检索不同的值
-- 不使用DISTINCT关键字时，由于一个厂家生产多个产品，所以会有多个相同的厂商id
SELECT DISTINCT vend_id FROM Products;
-- 检索去除厂商id和价格都相同的行
SELECT DISTINCT vend_id, prod_prices FROM Products;
-- 返回查询结果集的从第3条到7条数据，MySQL中行数从0开始算。
SELECT prod_name FROM Products LIMIT 2, 5;
SELECT prod_name FROM Products LIMIT 5 OFFSET 2;
```

<h5 id='ch3'>排序检索数据</h5>

1. 排序检索的数据

**ORDER BY 关键字：**
ORDER BY 关键字对查询的结果集进行排序，注意，ORDER BY 子句一定是一条SELECT语句的最后一个子句，ORDER BY不仅可以根据单列，多列排序，还可以通过关键字DESC(DESCENDING)，ASC(ASCENDING，升序是默认的排序方式，可以不指定)

```sql
-- 根据单列排序
SELECT prod_name FROM Products ORDER BY prod_name;

-- 根据多列排序(会现根据第一列排好序，在保证第一列有序(有相同值，如下面例子中的prod_price价格相等时）的情况下对指定的第2列进行排序，后面指定的字段依照此规则)
SELECT prod_id, prod_price, prod_name FROM Products ORDER BY prod_price, prod_name;

-- 检索结果按照prod_price, prod_name降序排列
SELECT prod_id, prod_price, prod_name FROM Products ORDER BY prod_price DESC , prod_name DESC;
```
tips：
并非一定只能指定检索的字段，还可以制定排序的字段是表中存在的其他字段。
DESC关键字仅对修饰的一个字段起作用，要多个降序排列，请指定多个DESC字段。

<h5 id='ch4'>过滤数据</h5>

**WHERE关键字：**
数据库表中通常情况下保存了大量的数据，一般业务情况下我们不可能需要全部的数据，我们需要指定一些条件对查询的结果集做限定，这些条件我们称为搜索条件，也叫过滤条件。

1. where支持的比较操作符

操作符 | 说明 | 操作符 | 说明
- | - | - | - 
=| 等于 | > | 大于
<> | 不等于 | >= | 大于等于
!= | 不等于 | !> | 不大于
< | 小于 | BETWEEN | 在两个值之间
<= | 小于等于 | IS NULL | 为 NULL值
!< | 不小于


```sql
-- 等于操作
SELECT prod_name, prod_price FROM Products WHERE prod_price= 3.49;
-- 不等于操作
SELECT vend_id, prod_name FROM Products WHERE vend_id != 'DLL01';
-- BETWEEN操作
SELECT prod_name , prod_price FROM Products WHRER prod_price BETWEEN 5 AND 10;
-- IS NULL判断
SELECT prod_name FROM Products WHERE prod_prices IS NULL;
```

2. 高级数据过滤

**AND, OR 组合查询条件**

可以使用 AND 和 OR 组合查询条件，但是要注意，在进行复杂组合使用时我们最好能对条件进行分组，不要依赖默认求值顺序。AND的优先级高于OR。

```SQL
-- 注意组合AND和OR操作符时，最好组合括号使用，不要依赖默认求值逻辑(下面这个例子，如果去掉括号，会先进行AND运算求值，再将条件作为OR运算的条件)
SELECT prod_name, prod_price FROM Products WHERE (vend_id = 'DLL01' OR vend_id='BRS01') AND prod_price >=10;
```

**IN, NOT关键字**

IN操作符用来指定一个条件集合，字段只需满足条件集合中任一条件即可。

NOT操作符用来否定其后跟随的任何查询条件，因此NOT不单独使用，需要与其他操作符一起使用

```SQL
-- 查找vend_id字段等于'DLL01'或者是'BRS01'的商品
SELECT prod_name, prod_price FROM Products WHERE vend_id IN ( 'DLL01', 'BRS01');

-- 查找 vend_id字段不等于'DLL01'的商品
SELECT prod_name,prod_price FROM Products WHERE NOT vend_id = 'DLL01';

-- 结合IN使用
SELECT prod_name, prod_price FROM Products WHERE vend_id NOT IN ( 'DLL01', 'BRS01');

```

**通配符过滤**

我们有时候并不能确定自己想要的数据在



<h5 id='ch'></h5>




