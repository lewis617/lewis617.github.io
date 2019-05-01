---
title: 自定义 Jinja2 过滤器
date: 2016-02-07 03:31:00
tags: [Jinja2, Flask]
---

今天，我们要讲的是自定义Jinja2 过滤器这个知识点，因为官方文档对此一代而过，讲得不够清楚，所以我们专门拿出来讲一下。

<!--more-->

# 例子

例子写了两个自定义过滤器，一个是转换字典到字符串的过滤器，一个是返回当前参数的类型的过滤器。

源代码：

[https://github.com/lewis617/myflask/tree/master/jinja2-filter](https://github.com/lewis617/myflask/tree/master/jinja2-filter)

# 过滤器是个函数

过滤器是个函数，跟Angular的过滤器几乎一模一样。参数就是管道（pipe）前面那个变量。比如   `123|myfilter`，`123`就是`myFilter`的参数。如果需要两个参数，则在`myFilter`后面加`（）`，即`123|myFilter(234)`。

# 过滤器函数写在哪

这是这个是编写过滤器的关键。过滤器函数写在`app.run`前，注册在`app.jinja_env.filters`中，这是什么意思？看代码：

```python
app = Flask(__name__) # custom filter # convert dict to string
def json_dumps(dict):
        result = json.dumps(dict) return result # return type of arg
def typeFilter(arg):
        result = type(arg) return result

env = app.jinja_env
env.filters['json_dumps'] = json_dumps
env.filters['typeFilter'] = typeFilter
```

1.  实例化一个Flask对象`app`
2.  编写两个函数
3.  将函数挂在`app.jinja_env.filters`上

就是这么简单！

# 测试示例代码

第一个过滤器转换字典到字符串，第二个返回当前参数的类型

我们在index.html中编写：

```html
<body> 
dict is {{ dict|typeFilter}} <hr> 
dict | json_dumps is{{ dict|json_dumps |typeFilter}} <hr> 
you can use json_dumps filter to send dict to js,remember to add safe filter,<br> press f12 to test it 
</body>
<script>
    //you can use json_dumps filter to send dict to js,remember to add safe filter
 console.log({{ dict |json_dumps|safe}}) 
</script>
```

然后在app.py中渲染这个html

```python
@app.route('/')
def hello_world():
    dict={'name':'lewis','age':24} return render_template('index.html',dict=dict) if __name__ == '__main__':
    app.run()
```

结果：

![](https://ws1.sinaimg.cn/mw690/83900b4egw1f9yh3fdydqj20g408ojsr.jpg)

`json_dumps`可以将dict转为字符串，这样我们用Jinja渲染的对象列表之类的就可以，以字符串的形式打印出来，便于我们在开发环境下监视渲染状态。
