---
title: 了解Map容器
date: 2017-04-19 15:31:36
tags:
  - java
  - collections
categories: java
---

#### 一起看看Map容器吧

之前学习Java容器类时做的笔记, 做为从wiznote中转移的第一篇文章, 主要是探讨了一下map容器, 我们如何去写一个hashmap? Java自带的hashmap底层实现是怎么样的呢? 带着这些问题,看看我们下面的内容吧!

- [写一个自己的简单map](#my_map)
- [关于散列和散列码](#about_hash)
- [更进一步,如何写个HashMap容器](#my_hash_map)

<h5 id = my_map>写一个自己的简单map</h5>

我们来深入看看Map容器，他是如何工作的，有哪些类型的Map容器，我们如何选择自己需要的Map容器。
通常map容器也被叫做映射表，或者是关联数组，因为他是用来存储一组相关联的数据，即一组键值对，在标准的java容器类中包含下面几种类型的MAP实现:

 - HashMap
 - TreeMap
 - LinkedHashMap
 - WeakHashMap
 - ConcurrentHashMap
 
 它们根据一些实际需求，在查找，键值对的保存顺序，是否支持并发而有一些不同的实现。我们今天不对他们的全部进行探讨,选取其中用的较多的hashmap来看一下吧。
 
 **step 1**
首先我们实现一个最简单的Map容器，他的底层是个数组，不支持扩展大小，查询效率也非常低，并且他不能对键值的唯一性保证。如下：

```Java
public class MappingTable<K,V>{
	private Object[][] pairs;
	int index;
	public MappingTable(int length){
		pairs = new Object[length][2];
	}
	public void put(K key,V value){
		for(int i=0;i<index;i++){
			if(key.equals(pairs[i][0])){
				pairs[i]=new Object[]{key,value};
				return ;
			}
		}
		if(index>=pairs.length){
			throw new ArrayIndexOutOfBoundsException();
		}
		pairs[index++] = new Object[]{key,value};
	}
	@SuppressWarnings("unchecked")
	public V get(K key){
		for(int i=0;i<pairs.length;i++){
			if(key.equals(pairs[i][0])){
				return (V)pairs[i][1];
			}
		}
		return null;
	}
	public String toString(){
		StringBuilder builder = new StringBuilder();
		for(int i=0;i<index;i++){
			builder.append(pairs[i][0].toString());
			builder.append(" : ");
			builder.append(pairs[i][1].toString());
			if(index>i)
				builder.append("\n");
		}
		return builder.toString();
	}
	public static void main(String[] args){
		MappingTable<String,String> map = new MappingTable<String,String>(5);
		map.put("kaka","15");
		map.put("lisa","20");
		map.put("yita","18");
		System.out.println(map);
		System.out.println(map.get("lisa"));
	}
}
```

这个map实现的比较简单，可以看到上面我们自己实现的容器，无论是存放，还是取值，都要进行一次线性的查找，如果是几十个数据量还好，但是如果一个Map集合中想要存放成千上万个元素呢？难道我们每次都要从头到尾遍历一遍？这效率想想就低的可怕哈，有没有一种可以直接访问的方法，所以java类库的Map实现就引入了HashCode（散列码）的方式来取代对键值的缓慢的线性查找。在根类Object中，有一个hashCode()方法，他是一个native方法，默认是根据对象的某些信息转换得到的，理论上是相对唯一的，所有java对象都可以生成自己的散列码，而HashMap就是通过对象的散列码进行快速查询的。下面我们继续看看散列是啥。

<h5 id = 'about_hash'>散列和散列码</h5>

在看散列前，我们先看一个关于Hashmap的例子。测试Java中的hashmap到底是依靠什么进行工作的，是通过equals()方法保证键值的唯一吗？我们自己编写的类，不覆写hashcode()方法，存放在hash类型的集合中，能保证唯一吗？来看看吧！

先来看一个例子，如果我们编写自己的类作为HashMap的键，不覆写他的hashCode(）方法，看看HashMap能否正常工作。
> 射击运动员（键） --- Shooter
他的射击靶数（值）--- TargetNum

Shooter类：

```java
package ch17.deepincontainers;
public class Shooter {
	private int id;
	public Shooter(int id){
		this.id = id;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "Shooter#"+id;
	}
}
```

TargetNum类：

```java
package ch17.deepincontainers;
import java.util.Random;
public class TargetNum {
	private Random rand = new Random();
	String targetNum = String.format("TargetNum is %.2f", rand.nextDouble()*10);
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return targetNum;
	}
}
```

TestHashMap类：

```java
package ch17.deepincontainers;
import java.lang.reflect.Constructor;
import java.util.*;
import java.util.Map.Entry;
public class TestHashMap {
	public static void main(String[] args)throws Exception {
		// TODO Auto-generated method stub
		testHashMap(Shooter.class);
	}
	public static<T extends Shooter> void testHashMap(Class<T> type) throws Exception{
		Map<Shooter,TargetNum> map = new HashMap<Shooter,TargetNum>();
		Constructor<T> cons = type.getConstructor(int.class);
		for (int i = 0; i < 10; i++) {
			map.put(cons.newInstance(i), new TargetNum());
		}
		for(Entry e:map.entrySet()){
			System.out.println(e+" hashcode: "+e.getKey().hashCode());
		}
		System.out.println("-------after put------");
		map.put(cons.newInstance(3),new TargetNum());
		for(Entry e:map.entrySet()){
			System.out.println(e+" hashcode: "+e.getKey().hashCode());
		}
		System.out.println("-----can i get by my key-----");
		System.out.println(map.get(cons.newInstance(3)));
	}
}
```

看看下面的输出结果：

```
Shooter#8=TargetNum is 0.04 hashcode: 621009875
Shooter#1=TargetNum is 8.33 hashcode: 1735600054
Shooter#4=TargetNum is 3.46 hashcode: 1836019240
Shooter#6=TargetNum is 7.27 hashcode: 1173230247
Shooter#9=TargetNum is 1.71 hashcode: 1265094477
* Shooter#3=TargetNum is 8.01 hashcode: 2133927002 
Shooter#5=TargetNum is 7.66 hashcode: 325040804
Shooter#0=TargetNum is 4.58 hashcode: 356573597
Shooter#2=TargetNum is 7.02 hashcode: 21685669
Shooter#7=TargetNum is 1.47 hashcode: 856419764
-------after put------
Shooter#8=TargetNum is 0.04 hashcode: 621009875
Shooter#1=TargetNum is 8.33 hashcode: 1735600054
* Shooter#3=TargetNum is 2.07 hashcode: 2125039532
Shooter#4=TargetNum is 3.46 hashcode: 1836019240
Shooter#6=TargetNum is 7.27 hashcode: 1173230247
Shooter#9=TargetNum is 1.71 hashcode: 1265094477
* Shooter#3=TargetNum is 8.01 hashcode: 2133927002
Shooter#5=TargetNum is 7.66 hashcode: 325040804
Shooter#0=TargetNum is 4.58 hashcode: 356573597
Shooter#2=TargetNum is 7.02 hashcode: 21685669
Shooter#7=TargetNum is 1.47 hashcode: 856419764
-----can i get by my key-----
null
```

结果显然是不能正常工作，不仅相同的键值被重复添加在map中呢，并且不能正常取值。在看hashmap的源码前，我们在进行下其他的猜想，其一，是不是没有覆写对象的equals方法导致添加了重复的键值，其二，没有覆写对象的hashcode方法导致我们无法取值，既然如此，我们在写两个类测试下。

class ShooterJustOverEquals:

```java
public class ShooterJustOverEquals extends Shooter {
	
	public ShooterJustOverEquals(int id){
		super(id);
	}
	
	@Override
	public boolean equals(Object obj) {
		return obj instanceof ShooterJustOverEquals &&
				this.getId() == ((ShooterJustOverEquals) obj).getId();
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "ShooterJustOverEquals:"+getId();
	}
	public static void main(String[] args) throws Exception{
		TestHashMap.testHashMap(ShooterJustOverEquals.class);
	}
}
```

结果如下

```
ShooterJustOverEquals:8=TargetNum is 3.04 hashcode: 621009875
ShooterJustOverEquals:1=TargetNum is 4.70 hashcode: 1735600054
ShooterJustOverEquals:4=TargetNum is 7.44 hashcode: 1836019240
ShooterJustOverEquals:6=TargetNum is 2.52 hashcode: 1173230247
ShooterJustOverEquals:9=TargetNum is 6.13 hashcode: 1265094477
* ShooterJustOverEquals:3=TargetNum is 4.84 hashcode: 2133927002
ShooterJustOverEquals:5=TargetNum is 4.85 hashcode: 325040804
ShooterJustOverEquals:0=TargetNum is 5.97 hashcode: 356573597
ShooterJustOverEquals:2=TargetNum is 8.69 hashcode: 21685669
ShooterJustOverEquals:7=TargetNum is 9.17 hashcode: 856419764
-------after put------
ShooterJustOverEquals:8=TargetNum is 3.04 hashcode: 621009875
ShooterJustOverEquals:1=TargetNum is 4.70 hashcode: 1735600054
* ShooterJustOverEquals:3=TargetNum is 3.35 hashcode: 2125039532
ShooterJustOverEquals:4=TargetNum is 7.44 hashcode: 1836019240
ShooterJustOverEquals:6=TargetNum is 2.52 hashcode: 1173230247
ShooterJustOverEquals:9=TargetNum is 6.13 hashcode: 1265094477
* ShooterJustOverEquals:3=TargetNum is 4.84 hashcode: 2133927002
ShooterJustOverEquals:5=TargetNum is 4.85 hashcode: 325040804
ShooterJustOverEquals:0=TargetNum is 5.97 hashcode: 356573597
ShooterJustOverEquals:2=TargetNum is 8.69 hashcode: 21685669
ShooterJustOverEquals:7=TargetNum is 9.17 hashcode: 856419764
-----can i get by my key-----
null
```

可以看到，我们覆写了equls方法，但是没有起作用，我可以猜测是不是要结合hashcode方法才能生效呢？我们接下来继续试一把

ShooterOverEqualsAndHashcode:

```java
public class ShooterOverEqAndHashcode extends ShooterJustOverEquals {
	public ShooterOverEqAndHashcode(int id) {
		super(id);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public int hashCode() {
		return getId();
	}
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "ShooterOverEqAndHashcode#"+getId();
	}
	public static void main(String[] args) throws Exception {
		TestHashMap.testHashMap(ShooterOverEqAndHashcode.class);
	}
}
```

结果：

```
ShooterOverEqAndHashcode#0=TargetNum is 6.34 hashcode: 0
ShooterOverEqAndHashcode#1=TargetNum is 1.33 hashcode: 1
ShooterOverEqAndHashcode#2=TargetNum is 1.13 hashcode: 2
ShooterOverEqAndHashcode#3=TargetNum is 6.43 hashcode: 3
ShooterOverEqAndHashcode#4=TargetNum is 4.49 hashcode: 4
ShooterOverEqAndHashcode#5=TargetNum is 9.18 hashcode: 5
ShooterOverEqAndHashcode#6=TargetNum is 0.67 hashcode: 6
ShooterOverEqAndHashcode#7=TargetNum is 2.66 hashcode: 7
ShooterOverEqAndHashcode#8=TargetNum is 8.27 hashcode: 8
ShooterOverEqAndHashcode#9=TargetNum is 4.49 hashcode: 9
-------after put------
ShooterOverEqAndHashcode#0=TargetNum is 6.34 hashcode: 0
ShooterOverEqAndHashcode#1=TargetNum is 1.33 hashcode: 1
ShooterOverEqAndHashcode#2=TargetNum is 1.13 hashcode: 2
ShooterOverEqAndHashcode#3=TargetNum is 2.92 hashcode: 3
ShooterOverEqAndHashcode#4=TargetNum is 4.49 hashcode: 4
ShooterOverEqAndHashcode#5=TargetNum is 9.18 hashcode: 5
ShooterOverEqAndHashcode#6=TargetNum is 0.67 hashcode: 6
ShooterOverEqAndHashcode#7=TargetNum is 2.66 hashcode: 7
ShooterOverEqAndHashcode#8=TargetNum is 8.27 hashcode: 8
ShooterOverEqAndHashcode#9=TargetNum is 4.49 hashcode: 9
-----can i get by my key-----
TargetNum is 2.92
```

这回我们看到，HashMap正常在工作呢，我们调转到hashmap的源码中去看看两个关键位置的操作
1. put({key : value})
2. get(key)

发现Hashmap的底层实现是这样的，我们用一张图来说明：

{% asset_img how_to_hash.png how_to_hash %}  


<h5 id = 'my_hash_map'>更进一步,如何写个HashMap容器</h5>

现在我们知道了散列的原理，那么实现一个简单的HashMap也就没那么困难呢，我们接下来也尝试实现一个简单的SimpleHashMap，在此之前，先和大家来看看一个标准的map容器是一个怎么样的大体结构，我们来仿照这个结构编写我们的hashmap

{% asset_img abstract_map.jpg map_structure %}

AbstractMap<K,V>这个抽象基类，这个基类包含了一个抽象方法public abstract Set<Map.Entry<K,V>> entrySet(),这个entrySet是用来存放键值对的集合的，我们实际的键值存放在Entry<K,V>中。这个Entry由我们自己提供，或者使用系统提供给我们的两个默认实现，SimpleEntry和SimpleImmutableEntry。

那么我们按照这个结构，编写一个自己的hash map容器类：

```Java
package ch17.deepincontainers;
import java.util.AbstractMap;
import java.util.Map;
import java.util.Set;
import java.util.*;
public class SimpleHashMap<K,V> extends AbstractMap<K, V> implements Map<K, V> {
	private final static int SIZE = 97;
	private LinkedList<Entry<K,V>>[] buckets = new LinkedList[97];
	@Override
	public V get(Object key) {
		int index = key==null?0:(key.hashCode()%SIZE);
		if(buckets[index] == null){
			return null;
		}
		V value = null;
		for(Entry<K,V> e : buckets[index]){
			if(e.getKey()==null){
				value = e.getValue();
			}
			else if(e.getKey().equals(key)){
				value = e.getValue();
			}
		}
		return value;
	}
	@Override
	public V put(K key, V value) {
		// TODO Auto-generated method stub
		V oldValue = get(key);
		int index = key==null?0:(key.hashCode()%SIZE);
		if(buckets[index]==null){
			buckets[index] = new LinkedList<Entry<K,V>>();
		}
		if(buckets[index].size()>0){
			for(Entry<K,V>e:buckets[index]){
				if(e.getKey()==null){
					buckets[index].remove(e);
					buckets[index].add(new SimpleEntry(key, value));
				}else if(e.getKey().equals(key)){
					buckets[index].remove(e);
					buckets[index].add(new SimpleEntry(key, value));
				}
			}
		}else{
			buckets[index].add(new SimpleEntry<K,V>(key,value)); 
		}
		return oldValue;	
	}
	@Override
	public V remove(Object key) {
		int index = key==null ? 0 : (key.hashCode()%SIZE);
		if(buckets[index]==null){
			return null;
		}
		V value = null;
		for(Entry<K,V> e : buckets[index]){
			if(e.getKey()==null){
				value = e.getValue();
				buckets[index].remove(e);
			}else if(e.getKey().equals(key)){
				value = e.getValue();
				buckets[index].remove(e);
			}
		}
		return value ;
	}
	@Override
	public Set<java.util.Map.Entry<K, V>> entrySet() {
		Set<Entry<K,V>> set =new HashSet<Entry<K,V>>();
		for(List<Entry<K,V>> list:buckets){
			if(list==null){
				continue;
			}
			else{
				set.addAll(list);
			}
		}
		return set;
	}
	
	public static void main(String[] args){
		SimpleHashMap<String,Integer> map = new SimpleHashMap<String,Integer>();
		map.put(null, 1);
		map.put(null, 2);
		map.put("llcat", 25);
		System.out.println(map.get(null));
		System.out.println(map.get("llcat"));
		for(Entry<String,Integer> e:map.entrySet())
			System.out.println(e.getKey());
		map.remove(null);
		System.out.println(map.get(null));
		map.remove("llcat");
		System.out.println(map.get("llcat"));
	}
}
```

我们只覆写了几个常用的方法，其目的是理解散列到底是如何工作的。到此为止，我们应该对Map容器有了进一步的了解，希望大家可以去看看HashMap的源码实现。接下来我们看看如何给自己的类覆写一个好的hashCode()方法，比如像我们上面那样为shoooter类覆写的hashcode不是理想的实现，不好的hash值可能会导致将所有的键值对散列到了集中的几个桶位，这样导致散列的不够平均，查询速度也会慢上很多。

