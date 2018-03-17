import Dvideo from 'script/Dvideo.js'
var video = new Dvideo({
	width: '680px',
	height: '360px',
	nextVideoExtend: function () {
		alert('你点击了下一个视频');
	},
	setVideoDefinition: function (type, ele, currentT) {
		alert(`类型：${type}, ---- 事件：${ele}, ----- 当前时间：${currentT}`)
	}
})

var _btns = document.querySelectorAll('.btn')
_btns.forEach((item, index) => {
	item.onclick = () => {
		switch (index){
			case 0: 
				const videoWrap = document.getElementById('video')
				// 全屏
				video.launchFullScreen(videoWrap)
				break
			case 1: 
				// 播放
				video.videoPlay()
				break
			case 2: 
				// 暂停
				video.videoPause()
				break
			case 3: 
				// 播放暂停
				video.videoPlayPause()
				break
			case 4: 
				// 更新音量1
				video.updateVolume(1)
				break
			case 5: 
				// 更新音量0.3
				video.updateVolume(0.3)
				break
			case 6: 
				// 2.0语速
				video.setPlayBackRate(3)
				break
			case 7: 
				// 原来的语速
				video.setPlayBackRate(1)
				break
			case 8: 
				// 倒退10秒
				video.videoRewind(10)
				break
			case 9: 
				// 快进10秒
				video.videoForward(10)
				break
			case 10: 
				// 显示提示进度
				video.showLoading(true, 'hihihi，你好呀！！！')
				break
			case 11: 
				// 关闭提示进度
				video.showLoading(false)
				break
			case 12: 
				// 显示上下菜单且不自动关闭
				video.showTopBottomCtrl()
				break
			case 13: 
				// 立刻关闭上下菜单
				video.hideTopBottomCtrl(true)
				break
			case 14: 
				// 显示菜单自动关闭
				video.showTopBottomCtrl(true)
				break
			case 15: 
				// 固定时间后自动关闭
				video.hideTopBottomCtrl()
				break
			case 16: 
				// 设置宽720 高480
				video.updateVideoSize(720,480)
				break
		} 
	}
})
