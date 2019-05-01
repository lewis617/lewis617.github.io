---
title: 使用nginx解决跨域问题（flask为例）
date: 2015-12-18 03:56:00
tags: [nginx, 跨域, Flask]
---

## 背景

我们单位的架构是在api和js之间架构一个中间层（python编写），以实现后端渲染，登录状态判定，跨域转发api等功能。但是这样一个中间会使前端工程师的工作量乘上两倍，原本js可以直接ajax请求api，但是我们不得不ajax请求中间层，中间层再请求api。如图：

<!--more-->

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3lfuw3j20iq08caag.jpg)

为了少敲代码，提高工作效率，我们当然希望将python中间层砍掉，但是如何解决以下三个问题，成为关键：

1.  后端渲染
2.  登录状态判定
3.  跨域转发api

关于1，2我会在另外两篇博客中详细叙述，这篇文章主要解决3，也就是跨域问题。解决跨域问题方法很多：反向代理，jsonp，Cross-Origin Resource Sharing等，我们今天通过nginx反向代理实现。

## 新建两个flask程序来实验

打开pycharm，新建项目选择flask，name分别设为client和server。

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3n0udyj203d042mx6.jpg)

编写client和server的python文件，使其分别跑在5000端口和5001端口：

client.py

```python
from flask import Flask

app = Flask(__name__)

@app.route('/') def hello_world(): return 'this is client'

if __name__ == '__main__':
    app.run(port=5000)
```

 server.py

```
from flask import Flask

app = Flask(__name__)

@app.route('/') def hello_world(): return 'this is server' @app.route('/api/') def api(): return 'api'

if __name__ == '__main__':
    app.run(port=5001)
```

运行client.py

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3lootcj205902it8m.jpg)

运行server.py

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3misioj204s027glh.jpg)

## 安装nginx（ubuntu）

打开新立得，搜索nginx，选中并安装。ubuntu就是这么简单，其他平台暂不叙述，可自行搜索。

## 配置nginx，使其将5000端口（客户端）的请求转发到5001端口（服务器端）

打开nginx默认的配置文件：

```sh
sudo gedit /etc/nginx/sites-available/default
```

在文件末尾添加如下命令：

```test
## demo listen 5017 proxy 5000 and 5001 ##
server {
    listen 5017; 
    server_name a.xxx.com;
    access_log /var/log/nginx/a.access.log;
    error_log /var/log/nginx/a.error.log;
    root html;
    index index.html index.htm index.php;

    ## send request back to flask ##
    location / {
        proxy_pass  http://127.0.0.1:5000/ ; 
 #Proxy Settings
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
        proxy_read_timeout 90;
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;

   }
    location /proxy {
        rewrite ^.+proxy/?(.*)$ /$1 break;
        proxy_pass  http://127.0.0.1:5001/ ; 
 #Proxy Settings
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_max_temp_file_size 0;
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
        proxy_read_timeout 90;
        proxy_buffer_size 4k;
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;

   }

}

## End a.xxx.com ##
```

运行nginx:

```sh
sudo /etc/init.d/nginx restart 
```

这些命令使得localhost:5017代理了localhost:5000，如图：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3mwml4j204s02ajra.jpg)

使得localhost:5017/proxy代理了localhost:5001，如图：

![](https://ws2.sinaimg.cn/mw690/83900b4egw1f9yh3ngv9zj2064025747.jpg)

使得localhost:5017/proxy/api/代理了localhost:5001/api/，如图：

![](https://ws3.sinaimg.cn/mw690/83900b4egw1f9yh3npj0jj207402hq2t.jpg)

如此以来，原本需要从5000端口请求5001端口的url，变成了从5017端口请求5017端口的/proxy。解决了同源策略带来的跨域问题。

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3o1j2dj20iq08cdgp.jpg)

这个配置文件也可以和uwsgi配合起来用，也可以不用uwsgi，直接运行python文件启动服务，本文便是后一种。