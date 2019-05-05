---
title: 防止ssh暴力破解
date: 2019-05-05 13:57:27
categories: linux
---

#### 前言
起因是自己买的一台vps上搭的nginx经常隔一段时间就挂掉，上面就丢了几个静态页面，理论上不会这么频繁的出现挂掉的这种情况，于是连上去查log, `/var/log/nginx/access.log`有恶意扫描访问，但是不是特别多，日志的大小也还算正常。其他的log也没看出什么问题。转到`/var/log/`检查看看有没有什么异常的系统日志。发现`btmp`这个文件特别大，400多M。

{% asset_img var_log_detail.png var_log_detail %}

查阅资料后发现`btmp`这个文件是系统记录ssh登陆失败的日志，emmmm....这么大肯定是有问题的，那我们接下来看看怎么解决吧~

<!-- more -->

#### 查看btmp日志
`btmp`这个日志文件需要使用系统提供的`lastb`工具查看，普通的`cat`,`vim`等工具查看是乱码，截至到我写这篇日志时，我的机器还在被暴力破解，可以看看最近的10条日志。
```sh
lastb -10
```

```
jaxson   ssh:notty    129.213.117.53   Sun May  5 02:26 - 02:26  (00:00)
jaxson   ssh:notty    129.213.117.53   Sun May  5 02:26 - 02:26  (00:00)
lab      ssh:notty    106.12.33.235    Sun May  5 02:26 - 02:26  (00:00)
lab      ssh:notty    106.12.33.235    Sun May  5 02:26 - 02:26  (00:00)
root     ssh:notty    218.92.0.194     Sun May  5 02:25 - 02:25  (00:00)
root     ssh:notty    218.92.0.194     Sun May  5 02:25 - 02:25  (00:00)
root     ssh:notty    218.92.0.194     Sun May  5 02:25 - 02:25  (00:00)
Qwerty1  ssh:notty    180.96.28.87     Sun May  5 02:25 - 02:25  (00:00)
Qwerty1  ssh:notty    180.96.28.87     Sun May  5 02:25 - 02:25  (00:00)
test1    ssh:notty    106.13.4.172     Sun May  5 02:25 - 02:25  (00:00)
```

#### 统计下攻击的IP
大体上可以分为下面几步，逐步写成管道流
```sh
# 只取日志中的ip信息
lastb -20 | awk -F " " '{print $3}' | sort
# 统计每个ip出现的次数
lastb -20 | awk -F " " '{print $3}' | uniq -c
# 根据统计的ip出现的次数，从大到小排列
lastb -20 | awk -F " " '{print $3}' | sort | uniq -c | sort -k 1,1nr
```
这里我们已经完成了对恶意ip的统计操作，将流输出到重定向到文件保存即可
```sh
# 这次我们统计所有的日志，非前20条呢
lastb | awk -F " " '{print $3}' | sort | uniq -c | sort -k 1,1nr > black_ip.log
```

看一下攻击次数前十的ip有那些
```sh
head -10 black_ip.log
```

output:
```
44251 112.85.42.186
43374 218.92.0.132
43149 112.85.42.195
43148 218.92.0.177
43146 112.85.42.144
40004 218.92.0.173
37044 218.92.0.190
36981 218.92.0.175
36981 218.92.0.185
36377 218.92.0.188
```
可以看到光前面的几个ip尝试的暴力破解的次数已经很可怕呢，我的个小vps怕不是要被玩坏呢~

#### 怎么解决问题？
大致看了下，解决方案有两种
1. 修改ssh的默认端口22
这种方式比较简单，修改22端口为自定义的端口,配置文件是`/etc/ssh/sshd_config`,修改配置项Port后，重启sshd服务即可。
```sh
# 重启sshd服务
service sshd restart
# 查看sshd是否在自己设置的端口工作
netstat -ntlp
```
改了默认的端口后，删除之前的btmp日志，在重建一个btmp,可以使用`lastb`检查下，短时间内应该在没有暴力破解的试错日志呢。
```sh
rm /var/log/btmp
touch /var/log/btmp
```

2. 使用`iptables`将恶意ip禁掉。
可以参考下这篇[文章](https://www.jianshu.com/p/b221b790cb1e)

