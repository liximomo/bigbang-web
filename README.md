# bigbang-web
smartisan bigbang on the web! 

## 使用方式
将 [dist/main.js](https://github.com/liximomo/bigbang-web/tree/master/dist/main.js) 安装入 chrome 插件 tampermonkey 中即可

## 分词
分词服务使用的是[语言云（语言技术平台云LTP-Cloud）](www.ltp-cloud.com)的服务，完全没费，流量有限，并且各个地区的稳定性不一样，建议注册后用自己的 api_key 重新打包一下脚本。 

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
