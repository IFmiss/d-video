
# d-video
基于原生js的 video 插件  d-video

![](https://img.shields.io/badge/javascript-4EDD96.svg)

QQ交流群： 424418160

支持音量  语速  清晰度 ie全屏等一系列操作  兼容IE 9 + 

#### 项目运行
✅ clone 项目之后在项目根目录执行 
安装依赖：

<pre>
  npm install
</pre>

⚠️ 注意： 由于webpack使用的是4.0以上的版本，extract-text-webpack-plugin在安装时需要单独执行，Vue下需要配置scss的sass-loader  安装sass-loader和node-sass
<pre>
  npm install extract-text-webpack-plugin@next
</pre>
来安装
否则项目安装之后执行 npm run dev 会报错
开启服务：

<pre>
npm run dev
</pre>

编译版本

<pre>
  npm run build
</pre>

原先的es5版本也会同时更新  后续会放在这个项目单独的文件下

#### 初始化
<pre>
var video = new Dvideo ({
	ele: '#testVideo',
	title: 'Pneumatic Tokyo - EnV',
	nextVideoExtend: function () {
		alert('您点击了下一页')
	},
	showNext: true,
	width: '580px',
	height: '292px',
	src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',
	autoplay: true,
	setVideoDefinition: function (type, e, current) {
		if (type === '0') {
			alert('你点击了标清')
			// video.setVideoInfo('這是標清','这里填写视频的标清地址',current)
		}
		if (type === '1') {
			alert('你点击了标清')
			// video.setVideoInfo('這是標清','这里填写视频的高清地址',current)
		}
		if (type === '2') {
			alert('你点击了标清')
			// video.setVideoInfo('這是標清','这里填写视频的超清地址',current)
		}
		video.showLoading(false)

		// setTimeout(function () {
		// 	video.videoEle.currentTime = current
		// 	video.videoPlay()
		// 	video.showLoading(false)
		// }, 3000)
	},
})
</pre>


### 在苹果本地跑dvideo会提示操作localStorage不安全的错误，放在服务端就不存在这个问题了

## 实例化
实例化Dvideo对象
```js
	var video = new Dvideo({...})
```

#### 属性
- ele: dom 元素， 元素id需要带 # ， 比如 #video  或者 .video
- src: 视频地址 string
- isShowPoster: 是否显示封面，默认为true   bool
- poster: 封面的地址  string
- title: 视频的名称   string
- width: 视频显示宽度  string   '300px'
- height: 视频显示高度   string    '160px'
- showNext: 是否显示下一集按钮   bool   默认true
- autoplay: 是否自动播放   bool   默认true
- ctrSpeedDuration:  控制条 关闭的时间  number (ms)
- loop: 视频是否循环播放   bool  默认false
- showVolume: 是否显示音量设置  bool  默认true
- volume: 音量大小  number  0.8
- showVolumeUnFull: 在非全屏幕下是否显示音量调整条   bool  默认false
- showPlayBackRate: 是否显示设置语速菜单列表   bool   默认true
- showPlayBackRateUnFull: 是否在未全屏的情况下 显示语速   bool  默认true
- playbackRate: 语速的设置  object
	- activeIndex: 索引  number
	- rateList: 语速  array   [0.8, 1, 1.2, 2]
- showVideoDefinition: 是否显示清晰度  bool  默认true
- showVideoDefinitionUnFull: 非全屏的状态下是否显示   bool   默认true
- videoDefinition: 清晰度的设置  object
	- activeIndex: 索引  number
	- definitionList: 清晰度选项  array
		- type: 类型
		- name: 名称
- nextVideoExtend: function    可让用户自定义扩展   点击下一个视频的操作
- setVideoDefinition: function   设置清晰度的回调  参数  (type, event, currentT)
- onTimeupdate: 进度更新事件  参数（currentT)
- onPlaying: 视频播放事件  参数（currentT)
- onPause: 视频暂停事件
- onEnded: 视频播放结束事件
- onLoadedMetaData: 元数据加载成功事件

#### 方法
- 更新视频宽度
```js
video.updateVideoSize()
@param { number }  width   宽度
@param { number }  height   高度
```

- 显示上下菜单
```js
video.showTopBottomCtrl()
@param { bool }  disappearance   是否自动消失
```

- 关闭上下菜单
```js
video.hideTopBottomCtrl()
@param { bool }  immediately   是否立刻关闭
```

- 更新音量
```js
video.updateVolume()
@param { number }  vol   音量大小  0 - 1 之间
```

- 更新音量
```js
video.updateVolume()
@param { number }  vol   音量大小  0 - 1 之间
```

- 快进
```js
video.videoForward()
@param { number } seconds  快进时长
```

- 快退
```js
video.videoRewind()
@param { number } seconds  快退时长
```

- 跳转到具体位置
```js
video.videoSeek()
@param { number } seconds  跳转的位置
```



### DEMO1  http://www.daiwei.org/components/Dvideo

