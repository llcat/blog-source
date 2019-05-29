---
title: LeetCode(SQL Summary)
date: 2018-10-25 15:02:29
tags: SQL
categories: leetcode
---

#### LeetCode SQL类题目总结
LeetCode上非付费的SQL题目就那么几道,这几天花时间刷了一遍，顺便总结下里面涉及到的知识点。

<!--more-->

#### Easy Level
##### 175. Combine Two Tables
Table: Person

Column Name | Type
-|-    
PersonId | int
FirstName | varchar
LastName | varchar

PersonId is the primary key column for this table.

Table: Address

| Column Name | Type    |
|-|-|
| AddressId   | int     |
| PersonId    | int     |
| City        | varchar |
| State       | varchar |

AddressId is the primary key column for this table.

Write a SQL query for a report that provides the following information for each person in the Person table, regardless if there is an address for each of those people:

FirstName, LastName, City, State

**知识点:outter join**
看条件可以知道，我们需要查找出Person表中所有的项，即使某个人没有对应的地址。所以我们只需要使用左外连接就可以完成查询要求。
```sql
SELECT FirstName, LastName, City, State 
FROM Person 
LEFT JOIN Address
ON Person.PersonId=Address.PersonId
```

##### 176. Second Highest Salary
Write a SQL query to get the second highest salary from the Employee table.

| Id | Salary |
|-|-|
| 1  | 100    |
| 2  | 200    |
| 3  | 300    |

For example, given the above Employee table, the query should return 200 as the second highest salary. If there is no second highest salary, then the query should return null.

| SecondHighestSalary |
|-|
| 200 |

**知识点:control flow functions**
这道题我认为主要的考察点在MySQL的流程控制函数，如`CASE`,`IF`,`IFNULL`,`NULLIF`,这道题目我们结合使用`LIMIT`和`IFNULL`函数就可以解决
```sql
SELECT IFNULL(
    (SELECT DISTINCT Salary
     FROM Employee
     ORDER BY Salary
     LIMIT 1,1
    ), NULL
) AS SecondHighestSalary
```
> [MySQL control flow functions](https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html)

##### 182. Duplicate Emails
Write a SQL query to find all duplicate emails in a table named Person.

| Id | Email   |
-|-
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |

For example, your query should return the following for the above table:

| Email |
|-|
| a@b.com |

Note: All emails are in lowercase.

**知识点:GROUP BY**
这个问题主要是用来考察`GROUP BY`和一些聚合函数的用法，使用`COUNT`函数和`GROUP BY`即可以解决这道问题。

```sql
SELECT Email
FROM Person
GROUP BY Email
HAVING COUNT(Email)>1;
```
> [1. MySql Handling of GROUP BY](https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html)
[2. Aggregate(GROUP BY) Functions](https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html)

##### 183. Customers who nerver order

Suppose that a website contains two tables, the Customers table and the Orders table. Write a SQL query to find all customers who never order anything.

Table: Customers.

| Id | Name  |
-|-
| 1  | Joe   |
| 2  | Henry |
| 3  | Sam   |
| 4  | Max   |

Table: Orders.

| Id | CustomerId |
-|-
| 1  | 3          |
| 2  | 1          |

Using the above tables as example, return the following:

| Customers |
|-|
| Henry     |
| Max       |


#### Medium Level

#### Hard Level

