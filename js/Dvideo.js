(function (window, document) {
	// var screenChange = 'webkitfullscreenchange' || 'mozfullscreenchange' || 'fullscreenchange' || 'msfullscreenchange'
	var screenError = 'webkitfullscreenerror' || 'fullscreenerror' || 'mozfullscreenerror' || 'msfullscreenerror'

	// 设置全屏的状态的
	var isFull = false

	var isPlaying = false

	var showCtrlT  // 这是鼠标移入显示控制菜单的timeout

	//  判断当前是否处于全屏状态
	var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled

	var Dvideo = function (options) {
		// 判断是否是new Dvideo 的  不是的话 帮他new一下
		if (!(this instanceof Dvideo)) return new Dvideo(options)
		this.localValue = {
			ele: '',
			src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',
			title: '这是一个视频标题这是一个视频标题这是一个视频标题这是一个视频标题',
			width: '420px',
			height: '250px',
			showNextIcon: false,
			autoplay: false,
			loop: true,
			// 可让用户自定义扩展
			nextVideoExtend: function () {alert(1)}
		}

		this.opt = this.extend(this.localValue, options, true)

		// 获取浏览器版本
		this.browserV = this.browserVersion()

		// 判断传进来的是DOM还是字符串
        if ((typeof options.ele) === "string") {
            this.opt.ele = document.querySelector(options.ele)
        }else{  
            this.opt.ele = options.ele
        }
        isPlaying = this.opt.autoplay
        this.initDom()
	}

	Dvideo.prototype = {
		constructor: this,
		initDom: function () {
			this.opt.ele.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height

			// video content
			this.videoC = document.createElement('div')
			this.videoC.className = 'Dvideo-content'
			// this.videoC.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			this.opt.ele.appendChild(this.videoC)

			this.videoEle = document.createElement('video')
			this.videoEle.className = 'Dvideo-ele'
			this.videoEle.src = this.opt.src
			this.videoEle.loop = this.opt.loop
			this.videoEle.autoplay = this.opt.autoplay
			// this.videoEle.style.cssText = 'width: 100%; height: auto'
			this.videoC.appendChild(this.videoEle)

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

			// 底部控制条
			this.videoCtrl = document.createElement('div')
			this.videoCtrl.className = 'Dvideo-ctrl'
			this.videoC.appendChild(this.videoCtrl)

			// 播放暂停 下一集控制区域
			this.videoCtrlStateC = document.createElement('div')
			this.videoCtrlStateC.className = 'Dvideo-ctrl-state'
			this.videoCtrl.appendChild(this.videoCtrlStateC)

			// 播放按钮
			var iconClass = isPlaying ? 'icon-pause' : 'icon-play'
			this.videoPlayPauseI = document.createElement('i')
			this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause ' + iconClass
			this.videoCtrlStateC.appendChild(this.videoPlayPauseI)

			// 下一集控制区域
			var displayStyle = this.opt.showNextIcon ? 'block' : 'none'
			this.videoNextI = document.createElement('i')
			this.videoNextI.className = 'Dvideo-ctrl-next icon-nextdetail'
			this.videoNextI.style.display = displayStyle
			this.videoCtrlStateC.appendChild(this.videoNextI)

			// 进度条区域
			this.videoProressC = document.createElement('div')
			this.videoProressC.className = 'Dvideo-progress-content'
			this.videoCtrl.appendChild(this.videoProressC)

			// 初始化事件
			this.initEvent()

			// 添加监听是否改变窗口大小事件
			this.screenChangeEvent()
			this.screenChangeByIE11()

			// 低于IE 11 浏览器的全屏事件
			// this.screenChangeByIE11L()
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
				isFull = true
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
				console.log('启用全屏 只包括ie11')
				isFull = true
				this.launchFullScreenStyle(element)
			}
		},

		// 全屏下视频的样式
		launchFullScreenStyle: function () {
			// element.style.cssText = 'width: 100%; height: 100%;'
			this.opt.ele.style.cssText = 'width: 100%; height: 100%;'
			// this.videoEle.style.cssText = 'width: 100%; height: 100%;'
		},

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
				console.log('启用IE全屏')
				isFull = true
				this.exitFullscreenIE11L();
			} else {
				// this.exitFullscreenStyle()
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
				console.log('关闭全屏')
				isFull = false
			}
		},

		// 关闭全屏IE 10及以下
		exitFullscreenIE11L: function () {
			var cName = this.opt.ele.className
			this.opt.ele.className = cName.split(' ').slice(cName.split(' ').indexOf('ie-fullscreen'), 1)
			var wscript = new ActiveXObject("WScript.Shell");
			if (wscript !== null) {
				wscript.SendKeys("{F11}");
			}
		},

		// 关闭全屏的元素样式
		exitFullscreenStyle: function () {
			this.opt.ele.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			// this.videoEle.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
		},

		// 屏幕全屏模式改变事件
		screenChangeEvent: function (element) {
			var _this = this
			document.addEventListener('webkitfullscreenchange', function () {
				// 全屏显示的网页元素
				var fullscreenElement  = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement

				// 判断网页是否处于全屏状态下
				var isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen

				if (fullscreenElement) {
					console.log('全屏')
					_this.launchFullScreenStyle(_this.opt.ele);
				} else {
					console.log('不是全屏')
					_this.exitFullscreenStyle();
				}
				// alert(_this.opt.ele.requestFullscreen)
			})
		},

		// IE11 全屏 的解决方案
		screenChangeByIE11: function (element) {
			var _this = this
			if(_this.browserV.indexOf('IE11') >= 0) {
				document.onkeydown = function (e) {
					var keyNum = window.event ? e.keyCode : e.which
					if (keyNum === 27 && isFull) {
						// ie退出全屏   这里针对的是IE11
						_this.exitFullscreenStyle()
					}
				}
			}
			if(this.browserV.indexOf('IE10') >= 0 || this.browserV.indexOf('IE9') >= 0) {
				document.onkeydown = function (e) {
					var keyNum = window.event ? e.keyCode : e.which
					if (keyNum === 27 && isFull) {
						// ie退出全屏   这里针对的是IE11
						_this.exitFullscreenIE11L()
					}
				}
			}
		},

		// // 判断浏览器是否支持全屏操作
		// fullscreenEnabled: function () {
		// 	return fullscreenEnabled
		// }

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

		showHideCtrl: function (ele) {
			var _this = this
			var duration = 3000
			_this.videoC.onmousemove = function () {
				clearTimeout(showCtrlT)
				_this.videoCtrl.className = 'Dvideo-ctrl active'
				_this.videoHeader.className = 'Dvideo-header active'
				showCtrlT = setTimeout(function () {
					_this.videoCtrl.className = 'Dvideo-ctrl'
					_this.videoHeader.className = 'Dvideo-header'
				}, duration)
			}
		},

		videoPlay: function () {
			this.videoEle.play();
			isPlaying = true
		},

		videoPause: function () {
			this.videoEle.pause();
			isPlaying = false
		},

		// 音乐初始化事件
		initVideoEvent: function () {
			var _this = this
			_this.videoEle.onplaying = function () {
				isPlaying = true
				_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-pause'
			},
			_this.videoEle.onpause = function () {
				isPlaying = false
				_this.videoPlayPauseI.className = 'Dvideo-ctrl-playPause icon-play'
			}
		},
		// initEvent  初始化事件
		initEvent: function () {
			var _this = this

			// 关闭两个菜单控制栏的冒泡事件
			_this.videoHeader.onclick = function (e) {
				e.stopPropagation();
			}
			// 关闭两个菜单控制栏的冒泡事件
			_this.videoCtrl.onclick = function (e) {
				e.stopPropagation();
			}

			// 界面点击播放暂停
			_this.videoC.onclick = function () {
				if (isPlaying) {
					_this.videoPause()
				} else {
					_this.videoPlay()
				}
			},

			// 播放下一集
			_this.videoNextI.onclick = function () {
				console.log('你点击了播放下一集   可使用实例化的对象调用nextVideo 方法实现播放下一集的效果')
			}

			// 播放暂停按钮
			_this.videoPlayPauseI.onclick = function () {
				if (isPlaying) {
					_this.videoPause()
				} else {
					_this.videoPlay()
				}
			}
			_this.initVideoEvent()
			_this.showHideCtrl()
		},

		nextVideo: function () {
			if (typeof this.opt.nextVideoExtend === 'function') this.opt.nextVideoExtend()
		},

		getDomByClass: function(classInfo) {
			var classInfo = classInfo || ''
			if(!typeof(document.getElementsByClassName) === 'function'){
				var result = []
				var aEle = document.getElementsByTagName('*')
				/*正则模式*/
				var re = new RegExp("\\b" + classInfo + "\\b","g")
				for(var i = 0;i<aEle.length;i++){
					/*字符串search方法判断是否存在匹配*/
					if (aEle[i].className.search(re) !== -1) {
						result.push(aEle[i])
					}
				}
				return result
			}else{
				return document.getElementsByClassName(classInfo);
				}
		}
	}

	// 暴露方法  
    window.Dvideo = Dvideo;
})(window, document)