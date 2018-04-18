import './../scss/Dvideo.scss'
import './../../static/font-icon/style.css'
class Dvideo {
	constructor (template) {
		let defaultOptions = {
			// video元素
			ele: '#video',

			// 地址
			src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',

			// -----   封面
			// 是否显示封面
			isShowPoster: true,
			// 封面的地址
			poster: 'http://www.daiwei.org/vue/image/17-07-07/IMG_0330.jpg',


			// video的名称
			title: 'Hi EveryOne...',
			
			// video的宽度
			width: '420px',
			// video的高度
			height: '250px',

			// 是否显示下一个 按钮
			showNext: true,

			// 是否自动播放
			autoplay: true,

			// 控制条 关闭的时间
			ctrSpeedDuration: 3000,

			// 视频是否循环
			loop: false,


			// ------  音量
			// 是否显示音量
			showVolume: true,
			// 音量大小
			volume: 0.8,
			// 在非全屏幕下是否显示音量调整条
			showVolumeUnFull: false,


			// ------  语速
			// 是否显示设置语速菜单列表
			showPlayBackRate: true,
			// 是否在未全屏的情况下 显示语速
			showPlayBackRateUnFull: true,
			// 语速的设置
			playbackRate: {
				// 索引
				activeIndex: 1,
				// 选项
				rateList: [0.8,1,1.5,2]
			},


			// ------ 清晰度
			// 是否显示清晰度
			showVideoDefinition: true,
			// 是否在未全屏幕的情况下 显示清晰度
			showVideoDefinitionUnFull: true,
			// 清晰度信息
			videoDefinition: {
				// 索引
				activeIndex: 1,
				// 选项
				definitionList: [
					{
						// 类型  字符串标识
						type: '0',
						// 类型  展示效果标识
						name: '标清'
					},
					{
						type: '1',
						name: '高清'
					},
					{
						type: '2',
						name: '超清'
					}
				]
			},

			// ================ 暴露的方法
			// 可让用户自定义扩展   点击下一个视频的操作
			nextVideoExtend: () => {},
			// 设置清晰度的操作
			setVideoDefinition: (type, event, currentT) => {},
			// 暴露的视频time更新事件
			onTimeupdate: (currentT) => {},
			// 暴露的视频Playing事件
			onPlaying: (currentT) => {},
			// 暴露的视频暂停事件
			onPause: () => {},
			// 暴露的视频结束事件（loop 不会执行end 事件）
			onEnded: () => {},
			// 暴露视频初始化事件 元数据加载成功事件
			onLoadedMetaData: () => {},
		}

		this.opt = Object.assign(defaultOptions, template)
		// ================= 以下为私有自定义方法
		// 全屏的状态信息
		this.isFull = false

		// 是否已经加载初始化元数据
		this.isLoadMate = false

		// 设置播放的状态
		this.isPlaying = false

		// 设置视频时长
		this.durationT = 0

		// 当前的播放时间
		this.currentT = 0

		// 这是鼠标移入显示控制菜单的timeout		
		this.showCtrlT = ''

		// 进度百分比
		this.currentP = 0

		// 进度条是否可拖动
		this.isDrag = false

		// 快进快退事件
		this.onPress = false

		// 进度条的宽度
		this.maxProgressWidth = 0

		// 进度条拖动的位置
		this.dragProgressTo = 0
		
		// 音量大小
		this.volume = 1

		// 音量最大宽度
		this.maxVolumeWidth = 0

		// 音量拖动的位置
		this.dragVolumeTo = 0

		// 获取浏览器版本
		this.browserV = this.browserVersion()

		// 通过时间戳与当前时间的差值来判断是否需要加载
		this.reduceTBefore = 0   // 时间戳与当前时间的差值 (初始化)
		this.reduceTAfter = 0   // 时间戳与当前时间的差值 (执行中)

        this.isPlaying = this.autoplay
        // 判断传进来的是DOM还是字符串
        if ((typeof this.opt.ele) === "string") {
            this.opt.ele = document.querySelector(this.opt.ele)
        }else{  
            this.opt.ele = this.opt.ele
        }

        // 初始化
        this.initDom()
        // 显示菜单信息
        this.showTopBottomCtrl(true)
	}

	initDom() {
		this.opt.ele.style.width = this.opt.width
		this.opt.ele.style.height = this.opt.height

		// 创建组件的content区域
		this.createVideoC()

		// 创建Video
		this.createVideoEle()

		// 创建头部菜单信息
		this.createHeaderC()

		// 创建控制菜单
		this.createCtrlC()

		// 显示提示信息
		this.createVideoTips()

		// 音乐播放暂停  下一集
		this.createvideoPlayState()

		// 进度条
		this.createPcProgress()

		// 创建current / duration  时间显示
		this.createCurrentDurationText()

		// 菜单栏右侧信息
		this.menuRightC = document.createElement('div')
		this.menuRightC.className = 'Dvideo-menu-right-content'
		this.videoCtrlDetail.appendChild(this.menuRightC)

		// 音量拖动效果
		if (this.opt.showVolume) {
			this.createVolume()
		}

		// 语速选项的列表
		if (this.opt.showPlayBackRate) {
			this.createPlaybackRateList()
		}


		// 设置清晰度区域
		if (this.opt.showVideoDefinition) {
			this.createVideoDefinition()
		}


		// 全屏按钮
		this.createSelectVideoFull()

		// 初始化事件
		this.initEvent()
	}

	// 开启全屏
	launchFullScreen (element) {
		if((/IE9|IE10/i).test(this.browserV)) {
			this.launchFullScreenIE11L();
		} else {
			// alert(screenChange)
			if (element.requestFullscreen) {
				element.requestFullscreen()
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen()
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen()
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen()
			}
			this.launchFullScreenStyle(element)
		}
		this.updateFullScreenState(true)
	}

	// 全屏下视频的样式
	launchFullScreenStyle () {
		this.opt.ele.style.width = '100%'
		this.opt.ele.style.height = '100%'
	}

	// 全屏下IE 11 以下视频的样式
	launchFullScreenIE11L () {
		let cName = this.opt.ele.className
		this.opt.ele.className = cName + ' ie-fullscreen'
	}
	// 关闭全屏
	exitFullscreen () {
		if((/IE9|IE10/i).test(this.browserV)) {
			// this.isFull = true
			this.exitFullscreenIE11L();
		} else {
			// this.exitFullScreenStyle()
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		}
	}

	// 关闭全屏IE 10及以下
	exitFullscreenIE11L () {
		this.updateFullScreenState(false)
		let cName = this.opt.ele.className
		this.opt.ele.className = cName.split(' ').slice(cName.split(' ').indexOf('ie-fullscreen'), 1)
		this.opt.ele.style.width = this.opt.width
		this.opt.ele.style.height = this.opt.height
	}

	// 关闭全屏的元素样式
	exitFullScreenStyle () {
		this.updateFullScreenState(false)
		this.opt.ele.style.width = this.opt.width
		this.opt.ele.style.height = this.opt.height
	}

	// 更新视频宽度
	updateVideoSize (width, height) {
		if (!(width && height)) {
			throw Error ('noneeleerror','请填写信息')
			return;
		}
		this.updateFullScreenState(false)
		this.opt.ele.style.width = width + 'px'
		this.opt.ele.style.height = height + 'px'
		this.opt.width = width + 'px'
		this.opt.height = height + 'px'
	}

	// 更新全屏状态  包括显示全屏图标样式    
	updateFullScreenState (bool) {
		this.isFull = bool || false
		// 全屏图标样式
		let iconClassName = this.isFull ? 'Dvideo-menu-fullscreenConfig icon-canclefullscreen' : 'Dvideo-menu-fullscreenConfig icon-fullscreen'
		// 文案
		let title = this.isFull ? '取消全屏' : '全屏'
		this.fullscreenConfig.className = iconClassName
		this.fullscreenConfig.title = title
		// 设置页面是否全屏的class
		let videoClassName = this.isFull ? 'Dvideo-content full' : 'Dvideo-content'
		this.videoC.className = videoClassName
	}

	// 屏幕全屏模式改变事件  包括ie 11 以下
	screenChangeEvent (element) {
		let _this = this
		if((/IE11/i).test(this.browserV)) {
			document.onkeydown = function (e) {
				let keyNum = window.event ? e.keyCode : e.which
				if (keyNum === 27 && _this.isFull) {
					// ie退出全屏   这里针对的是IE11
					_this.exitFullScreenStyle()
				}
			}
		}
		else if ((/IE9|IE10/i).test(this.browserV)) {
			document.onkeydown = function (e) {
				let keyNum = window.event ? e.keyCode : e.which
				if (keyNum === 27 && _this.isFull) {
					// ie退出全屏   这里针对的是IE10  9
					_this.exitFullscreenIE11L()
				}
			}
		}
		else {
			let eventList = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'msfullscreenchange']
			for(let i = 0; i < eventList.length; i++) {
				document.addEventListener(eventList[i], function () {
					// 全屏显示的网页元素
					let fullscreenElement  = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement

					// 判断网页是否处于全屏状态下
					let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen

					if (fullscreenElement) {
						console.log('全屏')
						_this.launchFullScreenStyle(_this.opt.ele);
					} else {
						console.log('不是全屏')
						_this.exitFullScreenStyle()
					}
				})
			}
		}
	}

	browserVersion () {
		let userAgent = navigator.userAgent,     
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,     
			rFirefox = /(firefox)\/([\w.]+)/,     
			rOpera = /(opera).+version\/([\w.]+)/,     
			rChrome = /(chrome)\/([\w.]+)/,     
			rSafari = /version\/([\w.]+).*(safari)/;    
		let browser;    
		let version;    
		let ua = userAgent.toLowerCase();    
		function uaMatch(ua){    
			let match = rMsie.exec(ua);    
			if(match != null){    
				return { browser : "IE", version : match[2] || "0" };    
			}    
			match = rFirefox.exec(ua);    
				if (match != null) {    
				return { browser : match[1] || "", version : match[2] || "0" };    
			}    
			match = rOpera.exec(ua);    
				if (match != null) {    
				return { browser : match[1] || "", version : match[2] || "0" };    
			}    
			match = rChrome.exec(ua);    
				if (match != null) {    
				return { browser : match[1] || "", version : match[2] || "0" };    
			}    
			match = rSafari.exec(ua);    
				if (match != null) {    
				return { browser : match[2] || "", version : match[1] || "0" };    
			}    
			if (match != null) {    
				return { browser : "", version : "0" };    
			}    
		}    
		let browserMatch = uaMatch(userAgent.toLowerCase());
		if (browserMatch.browser){
			browser = browserMatch.browser;
			version = browserMatch.version;
		}
		return browser + version
	}

	// 显示上下菜单     disappearance 是否自动消失
	showTopBottomCtrl (disappearance) {
		clearTimeout(this.showCtrlT)
		this.videoCtrl.className = 'Dvideo-ctrl active'
		this.videoHeader.className = 'Dvideo-header active'
		if (disappearance) {
			this.hideTopBottomCtrl()
		}
	}

	// 关闭上下菜单    immediately 是否立刻关闭
	hideTopBottomCtrl (immediately) {
		clearTimeout(this.showCtrlT)
		let _this = this
		if (immediately) {
			this.videoCtrl.className = 'Dvideo-ctrl'
			this.videoHeader.className = 'Dvideo-header'
			this.hideProgressRange()
		} else {
			// 隐藏控制栏
			this.showCtrlT = setTimeout(function () {
				_this.videoCtrl.className = 'Dvideo-ctrl'
				_this.videoHeader.className = 'Dvideo-header'
				_this.hideProgressRange()
			}, _this.opt.ctrSpeedDuration)
		}
	}

	// 显示隐藏进度条小球
	showProgressRange () {
		this.videoProressC.className = 'Dvideo-progress-content active'
	}

	hideProgressRange () {
		this.videoProressC.className = 'Dvideo-progress-content'
	}

	videoPlay () {
		try{
			this.videoEle.play();
			this.isPlaying = true
		} catch (e) {
			console.log(e)
		}
	}

	videoPause () {
		try{
			this.videoEle.pause();
			this.isPlaying = false
			console.log(this.isPlaying + '222222')
		} catch (e) {
			console.log(e)
		}
	}

	videoPlayPause () {
		if (this.isPlaying) {
			this.videoPause();
		} else {
			this.videoPlay();
		}
	}

	showLoading (bool, text = '视频加载中,请稍等  或者切换稍低的清晰度') {
		if (bool) {
			this.tipsInfo.innerText = text
			this.tipsInfo.className = 'Dvideo-tips-info'
		} else {
			this.tipsInfo.className = 'Dvideo-tips-info hide'
		}
	}

	// 快退   参数 退多少秒
	videoForward(seconds) {
		if (this.videoEle.currentTime) {
			this.currentT = this.currentT + 10 > this.durationT ? this.durationT : this.currentT + 10
			this.videoEle.currentTime = this.currentT
			this.updatePorgress()
		}
	}

	videoRewind (seconds) {
		if (this.videoEle.currentTime) {
			this.currentT = this.currentT - 10 < 0 ? 0 : this.currentT - 10
			this.videoEle.currentTime = this.currentT
			this.updatePorgress()
		}
	}


	// 音乐初始化事件
	initEvent () {
		let _this = this

		// if (_this.browserV.indexOf('IE') >= 0) {}

		// 键盘事件  (ie 没有ctrl键)
		document.onkeydown = function (event) {
			let e = event || window.event
			if ((e.keyCode || e.which || e.charCode) === 32) {   // 空格 暂停
				// console.log(e.ctrlKey + '------' + (e.keyCode || e.which || e.charCode))
				e.stopPropagation();
				e.preventDefault();
				_this.videoPlayPause()
			}
			if ((e.keyCode || e.which || e.charCode) === 39) { 	// -->   快进
				e.stopPropagation();
				e.preventDefault();
				_this.showTopBottomCtrl()
				_this.videoForward(10)
			}
			if ((e.keyCode || e.which || e.charCode) === 37) { 	// <--	 快退
				e.stopPropagation();
				e.preventDefault();
				_this.showTopBottomCtrl()
				_this.videoRewind(10)
			}

			if ((e.keyCode || e.which || e.charCode) === 38) { 	// up  音量增加
				e.stopPropagation();
				e.preventDefault();
				_this.showTopBottomCtrl()
				_this.volume = _this.volume * 1 + 0.02 > 1 ? 1 : _this.volume * 1 + 0.02
				_this.setVolume()
			}

			if ((e.keyCode || e.which || e.charCode) === 40) { 	// down	 音量降低
				e.stopPropagation();
				e.preventDefault();
				_this.showTopBottomCtrl()
				_this.volume = _this.volume * 1 - 0.02 < 0 ? 0 : _this.volume * 1 - 0.02
				_this.setVolume()
			}
			}
		
		// 添加监听是否改变窗口大小事件
		_this.screenChangeEvent()
	}

	// playIng事件
	onPlaying () {
		this.opt.onPlaying(this.currentT)
	}

	onPause () {
		this.opt.onPause()
	}

	onLoadedMetaData () {
		this.opt.onLoadedMetaData()
	}

	onTimeupdate () {
		this.opt.onTimeupdate(this.currentT)
	}

	onEnded () {
		this.opt.onEnded()
	}

	// 格式化时间
	formartTime (seconds) {
		let formatNumber = function (n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
        let m = Math.floor(seconds / 60);
        let s = Math.floor(seconds % 60);
        return formatNumber(m) + ":" + formatNumber(s);
	}

	setVideoDefinition (e) {
		// 显示提示信息
		this.showLoading(true, '视频清晰度切换中，请稍等')

		// 获取索引 以及清晰度类型
		let index = e.target.getAttribute('data-index')
		let type = e.target.getAttribute('data-type')

		this.currentT = this.videoEle.currentTime
		
		// this.videoEle.currentTime = this.currentT
		// this.videoPlay()

		this.opt.videoDefinition = {
			activeIndex: index,
			definitionList: this.opt.videoDefinition.definitionList
		}

		// 文本显示
		this.videoDefinitionText.title = this.opt.videoDefinition.definitionList[index].name
		this.videoDefinitionText.innerText = this.opt.videoDefinition.definitionList[index].name
		// 存储至本地
		this.setLStorage('D-videoDefinition', JSON.stringify(this.opt.videoDefinition))

		// 设置列表active状态
		this.getDomByClass('Dvideo-definition-list active')[0].className = 'Dvideo-definition-list'
		e.target.className = 'Dvideo-definition-list active'
		this.videoDefinitionC.style.display = 'none'


		this.opt.setVideoDefinition(type, e, this.currentT)
	}

	setVideoInfo(title, url, currentT) {
		let _this = this	
		this.isLoadMate = false
		this.isPlaying = false
		// 地址		
			this.videoEle.src = url || '',		
			// title		
			this.videoHeaderTitle.innerText = title || '这是一个title'		
			this.videoHeaderTitle.title = title || '这是一个title'		
					
			let loadProPlay = function () {
				if (_this.isLoadMate) {
					clearInterval(loadTime)
					_this.videoEle.currentTime = currentT || 0
				}
				_this.videoPlay();
			}

			// 是否有currentT		
			let loadTime = setInterval(function () {
				loadProPlay(); 
			}, 500)

		}

	setPlayBackRate (index) {
		this.playbackR = this.opt.playbackRate.rateList[index]
		this.videoEle.playbackRate = this.playbackR
		this.playbackRateText.title = this.playbackR.toFixed(1) + ' x'
		this.playbackRateText.innerText = this.playbackR.toFixed(1) + ' x'


		this.opt.playbackRate = {
			activeIndex: index,
			rateList: this.opt.playbackRate.rateList
		}
		// 存储至本地
		this.setLStorage('D-playbackRate', JSON.stringify(this.opt.playbackRate))

		// 设置列表active状态
		this.getDomByClass('Dvideo-playbackRate-list active')[0].className = 'Dvideo-playbackRate-list'
		this.getDomByClass('Dvideo-playbackRate-list')[index].className = 'Dvideo-playbackRate-list active'
		this.playbackRateC.style.display = 'none'
	}

	// 更新进度条位置
	updatePorgress (isDrag = false) {
		if (isDrag) {
			this.circleRange.style.left = this.dragProgressTo + 'px'
			this.realProress.style.width = this.dragProgressTo + 'px'
			let currentTime = Math.floor(this.dragProgressTo / this.maxProgressWidth * this.durationT)
			this.textCurrentT.innerText = this.formartTime(currentTime)
		} else {
			this.currentP = Number((this.currentT / this.durationT) * 100)
			this.currentP = this.currentP > 100 ? 100 : this.currentP
			this.realProress.style.width = this.currentP + '%'
			this.circleRange.style.left = this.currentP + '%'
			// 更改时间进度
			this.textCurrentT.innerText = this.formartTime(this.videoEle.currentTime)
		}
	}

	// 下一集的点击事件
	nextVideo () {
		console.log('你点击了播放下一集   可使用实例化的对象调用nextVideo 方法实现播放下一集的效果')
		if (typeof this.opt.nextVideoExtend === 'function') this.opt.nextVideoExtend()
	}

	// 设置音量大小
	setVolume () {
		// this.videoEle.volume = this.volume
		let persent = this.volume / 1
		this.updateVolume(persent)
	}

	// 创建PlaybackRateList
	createPlaybackRateList () {
		let showVClassName = this.opt.showPlayBackRateUnFull ? '' : 'none'
		let oFragment = document.createDocumentFragment();
		// 语速数据
		let playbackrateData = this.hasLStorage('D-playbackRate') ? JSON.parse(this.getLStorage('D-playbackRate')) : this.opt.playbackRate

		// 当前active索引
		let playbackrateIndex = Number(playbackrateData.activeIndex)

		// 当前语速
		let playbackR = Number(playbackrateData.rateList[playbackrateIndex])


		// 设置语速区域
		this.playbackRate = document.createElement('span')
		this.playbackRate.className = 'Dvideo-playbackRate ' + showVClassName
		this.menuRightC.appendChild(this.playbackRate)

		// 显示语速文本
		this.playbackRateText = document.createElement('span')
		this.playbackRateText.className = 'Dvideo-playbackRateText'
		this.videoEle.playbackRate = playbackR
		this.playbackRateText.title = playbackR.toFixed(1) + ' x'
		this.playbackRateText.innerText = playbackR.toFixed(1) + ' x'
		this.playbackRate.appendChild(this.playbackRateText)

		// 语速选项的内容
		this.playbackRateC = document.createElement('div')
		this.playbackRateC.className = 'Dvideo-playbackRate-content'
		this.playbackRate.appendChild(this.playbackRateC)


		for (let i = 0; i < playbackrateData.rateList.length; i++) {
			let playbackRateL = document.createElement('span')
			if (i === playbackrateIndex) {
				playbackRateL.className = 'Dvideo-playbackRate-list active'
			} else {
				playbackRateL.className = 'Dvideo-playbackRate-list'
			}
			playbackRateL.title = playbackrateData.rateList[i].toFixed(1) + 'x'
			playbackRateL.innerText = playbackrateData.rateList[i].toFixed(1) + 'x'
			playbackRateL.setAttribute('data-index', i)
			oFragment.appendChild(playbackRateL)
		}
		this.playbackRateC.appendChild(oFragment)

		let _this = this

		// ====================设置语速交互
		_this.playbackRate.onmouseenter = function (event) {
			_this.playbackRateC.style.display = 'block'
		}

		_this.playbackRate.onmouseleave = function (event) {
			_this.playbackRateC.style.display = 'none'
		}

		_this.playbackRateC.onclick = function (event) {
			let e = event || window.event
			let index = e.target.getAttribute('data-index')
			_this.setPlayBackRate(index)
		}
	}

	// 创建currentduration
	createCurrentDurationText () {
		let oFragment = document.createDocumentFragment();
		// 显示当前时间和总时长  区域
		this.textVideoTimeC = document.createElement('div')
		this.textVideoTimeC.className = 'Dvideo-time-content'
		this.videoCtrlDetail.appendChild(this.textVideoTimeC)

		// 显示当前秒数
		this.textCurrentT = document.createElement('span')
		this.textCurrentT.className = 'Dvideo-text-current'
		this.textCurrentT.innerText = '--:-- '
		oFragment.appendChild(this.textCurrentT)

		// 显示时长
		this.textDurationT = document.createElement('span')
		this.textDurationT.className = 'Dvideo-text-duration'
		this.textDurationT.innerText = ' --:--'
		oFragment.appendChild(this.textDurationT)
		this.textVideoTimeC.appendChild(oFragment)
	}

	// pc 端进度条
	createPcProgress () {
		// 进度条区域
		this.videoProressC = document.createElement('div')
		this.videoProressC.className = 'Dvideo-progress-content'
		this.videoCtrl.appendChild(this.videoProressC)

		// 进度条内容 (包涵进度条和缓冲条) videoProressDetail
		this.videoProressD = document.createElement('div')
		this.videoProressD.className = 'Dvideo-progress-detail'
		this.videoProressC.appendChild(this.videoProressD)

		// 缓冲条
		this.bufferedProress = document.createElement('div')
		this.bufferedProress.className = 'Dvideo-progress-buffered'
		this.videoProressD.appendChild(this.bufferedProress)

		// 播放进度条
		this.realProress = document.createElement('div')
		this.realProress.className = 'Dvideo-progress-real'
		this.videoProressD.appendChild(this.realProress)

		// 播放进度条圆形按钮
		this.circleRange = document.createElement('span')
		this.circleRange.className = 'Dvideo-circle-range'
		this.videoProressC.appendChild(this.circleRange)

		let _this = this

		// 点击进度条跳转
		_this.videoProressD.onclick = function (event) {
			// let e = event || window.event
			// let l = e.layerX
			// let w = _this.videoProressD.offsetWidth

			// _this.videoEle.currentTime = Math.floor(l / w * _this.durationT)
			// _this.currentT = _this.videoEle.currentTime
			// _this.updatePorgress()
			let e = event || window.event
			// alert(e.target.offsetLeft)
			let videoProgressCW = _this.videoProressD.offsetWidth
			let eW = e.offsetX
			_this.videoEle.currentTime = _this.currentT = Math.floor(eW / videoProgressCW * _this.durationT)
			_this.updatePorgress()
		}
		
		// 进度条拖动 (PC)
		_this.circleRange.onmousedown = function (event) {
			_this.isDrag = true
			let e = event || window.event
			let x = e.clientX
			let l = event.target.offsetLeft + 7
			e.stopPropagation()
			_this.maxProgressWidth = _this.videoProressD.offsetWidth
			_this.videoCtrl.onmousemove = function (event) {
				let e = event || window.event
				if (_this.isDrag) {
					let thisX = e.clientX
					_this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
					// update Time
					_this.updatePorgress(true)
				}
			}
			_this.videoCtrl.onmouseup = function (event) {
				let e = event || window.event
				e.stopPropagation()
				if (_this.isDrag) {
					_this.isDrag = false
					_this.videoEle.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
				} else {
					return
				}
			}

			_this.videoCtrl.onmouseleave = function (event) {
				let e = event || window.event
				e.stopPropagation()
				if (_this.isDrag) {
					_this.isDrag = false
					_this.videoEle.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
				} else {
					return
				}

				_this.hideTopBottomCtrl()
			}
		}
	}

	// 创建视频
	createVideoEle () {
		this.videoEle = document.createElement('video')
		this.videoEle.className = 'Dvideo-ele'
		this.videoEle.src = this.opt.src
		this.videoEle.loop = this.opt.loop
		this.videoEle.autoplay = this.opt.autoplay
		this.videoEle.poster = this.opt.poster
		this.videoC.appendChild(this.videoEle)

		let _this = this

		// 视频事件
		_this.videoEle.onloadstart = function () {
			_this.showLoading(true, '视频加载中，请稍等')
		}

		_this.videoEle.oncanplay = function () {
			_this.showLoading(false)
		}

		_this.videoEle.onplaying = function () {
			_this.isPlaying = true
			_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-pause'
			_this.videoPlayPauseI.title = '暂停 space'
			let date = new Date ()
			_this.reduceTBefore = Date.parse(date) - Math.floor(_this.videoEle.currentTime * 1000)
			_this.showLoading(false)
			_this.onPlaying()
		}
		_this.videoEle.onpause = function () {
			_this.isPlaying = false
			_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-play'
			_this.videoPlayPauseI.title = '播放 space'
			_this.onPause()
		}

		// 视频元数据 （时长 尺寸 以及文本轨道）
		_this.videoEle.onloadedmetadata = function () {
			_this.isLoadMate = true
			_this.durationT = _this.videoEle.duration
			// 初始化视频时间
			_this.textDurationT.innerText = _this.formartTime(_this.durationT)
			_this.onLoadedMetaData()
		}

		// 绑定进度条
		_this.videoEle.ontimeupdate = function () {
			if (!_this.isDrag) {
				_this.currentT = _this.videoEle.currentTime
				_this.updatePorgress()
				let date = new Date ()
				_this.reduceTBefore = Date.parse(date) - Math.floor(_this.currentT * 1000)
			}
			// console.log(2)
			_this.onTimeupdate()
		}
		_this.videoEle.onprogress = function () {
			if(_this.videoEle.buffered.length > 0) {
				let bufferedT = 0
				for (let i = 0; i < _this.videoEle.buffered.length; i++) {
					bufferedT += _this.videoEle.buffered.end(i) - _this.videoEle.buffered.start(i)
					if(bufferedT > _this.durationT) {
						bufferedT = _this.durationT
						console.log('缓冲完成')
					}
				}
				let bufferedP = Math.floor((bufferedT / _this.durationT) * 100)
				_this.bufferedProress.style.width = bufferedP + '%'
			} else {
				console.log('未缓冲')
			}

			let date = new Date ()
			// console.log(_this.reduceTAfter + '-------------------------' + _this.reduceTBefore)
			if(!_this.videoEle.paused) {
				_this.reduceTAfter = Date.parse(date) - Math.floor(_this.currentT * 1000)
				console.log(_this.reduceTAfter)
				if(_this.reduceTAfter - _this.reduceTBefore > 1000) {
					_this.showLoading(true)
				} else {
					_this.showLoading(false)
				}
			} else {
				return
			}
		}

		_this.videoEle.onended = function () {
			_this.onEnded();
		}

		_this.videoEle.onwaiting = function () {
			_this.showLoading(true, '视频加载中,请稍等')
		}
	}

	createVideoC () {
		// video content
		this.videoC = document.createElement('div')
		this.videoC.className = 'Dvideo-content'
		this.opt.ele.appendChild(this.videoC)

		let _this = this
		// 鼠标事件  移动显示菜单
		_this.videoC.onmousemove = function () {
			_this.showTopBottomCtrl(true)
		}

		// 界面点击播放暂停
		let startTime = 0;
		_this.videoC.onclick = function () {
			let date = (new Date()).valueOf();
			// > 1秒是播放暂停的操作
			if (date - startTime > 500) {
				if (_this.isPlaying) {
					_this.videoPause()
				} else {
					_this.videoPlay()
				}
			} else {
				// 否则就是全屏的操作
				if (_this.isFull) {
					_this.exitFullscreen()
				} else {
					_this.launchFullScreen(_this.opt.ele)
				}
			}
			startTime = date
		}
	}

	createCtrlC () {
		// 底部控制条
		this.videoCtrl = document.createElement('div')
		this.videoCtrl.className = 'Dvideo-ctrl'
		this.videoC.appendChild(this.videoCtrl)

		//除底部进度条信息之外  底部的所有内容
		this.videoCtrlDetail = document.createElement('div')
		this.videoCtrlDetail.className = 'Dvideo-detail'
		this.videoCtrl.appendChild(this.videoCtrlDetail)

		let _this = this
		// 移动显示粗的进度条
		_this.videoCtrl.onmouseenter = function () {
			_this.showProgressRange()
		}
		// 关闭两个菜单控制栏的冒泡事件
		_this.videoCtrl.onclick = function (e) {
			e.stopPropagation();
		}
	}

	createHeaderC () {
		// 头部的信息
		this.videoHeader = document.createElement('div')
		this.videoHeader.className = 'Dvideo-header'
		this.videoC.appendChild(this.videoHeader)
		// 头部的title
		this.videoHeaderTitle = document.createElement('p')
		this.videoHeaderTitle.className = 'Dvideo-header-title'
		this.videoHeaderTitle.innerText = this.opt.title
		this.videoHeaderTitle.title = this.opt.title
		this.videoHeader.appendChild(this.videoHeaderTitle)

		let _this = this

		// 关闭两个菜单控制栏的冒泡事件
		_this.videoHeader.onclick = function (e) {
			e.stopPropagation();
		}

	}

	// 放大缩小
	createSelectVideoFull () {
		// 放大缩小功能
		let iconFullScreenITitle = this.isFull ? '全屏' : '取消全屏'
		this.fullscreenConfig = document.createElement('i')
		this.fullscreenConfig.className = 'Dvideo-menu-fullscreenConfig icon-fullscreen'
		this.fullscreenConfig.title = iconFullScreenITitle
		this.menuRightC.appendChild(this.fullscreenConfig)
		// 初始全屏效果
		this.updateFullScreenState(this.isFull)

		let _this = this
		// 点击切换全屏与非全屏状态
		_this.fullscreenConfig.onclick = function () {
			if (_this.isFull) {
				_this.exitFullscreen()
			} else {
				_this.launchFullScreen(_this.opt.ele)
			}
		}
	}

	// 播放暂停包括下一集 
	createvideoPlayState () {
		this.videoCtrlStateC = document.createElement('div')
		this.videoCtrlStateC.className = 'Dvideo-ctrl-state'
		this.videoCtrlDetail.appendChild(this.videoCtrlStateC)

		// 播放按钮
		let iconPlayPauseClass = this.isPlaying ? 'icon-pause' : 'icon-play'
		let iconPlayPauseITitle = this.isPlaying ? '暂停 space' : '播放 space'
		this.videoPlayPauseI = document.createElement('i')
		this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause ' + iconPlayPauseClass
		this.videoPlayPauseI.title = iconPlayPauseITitle
		this.videoCtrlStateC.appendChild(this.videoPlayPauseI)

		// 下一集控制区域
		let displayStyle = this.opt.showNext ? 'inline-block' : 'none'
		this.videoNextI = document.createElement('i')
		this.videoNextI.className = 'Dvideo-ctrl-next icon-nextdetail'
		this.videoNextI.title = '下一集 next'
		this.videoNextI.style.display = displayStyle
		this.videoCtrlStateC.appendChild(this.videoNextI)

		let _this = this
		// 播放下一集
		_this.videoNextI.onclick = function () {
			_this.nextVideo ()
		}

		// 播放暂停按钮
		_this.videoPlayPauseI.onclick = function () {
			if (_this.isPlaying) {
				_this.videoPause()
			} else {
				_this.videoPlay()
			}
		}
	}

	// 创建提示信息
	createVideoTips () {
		this.tipsInfo = document.createElement('div')
		this.tipsInfo.className = 'Dvideo-tips-info'
		this.videoCtrl.appendChild(this.tipsInfo)
	}

	// 创建切换视频清晰度效果
	createVideoDefinition () {
		let showVClassName = this.opt.showVideoDefinitionUnFull ? '' : 'none'
		let oFragment = document.createDocumentFragment();
		// 获取的数据  本地存储或者初始化的清晰度
		let videoDefinitionData = this.hasLStorage('D-videoDefinition') ? JSON.parse(this.getLStorage('D-videoDefinition')) : this.opt.videoDefinition
		// active索引
		let videoDefinitionIndex = Number(videoDefinitionData.activeIndex)
		// active类型  0 标清   1 高清   2 超清
		let videoDefinitionType = videoDefinitionData.definitionList[videoDefinitionIndex].type
		// active名字  0 标清   1 高清   2 超清
		let videoDefinitionName = videoDefinitionData.definitionList[videoDefinitionIndex].name

		// 设置清晰度区域
		this.videoDefinition = document.createElement('span')
		this.videoDefinition.className = 'Dvideo-definition ' + showVClassName
		this.menuRightC.appendChild(this.videoDefinition)

		// 显示清晰度文本
		this.videoDefinitionText = document.createElement('span')
		this.videoDefinitionText.className = 'Dvideo-definitionText'
		this.videoDefinitionText.title = videoDefinitionName
		this.videoDefinitionText.innerText = videoDefinitionName
		this.videoDefinition.appendChild(this.videoDefinitionText)

		// 清晰度选项的内容
		this.videoDefinitionC = document.createElement('div')
		this.videoDefinitionC.className = 'Dvideo-definition-content'
		this.videoDefinition.appendChild(this.videoDefinitionC)


		for (let i = 0; i < videoDefinitionData.definitionList.length; i++) {
			let videoDefinitionL = document.createElement('span')
			if (i === videoDefinitionIndex) {
				videoDefinitionL.className = 'Dvideo-definition-list active'
			} else {
				videoDefinitionL.className = 'Dvideo-definition-list'
			}
			videoDefinitionL.title = videoDefinitionData.definitionList[i].name
			videoDefinitionL.innerText = videoDefinitionData.definitionList[i].name
			videoDefinitionL.setAttribute('data-index', i)
			videoDefinitionL.setAttribute('data-type', videoDefinitionData.definitionList[i].type)
			oFragment.appendChild(videoDefinitionL)
		}
		this.videoDefinitionC.appendChild(oFragment)

		let _this = this

		// ====================设置语速交互
		_this.videoDefinition.onmouseenter = function (event) {
			_this.videoDefinitionC.style.display = 'block'
		}

		_this.videoDefinition.onmouseleave = function (event) {
			_this.videoDefinitionC.style.display = 'none'
		}

		_this.videoDefinition.onclick = function (event) {
			let e = event || window.event
			_this.setVideoDefinition(e)
		}
	}

	// 创建设置音量的效果
	createVolume () {
		let showVClassName = this.opt.showVolumeUnFull ? '' : 'none'
		// 设置清晰度区域
		this.videoVolumeC = document.createElement('div')
		this.videoVolumeC.className = 'Dvideo-volume ' + showVClassName
		this.menuRightC.appendChild(this.videoVolumeC)

		// 进度线条
		this.videoVolumeP = document.createElement('div')
		this.videoVolumeP.className = 'Dvideo-volume-P'
		this.videoVolumeC.appendChild(this.videoVolumeP)

		// 事实的进度信息
		this.videoVolumeR = document.createElement('div')
		this.videoVolumeR.className = 'Dvideo-volume-R'
		this.videoVolumeP.appendChild(this.videoVolumeR)

		// 可拖动的小圆点
		this.videoVolumeRange = document.createElement('div')
		this.videoVolumeRange.className = 'Dvideo-volume-range'
		this.videoVolumeC.appendChild(this.videoVolumeRange)

		// 初始化音量 有本地存储 设置过就使用本地存储
		this.initVolume ();

		let isDrag = false

		let _this = this
		let persent = 0
		// 进度条拖动 (PC)
		_this.videoVolumeRange.onmousedown = function (event) {
			isDrag = true
			let e = event || window.event
			let x = e.clientX
			let l = event.target.offsetLeft + 6
			e.stopPropagation()
			_this.maxVolumeWidth = _this.videoVolumeC.offsetWidth

			_this.videoVolumeC.onmousemove = function (event) {
				if(isDrag) {
					let e = event || window.event
					let thisX = e.clientX
					_this.dragVolumeTo = Math.min(_this.maxVolumeWidth, Math.max(0, l + (thisX - x)))
					persent = _this.dragVolumeTo / _this.maxVolumeWidth
					_this.updateVolume(persent);
				}
			}

			_this.videoVolumeC.onmouseup = function (event) {
				isDrag = false
				e.stopPropagation()
				e.preventDefault()
				// 本地存储
				_this.setLStorage('Dvideo-volume', persent)
				return
			}

			_this.videoVolumeC.onmouseleave = function (event) {
				isDrag = false
				e.stopPropagation()
				e.preventDefault()
				// 本地存储
				_this.setLStorage('Dvideo-volume', persent)
				return
			}
		}

		_this.videoVolumeP.onclick = function (event) {
			let e = event || window.event
			// alert(e.target.offsetLeft)
			let videoVolumeCW = _this.videoVolumeP.offsetWidth
			let eW = e.offsetX
			// console.log(videoVolumeCW)
			_this.updateVolume(eW / videoVolumeCW);
		}
	}

	// 更新音量界面显示以及音量调整
	updateVolume (persent) {
		this.videoVolumeRange.style.left = persent * 100 + '%'
		this.videoVolumeR.style.width = persent * 100 + '%'
		this.videoVolumeRange.setAttribute('data-volume', Math.round(persent * 100))
		this.volume = persent
		this.videoEle.volume = persent
		// 本地存储
		this.setLStorage('Dvideo-volume', persent)
	}

	// 初始化音量
	initVolume () {
		if(this.getLStorage('Dvideo-volume') === null) {
			this.updateVolume(0.8)
			this.volume = 0.8
		} else {
			let persent = this.getLStorage('Dvideo-volume')
			this.updateVolume(persent)
			this.volume = persent
		}
	}

	// 根据class查找元素
	getDomByClass(classInfo = '') {
		if(!typeof(document.getElementsByClassName) === 'function'){
			let result=[];
			let aEle=document.getElementsByTagName('*');
			/*正则模式*/
			let re=new RegExp("\\b" + classInfo + "\\b","g");
			for(let i=0;i<aEle.length;i++){
				/*字符串search方法判断是否存在匹配*/
				if(aEle[i].className.search(re) != -1){
					result.push(aEle[i]);
				}
			}
			return result;
		} else {
			return document.getElementsByClassName(classInfo);
		}
	}

	// 是否支持localstorage
	lStorage () {
		// localStorage
		if (window.localStorage) {
			return true;
		} else {
			return false;
		}
	}

	// 是否有对应的storage_name 的本地存储
	hasLStorage (storage_name) {
		let _this = this
		if (this.lStorage) {
			return !(window.localStorage.getItem(storage_name) === 'undefind' || window.localStorage.getItem(storage_name) === null)
		} else {
			return false
		}
	}

	// 设置本地存储
	setLStorage (key, value) {
		if (this.lStorage) {
			window.localStorage.setItem(key, value)
		}
	}

	// 获取本地存储
	getLStorage (key) {
		if (this.lStorage) {
			let getLs = window.localStorage.getItem(key)
			return getLs
		} else {
			return ''
		}
	}

	// 清除单个本地存储
	rmLStorage (key) {
		if (this.lStorage) {
			window.localStorage.removeItem(key)
		}
	}

	// 清除所有本地存储
	clearLStorage () {
		if (this.lStorage) {
			window.localStorage.clear()
		}
	}
}

export default Dvideo
