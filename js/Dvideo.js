(function (window, document) {
	// var screenChange = 'webkitfullscreenchange' || 'mozfullscreenchange' || 'fullscreenchange' || 'msfullscreenchange'
	var screenError = 'webkitfullscreenerror' || 'fullscreenerror' || 'mozfullscreenerror' || 'msfullscreenerror'

	// // 设置全屏的状态的
	// var isFull = false

	// var isPlaying = false

	// // 视频时长
	// var durationT = 0

	// var showCtrlT  // 这是鼠标移入显示控制菜单的timeout

	// //  判断当前是否处于全屏状态
	// var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled

	var Dvideo = function (options) {
		// 判断是否是new Dvideo 的  不是的话 帮他new一下
		if (!(this instanceof Dvideo)) return new Dvideo(options)
		this.localValue = {
			ele: '',
			src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',
			title: '这是一个视频标题这是一个视频标题这是一个视频标题这是一个视频标题',
			width: '420px',
			height: '250px',
			showNext: false,
			autoplay: false,
			ctrSpeedDuration: 5000,
			loop: true,
			playbackRate: {
				activeIndex: 1,
				rateList: [0.8,1,1.4,1.8,2]
			},
			videoDefinition: {
				activeIndex: 1,
				definitionList: [
					{
						type: '0',
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
			// 可让用户自定义扩展
			nextVideoExtend: function () {alert(1)},
			setVideoDefinition: function () {}
		}

		this.opt = this.extend(this.localValue, options, true)

		// this.clearLStorage()

		//================初始化部分变量
		// 设置全屏的状态
		this.isFull = false
		// 设置播放的状态
		this.isPlaying = false
		// 设置视频时长
		this.durationT = 0
		// 这是鼠标移入显示控制菜单的timeout
		this.showCtrlT = ''
		// 进度百分比
		this.currentP = 0
		// 进度条是否可拖动
		this.isDrag = false
		// 快进快退事件
		this.onpress = false
		// 进度条的宽度
		this.maxProgressWidth = 0
		// 进度条拖动的位置
		this.dragProgressTo = 0
		// 音量大小
		this.volume = 1

		// 获取浏览器版本
		this.browserV = this.browserVersion()

		// 通过时间戳与当前时间的差值来判断是否需要加载
		this.reduceTBefore = 0   // 时间戳与当前时间的差值 (初始化)
		this.reduceTAfter = 0   // 时间戳与当前时间的差值 (执行中)

		// 判断传进来的是DOM还是字符串
        if ((typeof options.ele) === "string") {
            this.opt.ele = document.querySelector(options.ele)
        }else{  
            this.opt.ele = options.ele
        }
        this.isPlaying = this.opt.autoplay
        this.initDom()
	}

	Dvideo.prototype = {
		constructor: this,
		initDom: function () {
			this.opt.ele.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height

			// 创建组件的content区域
			this.createVideoC()

			// 创建Video
			this.createVideoEle()

			// 创建头部菜单信息
			this.createHeaderC()

			// 创建控制菜单
			this.createCtrlC()

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

			// 语速选项的列表
			this.createPlaybackRateList()


			// 设置清晰度区域
			this.createVideoDefinition()


			// 全屏按钮
			this.createSelectVideoFull()

			// 显示提示信息
			this.createVideoTips()


			// 初始化事件
			this.initEvent()
		},

		extend: function(o,n,override) {
		    for(var key in n){
		        if (n.hasOwnProperty(key) && (!o.hasOwnProperty(key) || override)) {
		            o[key] = n[key]
		        }
		    }
		    return o
		},

		// 开启全屏
		launchFullScreen: function (element) {
			if(this.browserV.indexOf('IE10') >= 0 || this.browserV.indexOf('IE9') >= 0) {
				console.log('启用IE全屏')
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
				console.log('启用全屏 包括ie11')
				this.launchFullScreenStyle(element)
			}
			this.updateFullScreenState(true)
		},

		// 全屏下视频的样式
		launchFullScreenStyle: function () {
			// element.style.cssText = 'width: 100%; height: 100%;'
			this.opt.ele.style.cssText = 'width: 100%; height: 100%;'
			// this.videoEle.style.cssText = 'width: 100%; height: 100%;'
		},

		// 全屏下IE 11 以下视频的样式
		launchFullScreenIE11L: function () {
			var cName = this.opt.ele.className
			this.opt.ele.className = cName + ' ie-fullscreen'
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		},

		// 关闭全屏
		exitFullscreen: function () {
			if(this.browserV.indexOf('IE10') >= 0 || this.browserV.indexOf('IE9') >= 0) {
				console.log('启用IE9 IE10全屏')
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
				this.exitFullScreenStyle()
			}
		},

		// 关闭全屏IE 10及以下
		exitFullscreenIE11L: function () {
			console.log('关闭全屏 IE 10及以下')
			this.updateFullScreenState(false)
			var cName = this.opt.ele.className
			this.opt.ele.className = cName.split(' ').slice(cName.split(' ').indexOf('ie-fullscreen'), 1)
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		},

		// 关闭全屏的元素样式
		exitFullScreenStyle: function () {
			console.log('关闭全屏 其他浏览器 和 非IE11以下')
			this.updateFullScreenState(false)
			this.opt.ele.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			// this.videoEle.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
		},

		// 更新全屏状态  包括显示全屏图标样式    
		updateFullScreenState: function (bool) {
			this.isFull = bool || false
			var iconClassName = this.isFull ? 'Dvideo-menu-fullscreenConfig icon-canclefullscreen' : 'Dvideo-menu-fullscreenConfig icon-fullscreen'
			var title = this.isFull ? '取消全屏' : '全屏'
			this.fullscreenConfig.className = iconClassName
			this.fullscreenConfig.title = title
			// 设置页面是否全屏的class
			var videoClassName = this.isFull ? 'Dvideo-content full' : 'Dvideo-content'
			this.videoC.className = videoClassName
		},

		// 屏幕全屏模式改变事件  包括ie 11 以下
		screenChangeEvent: function (element) {
			var _this = this
			if(_this.browserV.indexOf('IE11') >= 0) {
				document.onkeydown = function (e) {
					var keyNum = window.event ? e.keyCode : e.which
					if (keyNum === 27 && _this.isFull) {
						// ie退出全屏   这里针对的是IE11
						_this.exitFullScreenStyle()
					}
				}
			}
			else if (this.browserV.indexOf('IE10') >= 0 || this.browserV.indexOf('IE9') >= 0) {
				document.onkeydown = function (e) {
					var keyNum = window.event ? e.keyCode : e.which
					if (keyNum === 27 && _this.isFull) {
						// ie退出全屏   这里针对的是IE10  9
						_this.exitFullscreenIE11L()
					}
				}
			}
			else {
				var eventList = ['webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange', 'msfullscreenchange']
				for(var i = 0; i < eventList.length; i++) {
					document.addEventListener(eventList[i], function () {
						// 全屏显示的网页元素
						var fullscreenElement  = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement

						// 判断网页是否处于全屏状态下
						var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen

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
		},

		browserVersion: function () {
			var userAgent = navigator.userAgent,     
				rMsie = /(msie\s|trident.*rv:)([\w.]+)/,     
				rFirefox = /(firefox)\/([\w.]+)/,     
				rOpera = /(opera).+version\/([\w.]+)/,     
				rChrome = /(chrome)\/([\w.]+)/,     
				rSafari = /version\/([\w.]+).*(safari)/;    
			var browser;    
			var version;    
			var ua = userAgent.toLowerCase();    
			function uaMatch(ua){    
				var match = rMsie.exec(ua);    
				if(match != null){    
					return { browser : "IE", version : match[2] || "0" };    
				}    
				var match = rFirefox.exec(ua);    
					if (match != null) {    
					return { browser : match[1] || "", version : match[2] || "0" };    
				}    
				var match = rOpera.exec(ua);    
					if (match != null) {    
					return { browser : match[1] || "", version : match[2] || "0" };    
				}    
				var match = rChrome.exec(ua);    
					if (match != null) {    
					return { browser : match[1] || "", version : match[2] || "0" };    
				}    
				var match = rSafari.exec(ua);    
					if (match != null) {    
					return { browser : match[2] || "", version : match[1] || "0" };    
				}    
				if (match != null) {    
					return { browser : "", version : "0" };    
				}    
			}    
			var browserMatch = uaMatch(userAgent.toLowerCase());
			if (browserMatch.browser){
				browser = browserMatch.browser;
				version = browserMatch.version;
			}
			return browser + version
		},

		// 显示上下菜单
		showTopBottomCtrl: function () {
			this.videoCtrl.className = 'Dvideo-ctrl active'
			this.videoHeader.className = 'Dvideo-header active'
		},

		hideTopBottomCtrl: function () {
			this.videoCtrl.className = 'Dvideo-ctrl'
			this.videoHeader.className = 'Dvideo-header'
			this.hideProgressRange()
		},

		// 显示隐藏进度条小球
		showProgressRange: function () {
			this.videoProressC.className = 'Dvideo-progress-content active'
		},

		hideProgressRange: function () {
			this.videoProressC.className = 'Dvideo-progress-content'
		},

		videoPlay: function () {
			try{
				this.videoEle.play();
				this.isPlaying = true
			} catch (e) {
				console.log(e)
			}
		},

		videoPause: function () {
			try{
				this.videoEle.pause();
				this.isPlaying = false
			} catch (e) {
				console.log(e)
			}
		},

		videoPlayPause: function () {
			if (this.isPlaying) {
				this.videoPause();
			} else {
				this.videoPlay();
			}
		},

		showLoading: function (bool) {
			if (bool) {
				this.tipsInfo.innerText = '视频加载中,请稍等  或者切换稍低的清晰度'
				this.tipsInfo.style.display = 'block'
				console.log('加载中')
			} else {
				this.tipsInfo.style.display = 'none'
				// console.log('正常播放')
			}
		},

		// 音乐初始化事件
		initEvent: function () {
			var _this = this

			// if (_this.browserV.indexOf('IE') >= 0) {}

			// 键盘事件  (ie 没有ctrl键)
			document.onkeydown = function (e) {
				var e = e || window.event
				if ((e && e.ctrlKey && (e.keyCode || e.which || e.charCode) === 32) || (e && e.metaKey && (e.keyCode || e.which || e.charCode) === 32)) {   // 同时按下 ctrl + 空格
					// console.log(e.ctrlKey + '------' + (e.keyCode || e.which || e.charCode))
					_this.videoPlayPause()
				}
				if ((e && e.ctrlKey && (e.keyCode || e.which || e.charCode) === 39) || (e && e.metaKey && (e.keyCode || e.which || e.charCode) === 39)) { 	// 同时按下 ctrl + -->   快进
					if (_this.videoEle.currentTime) {
						_this.currentT = _this.currentT + 10 > _this.durationT ? _this.durationT : _this.currentT + 10
						_this.videoEle.currentTime = _this.currentT
						_this.updatePorgress()
					}
				}
				if ((e && e.ctrlKey && (e.keyCode || e.which || e.charCode) === 37) || (e && e.metaKey && (e.keyCode || e.which || e.charCode) === 37)) { 	// 同时按下 ctrl + <--
					if (_this.videoEle.currentTime) {
						_this.currentT = _this.currentT - 10 < 0 ? 0 : _this.currentT - 10
						_this.videoEle.currentTime = _this.currentT
						_this.updatePorgress()
					}
				}

				if ((e && e.ctrlKey && (e.keyCode || e.which || e.charCode) === 38) || (e && e.metaKey && (e.keyCode || e.which || e.charCode) === 38)) { 	// 同时按下 ctrl + down
					_this.volume = _this.volume + 0.02 > 1 ? 1 : _this.volume + 0.02
					_this.setVolume()
				}

				if ((e && e.ctrlKey && (e.keyCode || e.which || e.charCode) === 40) || (e && e.metaKey && (e.keyCode || e.which || e.charCode) === 40)) { 	// 同时按下 ctrl + down
					_this.volume = _this.volume - 0.02 < 0 ? 0 : _this.volume - 0.02
					_this.setVolume()
				}
  			}
			
			// 添加监听是否改变窗口大小事件
			_this.screenChangeEvent()
		},

		// 格式化时间
		formartTime: function (seconds) {
			var formatNumber = function (n) {
	            n = n.toString()
	            return n[1] ? n : '0' + n
	        }
	        var m = Math.floor(seconds / 60);
	        var s = Math.floor(seconds % 60);
	        return formatNumber(m) + ":" + formatNumber(s);
		},

		// // initEvent  初始化事件
		// initEvent: function () {
		// 	var _this = this
			
		// 	_this.initVideoEvent()
		// },
		setVideoDefinition: function (e) {
			var index = e.target.getAttribute('data-index')
			var type = e.target.getAttribute('data-type')

			this.currentT = this.videoEle.currentTime

			this.opt.setVideoDefinition(type, e)
			
			this.videoEle.currentTime = this.currentT
			this.videoPlay()

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
		},

		setPlayBackRate: function (e) {
			var index = e.target.getAttribute('data-index')
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
			e.target.className = 'Dvideo-playbackRate-list active'
			this.playbackRateC.style.display = 'none'
		},

		// 更新进度条位置
		updatePorgress: function (isDrag) {
			var isDrag = isDrag || false
			if (isDrag) {
				this.circleRange.style.left = this.dragProgressTo + 'px'
				this.realProress.style.width = this.dragProgressTo + 'px'
				var currentTime = Math.floor(this.dragProgressTo / this.maxProgressWidth * this.durationT)
				this.textCurrentT.innerText = this.formartTime(currentTime)
			} else {
				this.currentP = Number((this.currentT / this.durationT) * 100)
				this.currentP = this.currentP > 100 ? 100 : this.currentP
				this.realProress.style.width = this.currentP + '%'
				this.circleRange.style.left = this.currentP + '%'
				// 更改时间进度
				this.textCurrentT.innerText = this.formartTime(this.videoEle.currentTime)
			}
		},

		// 下一集的点击事件
		nextVideo: function () {
			console.log('你点击了播放下一集   可使用实例化的对象调用nextVideo 方法实现播放下一集的效果')
			if (typeof this.opt.nextVideoExtend === 'function') this.opt.nextVideoExtend()
		},

		// 设置音量大小
		setVolume: function () {
			this.videoEle.volume = this.volume
		},

		// 创建PlaybackRateList
		createPlaybackRateList: function () {
			// 语速数据
			var playbackrateData = this.hasLStorage('D-playbackRate') ? JSON.parse(this.getLStorage('D-playbackRate')) : JSON.parse(this.opt.playbackRate)

			// 当前active索引
			var playbackrateIndex = Number(playbackrateData.activeIndex)

			// 当前语速
			var playbackR = Number(playbackrateData.rateList[playbackrateIndex])


			// 设置语速区域
			this.playbackRate = document.createElement('span')
			this.playbackRate.className = 'Dvideo-playbackRate'
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


			for (var i = 0; i < playbackrateData.rateList.length; i++) {
				var playbackRateL = document.createElement('span')
				if (i === playbackrateIndex) {
					playbackRateL.className = 'Dvideo-playbackRate-list active'
				} else {
					playbackRateL.className = 'Dvideo-playbackRate-list'
				}
				playbackRateL.title = playbackrateData.rateList[i].toFixed(1) + 'x'
				playbackRateL.innerText = playbackrateData.rateList[i].toFixed(1) + 'x'
				playbackRateL.setAttribute('data-index', i)
				this.playbackRateC.appendChild(playbackRateL)
			}

			var _this = this

			// ====================设置语速交互
			_this.playbackRate.onmouseenter = function (event) {
				_this.playbackRateC.style.display = 'block'
			}

			_this.playbackRate.onmouseleave = function (event) {
				_this.playbackRateC.style.display = 'none'
			}

			_this.playbackRateC.onclick = function (event) {
				var e = event || window.event
				_this.setPlayBackRate(e)
			}
		},

		// 创建currentduration
		createCurrentDurationText: function () {
			// 显示当前时间和总时长  区域
			this.textVideoTimeC = document.createElement('div')
			this.textVideoTimeC.className = 'Dvideo-time-content'
			this.videoCtrlDetail.appendChild(this.textVideoTimeC)

			// 显示当前秒数
			this.textCurrentT = document.createElement('span')
			this.textCurrentT.className = 'Dvideo-text-current'
			this.textCurrentT.innerText = '00:00 '
			this.textVideoTimeC.appendChild(this.textCurrentT)

			// 显示时长
			this.textDurationT = document.createElement('span')
			this.textDurationT.className = 'Dvideo-text-duration'
			this.textDurationT.innerText = ' 00:00'
			this.textVideoTimeC.appendChild(this.textDurationT)
		},

		// pc 端进度条
		createPcProgress: function () {
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

			var _this = this

			// 点击进度条跳转
			_this.videoProressD.onclick = function (event) {
				var e = event || window.event
				var l = e.layerX
				var w = _this.videoProressD.offsetWidth

				_this.videoEle.currentTime = Math.floor(l / w * _this.durationT)
				_this.currentT = _this.videoEle.currentTime
				_this.updatePorgress()
			}
			
			// 进度条拖动 (PC)
			_this.circleRange.onmousedown = function (event) {
				_this.isDrag = true
				var e = event || window.event
				var x = e.clientX
				var l = event.target.offsetLeft + 7
				e.stopPropagation()
				_this.maxProgressWidth = _this.videoProressD.offsetWidth
				_this.videoCtrl.onmousemove = function (event) {
					var e = event || window.event
					if (_this.isDrag) {
						var thisX = e.clientX
						_this.dragProgressTo = Math.min(_this.maxProgressWidth, Math.max(0, l + (thisX - x)))
						console.log(e.clientX + '--------')
						console.log(_this.maxProgressWidth + '--------')
						console.log(l + (thisX - x) + '--------')
						// update Time
						_this.updatePorgress(true)
					}
				}
				_this.videoCtrl.onmouseup = function (event) {
					var e = event || window.event
					e.stopPropagation()
					console.log(_this.dragProgressTo +' ------- '+ _this.maxProgressWidth + ' ---------- ' + _this.durationT)
					if (_this.isDrag) {
						_this.isDrag = false
						_this.videoEle.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
					} else {
						return
					}
				}

				_this.videoCtrl.onmouseleave = function (event) {
					var e = event || window.event
					e.stopPropagation()
					if (_this.isDrag) {
						_this.isDrag = false
						_this.videoEle.currentTime = Math.floor(_this.dragProgressTo / _this.maxProgressWidth * _this.durationT)
					} else {
						return
					}

					// 隐藏控制栏
					_this.showCtrlT = setTimeout(function () {
						_this.hideTopBottomCtrl()
					}, _this.opt.ctrSpeedDuration)
					_this.hideProgressRange()
				}
			}
		},

		// 创建视频
		createVideoEle: function () {
			this.videoEle = document.createElement('video')
			this.videoEle.className = 'Dvideo-ele'
			this.videoEle.src = this.opt.src
			this.videoEle.loop = this.opt.loop
			this.videoEle.autoplay = this.opt.autoplay
			// this.videoEle.style.cssText = 'width: 100%; height: auto'
			this.videoC.appendChild(this.videoEle)


			var _this = this

			// 音频事件
			_this.videoEle.onplaying = function () {
				_this.isPlaying = true
				_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-pause'
				_this.videoPlayPauseI.title = '暂停 ctrl + space'
				var date = new Date ()
				_this.reduceTBefore = Date.parse(date) - Math.floor(_this.videoEle.currentTime * 1000)
			},
			_this.videoEle.onpause = function () {
				_this.isPlaying = false
				_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-play'
				_this.videoPlayPauseI.title = '播放 ctrl + space'
			},

			// 视频元数据 （时长 尺寸 以及文本轨道）
			_this.videoEle.onloadedmetadata = function () {
				_this.durationT = _this.videoEle.duration
				// 初始化视频时间
				_this.textDurationT.innerText = _this.formartTime(_this.durationT)
			},

			// 绑定进度条
			_this.videoEle.ontimeupdate = function () {
				if (!_this.isDrag) {
					_this.currentT = _this.videoEle.currentTime
					_this.updatePorgress()
					var date = new Date ()
					_this.reduceTBefore = Date.parse(date) - Math.floor(_this.currentT * 1000)
					_this.showLoading(false)
				}
			},
			_this.videoEle.onprogress = function () {
				if(_this.videoEle.buffered.length > 0) {
					var bufferedT = 0
					for (var i = 0; i < _this.videoEle.buffered.length; i++) {
						bufferedT += _this.videoEle.buffered.end(i) - _this.videoEle.buffered.start(i)
						if(bufferedT > _this.durationT) {
							bufferedT = _this.durationT
							console.log('缓冲完成')
						}
					}
					var bufferedP = Math.floor((bufferedT / _this.durationT) * 100)
					_this.bufferedProress.style.width = bufferedP + '%'
				} else {
					console.log('未缓冲')
				}

				var date = new Date ()
				// console.log(_this.reduceTAfter + '-------------------------' + _this.reduceTBefore)
				if(!_this.videoEle.paused) {
					_this.reduceTAfter = Date.parse(date) - Math.floor(_this.currentT * 1000)
					if(_this.reduceTAfter - _this.reduceTBefore > 1000) {
						_this.showLoading(true)
					} else {
						_this.showLoading(false)
					}
				} else {
					return
				}
			}
		},

		createVideoC: function () {
			// video content
			this.videoC = document.createElement('div')
			this.videoC.className = 'Dvideo-content'
			// this.videoC.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			this.opt.ele.appendChild(this.videoC)

			var _this = this
			// 鼠标事件  移动显示菜单
			_this.videoC.onmousemove = function () {
				clearTimeout(_this.showCtrlT)
				_this.showTopBottomCtrl()
				_this.showCtrlT = setTimeout(function () {
					_this.hideTopBottomCtrl()
				}, _this.opt.ctrSpeedDuration)
			}

			// 界面点击播放暂停
			_this.videoC.onclick = function () {
				if (_this.isPlaying) {
					_this.videoPause()
				} else {
					_this.videoPlay()
				}
			}
		},

		createCtrlC: function () {
			// 底部控制条
			this.videoCtrl = document.createElement('div')
			this.videoCtrl.className = 'Dvideo-ctrl'
			this.videoC.appendChild(this.videoCtrl)

			//除底部进度条信息之外  底部的所有内容
			this.videoCtrlDetail = document.createElement('div')
			this.videoCtrlDetail.className = 'Dvideo-detail'
			this.videoCtrl.appendChild(this.videoCtrlDetail)

			var _this = this
			// 移动显示粗的进度条
			_this.videoCtrl.onmouseenter = function () {
				clearTimeout(_this.showCtrlT)
				_this.showProgressRange()
			}
			// 关闭两个菜单控制栏的冒泡事件
			_this.videoCtrl.onclick = function (e) {
				e.stopPropagation();
			}
		},

		createHeaderC: function () {
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

			var _this = this

			// 关闭两个菜单控制栏的冒泡事件
			_this.videoHeader.onclick = function (e) {
				e.stopPropagation();
			}

		},

		// 放大缩小
		createSelectVideoFull: function () {
			// 放大缩小功能
			var iconFullScreenITitle = this.isFull ? '全屏' : '取消全屏'
			this.fullscreenConfig = document.createElement('i')
			this.fullscreenConfig.className = 'Dvideo-menu-fullscreenConfig icon-fullscreen'
			this.fullscreenConfig.title = iconFullScreenITitle
			this.menuRightC.appendChild(this.fullscreenConfig)
			// 初始全屏效果
			this.updateFullScreenState(this.isFull)

			var _this = this
			// 点击切换全屏与非全屏状态
			_this.fullscreenConfig.onclick = function () {
				if (_this.isFull) {
					_this.exitFullscreen()
				} else {
					_this.launchFullScreen(_this.opt.ele)
				}
			}
		},

		// 播放暂停包括下一集 
		createvideoPlayState: function () {
			this.videoCtrlStateC = document.createElement('div')
			this.videoCtrlStateC.className = 'Dvideo-ctrl-state'
			this.videoCtrlDetail.appendChild(this.videoCtrlStateC)

			// 播放按钮
			var iconPlayPauseClass = this.isPlaying ? 'icon-pause' : 'icon-play'
			var iconPlayPauseITitle = this.isPlaying ? '暂停 ctrl + space' : '播放 ctrl + space'
			this.videoPlayPauseI = document.createElement('i')
			this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause ' + iconPlayPauseClass
			this.videoPlayPauseI.title = iconPlayPauseITitle
			this.videoCtrlStateC.appendChild(this.videoPlayPauseI)

			// 下一集控制区域
			var displayStyle = this.opt.showNext ? 'inline-block' : 'none'
			this.videoNextI = document.createElement('i')
			this.videoNextI.className = 'Dvideo-ctrl-next icon-nextdetail'
			this.videoNextI.title = '下一集 ctrl + n'
			this.videoNextI.style.display = displayStyle
			this.videoCtrlStateC.appendChild(this.videoNextI)

			var _this = this
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
		},

		// 创建提示信息
		createVideoTips: function () {
			this.tipsInfo = document.createElement('div')
			this.tipsInfo.className = 'Dvideo-tips-info'
			this.videoCtrl.appendChild(this.tipsInfo)
		},

		// 创建切换视频清晰度效果
		createVideoDefinition: function () {
			// 获取的数据  本地存储或者初始化的清晰度
			var videoDefinitionData = this.hasLStorage('D-videoDefinition') ? JSON.parse(this.getLStorage('D-videoDefinition')) : this.opt.videoDefinition
			// active索引
			var videoDefinitionIndex = Number(videoDefinitionData.activeIndex)
			// active类型  0 标清   1 高清   2 超清
			var videoDefinitionType = videoDefinitionData.definitionList[videoDefinitionIndex].type
			// active名字  0 标清   1 高清   2 超清
			var videoDefinitionName = videoDefinitionData.definitionList[videoDefinitionIndex].name

			// 设置清晰度区域
			this.videoDefinition = document.createElement('span')
			this.videoDefinition.className = 'Dvideo-definition'
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


			for (var i = 0; i < videoDefinitionData.definitionList.length; i++) {
				var videoDefinitionL = document.createElement('span')
				if (i === videoDefinitionIndex) {
					videoDefinitionL.className = 'Dvideo-definition-list active'
				} else {
					videoDefinitionL.className = 'Dvideo-definition-list'
				}
				videoDefinitionL.title = videoDefinitionData.definitionList[i].name
				videoDefinitionL.innerText = videoDefinitionData.definitionList[i].name
				videoDefinitionL.setAttribute('data-index', i)
				videoDefinitionL.setAttribute('data-type', videoDefinitionData.definitionList[i].type)
				this.videoDefinitionC.appendChild(videoDefinitionL)
			}

			var _this = this

			// ====================设置语速交互
			_this.videoDefinition.onmouseenter = function (event) {
				_this.videoDefinitionC.style.display = 'block'
			}

			_this.videoDefinition.onmouseleave = function (event) {
				_this.videoDefinitionC.style.display = 'none'
			}

			_this.videoDefinition.onclick = function (event) {
				var e = event || window.event
				_this.setVideoDefinition(e)
			}
		},

		// 根据class查找元素
		getDomByClass: function(classInfo) {
			var classInfo = classInfo || '';
			if(!typeof(document.getElementsByClassName) === 'function'){
				var result=[];
				var aEle=document.getElementsByTagName('*');
				/*正则模式*/
				var re=new RegExp("\\b" + classInfo + "\\b","g");
				for(var i=0;i<aEle.length;i++){
					/*字符串search方法判断是否存在匹配*/
					if(aEle[i].className.search(re) != -1){
						result.push(aEle[i]);
					}
				}
				return result;
			} else {
				return document.getElementsByClassName(classInfo);
			}
		},

		// 是否支持localstorage
		lStorage: function () {
			// localStorage
			if (window.localStorage) {
				return true;
			} else {
				return false;
			}
		},

		// 是否有对应的storage_name 的本地存储
		hasLStorage: function (storage_name) {
			var _this = this
			if (this.lStorage) {
				return !(localStorage.getItem(storage_name) === 'undefind' || localStorage.getItem(storage_name) === null)
			} else {
				return false
			}
		},

		// 设置本地存储
		setLStorage: function (key, value) {
			if (this.lStorage) {
				localStorage.setItem(key, value)
			} else {
				return false
			}
		},

		// 获取本地存储
		getLStorage: function (key) {
			if (this.lStorage) {
				return localStorage.getItem(key)
			} else {
				return false
			}
		},

		// 清除单个本地存储
		rmLStorage: function (key) {
			if (this.lStorage) {
				localStorage.removeItem(key)
			} else {
				return false
			}
		},

		// 清除所有本地存储
		clearLStorage: function () {
			if (this.lStorage) {
				localStorage.clear()
			} else {
				return false
			}
		},
	}

	// 暴露方法  
    window.Dvideo = Dvideo;
})(window, document)