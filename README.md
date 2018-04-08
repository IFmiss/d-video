
# Dvideo.js
基于原生js的 video 插件  Dvideo

![](https://img.shields.io/badge/javascript-4EDD96.svg)

QQ交流群： 424418160

支持音量  语速  清晰度 ie全屏等一系列操作  兼容IE 9 + 

#### 项目运行
✅ clone 项目之后在项目根目录执行 
安装依赖：
<pre>
npm install
<pre>
⚠️ 注意： 由于webpack使用的是4.0以上的版本，extract-text-webpack-plugin在安装时需要单独执行  npm install extract-text-webpack-plugin @next  来安装
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

### DEMO  http://www.daiwei.org/components/Dvideo
