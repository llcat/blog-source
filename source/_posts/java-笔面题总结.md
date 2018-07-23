---
title: java 笔面题总结
date: 2017-04-20 00:03:34
tags:
  - database
  - web
  - java
categories: java
---

### 笔面题总结

**目录：**

- [Java相关](#java)
- [Web开发相关](#web)
- [数据库相关](#database)
- [框架相关](#framework)
- [设计模式相关](#design_pattern)

<h4 id='java'>Java相关</h4>

- based knowledge

switch能用于那些基本数据类型？
switch能用于的基本类型有 byte, char, short, int
switch能用于的引用类型：Byte，Character，Short，Integer（上面4种基本类型的包装类），String（jdk版本>=1.7)，enum

switch为什么不能作用于long(长整型）?
switch 语句被设计成跳转表，表面上看支持很多类型，但实际上只有一种，那就是 int 型，小于 int 的类型都会自动提升成 int。编译时，switch (abc) 语句被当成 goto addrs[abc]，而这一句被实现成机器指令时就成为 表首地址 + 偏移量，所以一个 abc 其实代表了一个偏移地址。至于为什么不能使用long，可能是在Java语言中设计switch语句考虑平台的兼容问题，很多机器还是32位机器。

- String

String 是基本数据类型吗？
不是，java中的基本数据类型有8种，分别是byte, char, short, int, long, float, double, boolean

- IO

- Exception

谈谈Java中异常的原理和应用
异常是指Java在运行时出现的非正常情况，Java也使用面向对象的思想来处理这些情况，将一些异常信息封装在类中来表示，Java中的异常分为两类Exception和Error，这两个都是Throwable的子类，Error是指程序中出现一些奔溃，程序不能继续运行的错误。


<h4 id='web'>Web开发相关</h4>

- based knowledge

请简述Session 和 Cookie 的区别

<h4 id='database'>数据库相关</h4>

查询记录使其没有重复的值

查分低于60分为不及格，大于60分为及格，大于80分为优秀

新建表A，复制表B中内容至表A，保证表结构一致

查询部门工资最高的前3人

查询部门工资高于平均工资的人

<h4 id='framework'>框架相关</h4>

<h4 id ='design_pattern'>设计模式相关</h4>

- 单例模式

请写一个你认为好的单例模式
考虑到单例模式需要防范下面几点：
(1) 多线程安全
(2) 反序列化
(3) 反射攻击
先说说可以保证多线程安全的方法
使用静态变量初始化单例

```java
class SingletonByStatic{
    private static SingletonByStatic instance = new SingletonByStatic();
    
    private SingletonByStatic(){
        
    }
    
    public static SingletonByStatic getInstance(){
        return instance;
    }
}
```

静态内部类(可以实现懒加载，在使用时才会初始化，而不是当类被加载时instance就被初始化呢。

```java
class SingletonByStaticNestedClass{
    private SingletonByStaticNestedClass(){

    }

    private static class SingletonHolder{
        private static SingletonByStaticNestedClass instance = new SingletonByStaticNestedClass();
    }

    public static SingletonByStaticNestedClass getInstance(){
        return SingletonHolder.instance;
    }
}
```

使用枚举（推荐，代码简单，并且保证了反序列化不唯一或者反射攻击)

```java
enum SingletonByEnum{

    INSTANCE{
        @Override
        public void infos(){
            System.out.print("i am a singleton");
        }
    };

    protected abstract void infos();
}
```


  