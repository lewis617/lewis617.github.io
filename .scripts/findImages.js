const fs = require('fs');
const path = require('path');
const download = require('./download');

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '/' + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

const files = getFiles(path.join(__dirname, '../themes'));
const urls = files.reduce((last, file) => {
  const curUrls = fs.readFileSync(file, 'utf-8').toString().match(/http(.+).sinaimg.cn(.+)(jpg|gif)/g);
  if (!curUrls) { return last; }
  return [...last, ...curUrls];
}, []);

const map = {};
urls.forEach((url, i) => {
  const ext = url.match(/(gif|jpg|png)/g) ? url.match(/(gif|jpg|png)/g)[0]: 'jpg';
  const fileName = new Date().getTime() + '-' + i + '.' + ext;
  download(url.replace('https', 'http'), 'themes/landscape/source/css/images/' + fileName , console.log(url, '下载完成'));
  map[url] = fileName;
});

files.forEach((file) => {
  for (url in map) {
    const content = fs.readFileSync(file, 'utf-8').toString();
    if (content.includes(url)) {
      console.log('在', file, '找到图片 URL，正在处理……')
      const newContent = content.replace(url, '/css/images/' + map[url]);
      fs.writeFileSync(file, newContent);
      console.log(file, '处理完成');
    }
  }
});
