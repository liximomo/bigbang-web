# bigbang-web
smartisan bigbang on the web! 

## 使用方式
将 [dist/main.js](https://github.com/liximomo/bigbang-web/tree/master/dist/main.js) 安装入 chrome 插件 tampermonkey 中即可

## 操作
### 简易模式:
长安 <kbd>cmd</kbd>, 如果当前 cursor 下只有一个文本元素，直接复制其内容，如果有多段文字 或 继续保持按压等待动画结束则进入完整模式

### 完整模式：
单击选词，右键单击 bigbang 分词，按住 <kbd>option</kbd> 不放弹出动作菜单, 移动选择(不需要点击，点击也没用)动做，松开 <kbd>option</kbd> 返回选词模式，松开 <kbd>cmd</kbd> 复制选择文本，执行动作

## 分词
没有免费的分词 api 可供使用，目前我自己利用 jieba 分词部署个服务在 goole app engine 上，国内无法访问，我自己的环境是可以访问墙外的所以可以访问，有分词需要的朋友请自行寻找替代方案。 

## 准备
```
  yarn
```

## development
```
  yarn start
```
浏览器打开 localhost:8080/bigbang-web/

## bundle
```
  yarn run build
```

## TODO
- [ ] node extractor (not only text)
- [ ] node render (diverse node view)
