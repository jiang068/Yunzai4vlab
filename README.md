# Yunzai4vlab
向USTC的vlab用户介绍如何搭建属于自己的云崽QQ机器人
# 如何搭建？
## 1、必需条件
用学号登录vlab.ustc.edu.cn，进入“虚拟机管理”——>“新虚拟机”创建一个虚拟机，建议选择Ubuntu22.04版本带桌面的，便于以后操作（大佬随意）。  
_（由于一人只能创建一台虚拟机，所以资源的使用请自己把握）_
## 2、搭建过程
### 1、做一些准备工作  
先更新一下  
    
    sudo apt update
安装node  

    sudo apt install apt-transport-https curl ca-certificates software-properties-common  
    curl -sL https://deb.nodesource.com/setup_18.12 | sudo -E bash -
    sudo apt-get install -y nodejs
查看版本号，检查是否安装成功  
    
    node -v
安装redis服务
    
    sudo apt install redis-server
查看服务状态，检查是否安装成功
    
    sudo systemctl status redis-server
新开一个控制台，安装npm
    
    sudo apt install npm
安装n
    
    sudo npm install -g n
查看版本号，检查是否安装成功    
    
    n -V
用n升级npm到18.12（不然后续会报错）
    
    sudo n 18.12
安装pnpm依赖
    
    sudo npm install pnpm -g
如果没有git要安装git（一般学校给的镜像是有的）
    
    sudo apt-get install git
查看版本号，检查是否安装成功
    
    git --version  
### 2、拉取Yunzai仓库
桌面右键打开控制台，从git仓库拉取喵—云崽主框架
    
    git clone --depth=1 https://github.com/yoimiya-kokomi/Miao-Yunzai.git
a)懒得在桌面下点击进入Miao-Yunzai目录的
    
    cd Miao-Yunzai
b)直接从桌面双击进入  
  
进入Miao-Yunzai文件夹后，右键打开控制台，安装喵喵插件（miao-plugin）
    
    git clone --depth=1 https://github.com/yoimiya-kokomi/miao-plugin.git ./plugins/miao-plugin/
安装依赖
    
    pnpm install -P
安装jdk
    
    sudo apt install openjdk-8-jdk
至此你已经安装完成了Yunzai能够运行起来的最基本的部分。
### 3、为了让Yunzai能够正常平稳运行，你还需要做以下这些：  
#### 1、拉取Qsign签名程序，避免发不出去消息以及QQ被封  
安装screen
    
    sudo apt install screen
拉取签名程序qsxm
    
    git clone https://gitee.com/summerwood6/qsxm.git
到qsxm目录下用控制台打开screen模式
    
    cd qsxm && screen -S qsxm
运行签名脚本
    
    sudo bash Qs.sh
爆代码之后复制框里的默认地址，举个例子，就像这样：
    
    http://0.0.0.0:25000/sign?key=qsxm
至此你已经完成QQ签名的搭建。  
#### 2、回到Miao-Yunzai目录，让她运行吧！  
开控制台 启动程序
    
    node app
输入用做机器人的QQ号码，回车选择扫码登录  
  
模式用上下箭头选择apad，此后该服务将以安卓平板的身份挂在这个服务器

配置签名时，用上面的默认签名，复制下来就好，比如
    
    http://0.0.0.0:25000/sign?key=qsxm
回车运行，登录成功！

### 4、可选插件（均需cd到Miao-Yunzai目录下）  
meme表情包脚本  
直接进入  
    
    https://github.com/ikechan8370/yunzai-meme/blob/main/meme.js
把里面的源码复制进一个新文件，命名为meme.js，将其放在Miao-Yunzai目录里面的任何位置就行。  

锅巴（可视化插件管理面板）
    
    git clone --depth=1 https://github.com/guoba-yunzai/guoba-plugin.git ./plugins/Guoba-Plugin/
    pnpm install --filter=guoba-plugin
梁氏（伤害计算更科学）
    
    git clone --depth=1 https://github.com/liangshi233/liangshi-calc.git ./plugins/liangshi-calc/
Atlas图鉴（提供攻略）
    
    git clone --depth=1 https://github.com/Nwflower/atlas ./plugins/Atlas/
安装好后最好#图鉴升级一下。  

戏天脚本管理
    
    git clone https://github.com/XiTianGame/xitian-plugin.git ./plugins/xitian-plugin/
安装好后最好#插件更新一下。  

猫猫状态
    
    git clone https://github.com/erzaozi/neko-status-plugin.git ./plugins/neko-status-plugin
    pnpm install --filter=neko-status-plugin
清凉图插件
    
    git clone --depth 1 https://github.com/xwy231321/ql-plugin.git ./plugins/ql-plugin/
    pnpm i
安装好后最好#清凉更新一下。

闲心mihoyo图
    
    git clone https://gitee.com/xianxincoder/xianxin-plugin.git ./plugins/xianxin-plugin/
    
鸢尾花表情包
    
    git clone --depth=1 https://github.com/logier/logier-plugins.git ./plugins/logier-plugin/

逍遥原神图鉴（Atlas_alias）
    
    git clone https://github.com/Ctrlcvs/xiaoyao-cvs-plugin.git ./plugins/xiaoyao-cvs-plugin/
安装好后最好#图鉴更新、#图鉴插件更新一下。

文案插件
    
    git clone --depth=1 https://gitee.com/white-night-fox/wenan-plugin.git ./plugins/wenan-plugin/
    
### 5、如何自己编写插件  
https://github.com/takayama-lily/oicq
