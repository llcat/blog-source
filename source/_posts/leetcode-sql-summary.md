---
title: LeetCode(SQL Summary)
date: 2018-10-25 15:02:29
tags: SQL
categories: database
---

#### LeetCode SQL类题目总结
LeetCode上非付费的SQL题目就那么几道,这几天花时间刷了一遍，顺便总结下里面涉及到的知识点。

#### Easy Level
##### 175. Combine Two Tables
Table: Person
| Column Name | Type    |
|     -       |   -     |
| PersonId    | int     |
| FirstName   | varchar |
| LastName    | varchar |

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

**知识点:**

#### Medium Level

#### Hard Level

