String.prototype.format = String.prototype.f = function () {
  var s = this,
    i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};

var disqusProxyIsLoading = false;
// 尝试加载 disqus，不行就加载 disqus-proxy
function tryToLoadDisqus(loadDisqusProxy) {
  var disqusLoaded = false;
  var s = document.createElement('script');
  var shortname = window.disqusProxy.shortname;
  $('#disqus_thread').text('正在尝试加载 disqus ……');
  s.src = 'https://' + shortname + '.disqus.com/embed.js';
  s.async = true;
  s.setAttribute('data-timestamp', String(+new Date()));
  s.onload = function () { disqusLoaded = true };
  s.onerror = function () {
    loadDisqusProxy();
  };
  // 3秒内没加载embed.js 则认为无法访问disqus
  setTimeout(function () {
    if (!disqusLoaded) {
      loadDisqusProxy();
    }
  }, 3000)

  document.body.appendChild(s)
}

function loadDisqusProxy() {
  if (disqusProxyIsLoading) return;
  disqusProxyIsLoading = true;
  console.warn('disqus 加载失败，开始加载 disqus-proxy');
  $('#disqus_thread').remove();
  $('#disqus_proxy_thread').text('正在加载基础版 disqus ……');

  loadThread(function (res) {
    renderCommentBox(res.response[0].id);
    bingSubmitToCommentBox()
    loadComments(function (res) {
      renderComments(res);
    })
  })
}

function loadThread(cb) {
  var identifier = window.disqusProxy.identifier
  var query = 'identifier=' + encodeURIComponent(identifier)
  var url = '//' + window.disqusProxy.server + ':'
    + window.disqusProxy.port.toString() + '/api/getThreads'
  $.get(url + '?' + query, cb)
  // $.get('//localhost:3000/getThreads', cb)
}

function renderCommentBox(thread) {
  var commentBox = '\
    <div class="comment-box">\
      <form class="comment-box-form" method="post" action="">\
        <div class="row author-row">\
          <input type="text" style="display:none" name="thread" value="{0}"/>\
          <input type="text" required name="author_name" placeholder="请输入昵称"/>\
          <input type="email" required name="author_email" placeholder="请输入邮箱（不会公开显示）"/>\
        </div>\
        <div class="row message-row">\
          <textarea name="message" required rows="3" placeholder="在此处输入评论内容"></textarea>\
        </div>\
        <div class="action-row">\
          <span class="notification"></span>\
          <input type="submit" id="submit" value="发表" />\
        </div>\
      </form>\
    </div>'.format(thread);
  $('#disqus_proxy_thread').html(commentBox);
}

function bingSubmitToCommentBox() {
  var working = false;
  $('.comment-box-form').submit(function (e) {
    e.preventDefault();
    if (working) return false;
    working = true;
    $('#submit').val('提交中..');
    $('.notification').text('')
    var url = '//' + window.disqusProxy.server + ':'
      + window.disqusProxy.port.toString() + '/api/createComment';
    $.post(url, $(this).serialize(), 'json')
      .success(function (res) {
        working = false;
        $('#submit').val('发表');
        if (res.code === 0) {
          $('.notification').html('<span class="success">发表成功，请等待审核。</span>');
          $('input[name="author_name"]').val('');
          $('input[name="author_email"]').val('');
          $('textarea[name="message"]').val('');
        } else {
          $('.notification').html('<span class="error">发表失败</span>')
        }
      })
      .error(function (jqXHR, textStatus, errorThrown) {
        $('.notification').html('<span class="success">网络错误：' + errorThrown + '</span>');
      });
  });
}

function loadComments(cb) {
  var identifier = window.disqusProxy.identifier
  var query = 'identifier=' + encodeURIComponent(identifier)
  var url = '//' + window.disqusProxy.server + ':'
    + window.disqusProxy.port.toString() + '/api/getComments';
  $('#disqus_proxy_thread').append('<ul class="comment-list"><li>正在加载评论……</li></ul>');
  $.get(url + '?' + query)
    .success(function (res) {
      cb(res.response || []);
    })
    .error(function (jqXHR, textStatus, errorThrown) {
      $('.comment-list').html('<li>网络错误：' + errorThrown + '</li>');
    });
}

function renderComments(comments) {
  var topLevelComments = []
  var childComments = []

  comments.forEach(function (comment) {
    (comment.parent ? childComments : topLevelComments)['push'](comment)
  })

  var commentLists = topLevelComments.map(function (comment) {
    return {
      comment: comment,
      author: comment.author.name,
      isPrimary: comment.author.username === window.disqusProxy.username || comment.author.name.indexOf(window.disqusProxy.username) !== -1,
      children: getChildren(+comment.id)
    }
  })

  function getChildren(id) {
    if (childComments.length === 0) return null
    var list = []
    childComments.forEach(function (comment) {
      if (comment.parent === id) list.unshift({
        comment: comment,
        author: comment.author.name,
        isPrimary: comment.author.username === window.disqusProxy.username || comment.author.name.indexOf(window.disqusProxy.username) !== -1,
        children: getChildren(+comment.id)
      })
    })
    return list.length ? list : null
  }
  $('#disqus_proxy_thread > .comment-list').html(
    commentLists.map(function (props) {
      return '<li>{0}</li>'.format(renderComment(props));
    }).join('') || '<li>暂无评论，快来抢沙发！</li>'
  );
}

function getAvatar(author) {
  if (author.avatar.cache.indexOf('noavatar') === -1) {
    return author.avatar.cache;
  }
  function getColor(key) {
    var hash = 0;
    for (var i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return 'rgb({0}, {1}, {2})'.format(hash % 255, hash % 245, hash % 235);
  };
  return blockies.create({
    seed: author.name,
    color: getColor(author.name + 'color'),
    bgcolor: getColor(author.name + 'bgcolor'),
    spotcolor: getColor(author.name + 'spotcolor')
  }).toDataURL()
}

function renderComment(props) {
  var avatar = props.isPrimary ? window.disqusProxy.adminAvatar : getAvatar(props.comment.author);
  var name = props.comment.author.name;
  var admin = props.isPrimary ? '<span class="admin">Admin</span>' : '';
  var replyTo = props.replyTo ? '<span class="replyTo">{0}</span>'.format(props.replyTo) : '';
  var date = new Date(props.comment.createdAt).toLocaleString();
  var message = props.comment.message;
  var lis =
    props.children ?
      (
        props.children.map(function (discuss) {
          return '<li>{0}</li>'.format(renderComment({
            comment: discuss.comment,
            author: discuss.author,
            isPrimary: discuss.isPrimary,
            replyTo: props.author,
            children: discuss.children,
          }))
        }).join('')
      ) : '';
  var ul = props.children ? '<ul class="post-reply">{0}<ul>'.format(lis) : '';
  return '\
      <div class="comment-item">\
        <div class="comment-avatar"><img src={0} alt="avatar" /></div>\
        <div class="comment-content">\
          <div class="comment-header">\
            <span class="author-name">{1}</span>{2}{3}<span class="date">{4}</span>\
          </div>\
          <div class="comment-body">{5}</div>\
        </div>\
        {6}\
      </div>'.format(avatar, name, admin, replyTo, date, message, ul);
}

if (window.disqusProxy) { tryToLoadDisqus(loadDisqusProxy) };