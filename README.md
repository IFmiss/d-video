
# Dvideo.js
基于原生js的 video 插件  Dvideo

![](https://img.shields.io/badge/javascript-4EDD96.svg)


支持音量  语速  清晰度 ie全屏等一系列操作  兼容IE 9 + 


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
