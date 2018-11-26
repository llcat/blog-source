---
title: docker-introduction
date: 2018-04-27 14:06:59
tags:
---

#### 起步

- **docker概念**
  docker是一个能让开发者和系统管理员使用容器开发，管理，运行应用的平台，我们把使用linux容器部署应用称为容器化，容器并非是一个新的技术，但是使用它部署应用非常的方便，它具有以下优点:
  
  - 灵活: 最复杂的应用也可以容器化
  - 轻量: 容器利用共享的主机内核
  - 可更换: 你可以随时更换和升级
  - 可移植: 你可以在本地完成构建，然后部署到你需要部署的任何地方(cloud or anywhere)
  - 可拓展:可以增加和自动分发容器副本
  - 可堆叠: 你可以即时的垂直堆叠服务

- **镜像和容器(Image and Container)**
  **镜像(Image)**
  我们可以由镜像来启动一个容器，一个镜像是一个可执行的程序包，含有你的应用运行时需要的一切东西，代码，运行环境，依赖包，环境变量，配置文件等。
  **容器(Container)**
  容器是镜像运行时的一个实例，或者说是镜像在内存中运行时,具有状态或是用户进程的镜像。你可以使用`docker ps`查看正在运行的容器，类似你在linux系统中查看进程一样。

- **docker命令回顾**
  ```sh
  ## List Docker CLI Commands
  docker
  docker container --help
  docker container ls --help

  ## Display docker version and info
  docker --version
  docker version
  docker info

  ## Execute docker image
  docker run (image-name, like hello-world)

  ## List all docker images
  docker image ls

  ## List docker containers(all,runing, all and in quite mode)
  docker container ls
  docker container ls --all
  docker container ls -aq
  ```
#### 容器(Containers)

- **引导**
  这章我们以容器的方式来构建我们的应用,不同于常规的模式,我们从该方式的最底层层次(container)来开始构建我们的应用，在containers层之上还有services层,用来定义container在生产环境中如何运作，最顶层是stacks层，用来定义services之间的交互。

- **新的开发环境**
  在过去，我们想要编写一个python应用，首先肯定是去在本机安装一个python解释器，然后安装一堆依赖的包去完成开发工作，但是会有这样一种情况，你的应用在本地机器环境上运行的很好，但是现在想要将他放在server上运行时就不一定呢，你可能需要重新手动在server上将一堆依赖配齐，当然，手动配置一台server的运行环境看起来问题不大，但是如果是10台，100台呢(当然这种重复工作用脚本也可以解决)？是否有一个更合适的方式来解决这个困境。
  在docker中，我们可以使用一个可移植的python运行环境当作一个镜像，在构建时将将这个python镜像和我们的程序代码一起包括在内，确保我们的代码，依赖，运行时环境会打包在一起迁移。这个可移植的python环境镜像是由Dockerfile来进行定义的。

- **使用Dockerfile定义一个容器**
  Dockerfile文件定义了在容器内运行环境发生的变化,在这个容器环境中，类似网络接口和磁盘驱动等资源是虚拟的，这个容器是完全与你的系统相隔离的，所以你需要映射端口到外部，并且指定需要拷贝什么文件到这个容器环境中来,完成这些定义后，可以预期运行在这个容器里的应用无论运行在何处，他的运行环境始终是一致的。

  下面我们来新建一个Dockerfile文件并完成相关的定义
  ```sh
  # use an offical python runtime as a parent image
  # 使用官方的python运行环境作为我们的父镜像
  FROM python:2.7-slim

  # set the working directory to /app
  # 设置工作路径为 /app
  WORKDIR /app

  # Copy the current directory contents into the container at /app
  # 将当前路径下的所有内容添加到容器的/app文件夹下
  ADD . /app

  # install any needed packages specified in requirements.txt
  # 安装app运行需要的依赖包
  RUN pip install --trusted-host pypi.python.org -r requirements.txt

  # Make port 80 avaliable to the world outside this container
  # 使80端口对于外界可用
  EXPOSE 80

  # Define environment variable
  # 定义了一个环境变量叫NAME,值为llcat
  ENV NAME llcat

  # Run app.py when the container launches
  # 容器启动时执行命令 python app.py
  CMD ["python","app.py"]
  ```
  这样我们就完成了一个Dockerfile，接下来我们要创建相关的app.py文件和requirements.txt文件。

- **创建app应用**
  接下来我们要创建我们应用相关的文件，app.py和requirements.txt,将其放在Dockerfile的同级目录下，在Dockerfile中编写的ADD指令会帮助我们将应用文件也打包到镜像中，得益于EXPOSE提供的80端口，我们可以在外界使用http协议访问我们应用返回的内容。
  requirements.txt
  ```
  Flask
  Redis
  ```

  app.py
  ```python
  from flask import Flask
  from redis import Redis, RedisError
  import os
  import socket

  # Connect to Redis
  redis = Redis(host="redis", db=0,     socket_connect_timeout=2, socket_timeout=2)

  app = Flask(__name__)

  @app.route("/")
  def hello():
    try:
        visits = redis.incr("counter")
    except RedisError:
        visits = "<i>cannot connect to Redis, counter disabled</i>"

    html = "<h3>Hello {name}!</h3>" \
           "<b>Hostname:</b> {hostname}<br/>" \
           "<b>Visits:</b> {visits}"
    return html.format(name=os.getenv("NAME", "world"), hostname=socket.gethostname(), visits=visits)

  if __name__ == "__main__":
      app.run(host='0.0.0.0', port=80)
  ```

  这样我们就完成了这个应用的搭建，分析下，RUN pip install -r requirements.txt会帮助我们下载需要的依赖，ENV指令可以设置在这个容器中的环境变量，我们无需在自己的系统里安装python环境和requirements.txt中需要的依赖,也不会在构建或运行镜像时将这些环境和依赖安装在你的系统上，看起来你没有安装任何东西，但实际上你拥有一切需要的环境和依赖。
  
- **构建应用**
  现在我们可以开始构建应用呢，确认你当前的工作路径下存在`Dockerfile, app.py, requirements.txt`三个文件，你可以使用`ls`命令查看。
  接下来我们可以使用构建命令来构建一个镜像，你可以使用`-t`参数来给镜像指定一个友好的名字(name:tag的格式，如果你不指定tag,默认是name:lastest)。
  ```
  docker build -t container_demo .
  ```
  现在我们的机器上已经有一个镜像,我们可以使用下面的指令查看
  ```
  docker image ls

  REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
  container_demo      latest              070ee1f77988        3 days ago          151MB
  python              2.7-slim            b16fde09c92c        4 weeks ago         139MB
  ```

- **运行应用**
  接下来使用运行指令将我们的应用跑起来，使用`-p`参数来指定本机的某个端口(eg:9999)与容器开放的80端口关联起来。
  ```
  docker run -p 9999:80 container_demo
  ```
  在我们的app.py中可以看到，我们的python应用监听的是地址和端口是http://0.0.0.0:80,但这是对于容器内部而言，python应用监听的是容器内的端口，对于它而言并不会知道我们在外部将该容器的80端口与我们的9999端口关联起来呢，所以我们在外部使用浏览器或其他方式访问的地址应该是`http://localhost:9999`
  ```
  curl http://localhost:9999
  ```
  > 在Window系统中，Ctrl+C不能停止一个运行的容器，你需要使用命令`docker container stop <Container Name Or Id>`来停止一个运行的容器。

- **分享镜像**
  分享我们的docker镜像前需要注册一个Docker Id,我们默认使用Docker官方提供给我们的公用仓库。如果你有特殊需求也可以搭建自己的私有仓库。如果你还没有Docker Id,前往[cloud.docker.com](https://cloud.docker.com)注册,注意国内用户这里需要挂VPN，因为注册页使用了谷歌的人机验证服务。
  注册完成后使用下面命令登陆
  ```
  docker login
  ```

- **镜像标签**
  我们使用`username/repository:tag`这种申明方式来关联一个本地镜像到远程仓库,尽量给`repository:tag`取一个有意义的名字，类似`get-started:part2`，表示将本地镜像放置在`get-started`仓库，镜像标签为`part2`。我们使用下面的命令来给一个镜像打标签。
  ```
  # docker tag image username/get-started:tag
  docker tag container_demo
  ```
  
- **发布镜像**
  使用下面的命令将你的本地镜像推送到远程仓库,完成后即可登陆Docker Hub查看已经推送的镜像。
  ```
  docker push username/repository:tag
  ```
  如果你使用了自己搭建的私有镜像仓库，那么你需要指定username为具体的仓库地址，以我们自己搭建的nexus私有库为例：
  ```
  # 登陆后输入用户名和密码
  docker login 10.203.71.34:9091
  # 给你想要上传的image打tag
  docker tag 10.203.71.34:9091/repo-name:tag
  # 推送镜像至私有仓库
  docker push 10.203.71.34:9091/repo-name:tag
  ```

- **从远程仓库拉取和运行镜像**
  到这步为止，你已经可以使用下面的命令在任何一台机器上运行你的应用呢。
  ```
  docker run -p 80:80 username/repository:tag
  ```
  如果你的本地不存在这个镜像，docker会先从远程仓库拉取到这个镜像,无论你在那台机器上运行`docker run`指令，docker都会自动帮你完成拉取这个包含python运行环境，相关依赖包，你的应用代码的仓库，并帮你自动执行应用。

- **docker命令回顾**
  ```sh
  # Create image using this directory Dockerfile
  docker build -t <image-name> .
  # Run a image and binding port 9999 to 80
  docker run -p 9999:80 <image-name>
  # Run with detached mode
  docker run -d -p 9999:80 <image-name>
  # List running containers
  docker container ls
  # List all containers even container is not running
  docker container ls -a
  # Gracefully stop a running container
  docker container stop <hash>
  # Force stop a running container
  docker container kill <hash>
  # Remove specified container from this machine
  dokcer container rm <hash>
  # Remove all containers
  docker container rm $(docker container ls -a -q)
  # List all images on this machine
  docker image ls -a
  # Remove specified image on this machine
  docker image rm <hash>
  # Remove all images
  docker image rm $(docker iamge ls -a -q)
  # Login in this CLI session use your docker credentials
  # Tag image for upload to registry
  docker tag <image> username/repository:tag
  # Upload tagged image to your registry
  docker push username/repository:tag
  # Run image from a registry
  docker run username/repository:tag
  ```

#### 服务(Services)

- **引言**
  开始这章前确保你已经掌握docker相关的基本概念，并知道如何创建和使用container,在这个前提下，我们会学习如何动态的拓展我们的应用并实现负载均衡。那么我们需要进入分布式应用的下一个层次:`the services`

- **关于Services**
  在一个分布式的应用中，应用不同的功能部分被称为服务，以搭建一个视频分享的网站来讲：我们需要一个服务用来存储应用的数据。一个服务用来在后台对用户上传的视频进行转码，另一个服务用来提供展示的用户界面。那么services就可以看作是生产环境中的containers,一个service也仅仅运行一个镜像，不同的地方在于在services这个层次结构中，我们可以定义镜像的运行方式。比如绑定在那个端口运行，运行多少个container的副本等等，在配置文件中我们改变一个数字就可以增加运行的容器数目，从而分配更多的计算资源。在docker平台上，我们很容易就可以实现上述的内容。

- **`docker-compose.yml`文件**
  保存下面的配置到文件`docker-compose.yml`中。
  ```yml
  version: "3"
  services:
    web:
      image: username/repo:tag
      deploy:
        replicas: 5
        resources:
          limits:
            cpus: "0.1"
            memory: 50M
        restart_policy:
          condition: on-failure
      ports:
        - "4000:80"
      networks:
        - webnet
    networks:
      webnet:
  ```
  在`docker-compose.yml`文件中，告诉docker做下面这些工作。
  
  - 使用你指定的镜像。
  - 运行该镜像的5个实例作为一个服务，定义该服务的名称为`web`，并限定了每个实例使用的资源大小。
  - 当有容器异常退出时，立即重启容器。
  - 绑定本机的4000端口与服务`web`的80端口绑定。
  - 通知`web`下的所有容器共享80端口，经由一个名为`webnet`的负载均衡网络。
  - 定义了一个默认配置的网络`webnet`(默认的是一个负载均衡的网络)

- **运行新的负载均衡应用**
  在使用`docker stack deploy`命令部署我们的服务前,我们需要先执行下面的命令：
  ```
  docker swarm init
  ```
  > **Note**：我们会在后续的章节中介绍上面这条指令的意义，如果你不执行`docker swarm init`，会得到错误提示: <font color="red">this node is not a swarm manager.</font>

  现在让我们运行这个应用，给它取名为`service_demo`:
  ```
  docker stack deploy -c docker-compose.yml service_demo
  ```

  这样，我们的单个服务栈(service stack)就运行了5个容器实例。让我们看看service相关的信息。

  ```
  docker service ls
  ```
  Look for outputs:
  {% asset_img docker_service_ls.png docker_service_ls%}

  服务的名称会加上我们的应用名称作为前缀，`web`服务的名字变为`service_demo_web`，在服务中运行的单个容器称为一个task,他的名字会根据replicas数目来递增，使用下面的命令来查看服务下的task信息
  ```
  docker service ps service_demo_web
  ```
  Look for outputs:
  {% asset_img docker_service_ps.png docker_service_ps %}
  
  接下来可以在浏览器中访问`http://localhost:4000`,多刷新几次，看看每次的HostName是否相同，如果不同的话，说明请求被均分到不同的task中处理呢。

- **拓展我们的应用**
  假设现在我们的服务不需要那么多task用来处理请求，那么我们就可以减少我们服务占用的资源，只需要在docker-compose.yml定义中减少我们的容器副本的数目，再次重新部署即可。减少replicas为2，重新部署服务后在看看
  ```
  # 重新部署
  docker stack deploy -c docker-compose.yml service_demo
  # 查看service中的task
  docker service ps service_demo_web
  ```

- **移除应用和集群**
  使用`docker stack rm`来移除我们的应用
  ```
  docker stack rm service_demo
  ```
  将我们最先init的swarm manager从集群中移除
  ```sh  
  docker swarm leave --force
  ```

- **命令回顾**
  ```sh
  # list stacks or apps
  docker stack ls
  # run the specified compose file
  docker stack deploy -c <composefile> <appname>
  # list running services associated with an app
  docker service ls
  # list tasks associated with the apps
  docker service ps <service>
  # inspect task or container
  docker inspect <task or container>
  # tear down an application
  docker stack rm <appname>
  # take down a single node swarm from the manager
  docker swarn leave --force
  ```
