(function (window, document) {
	var screenChange = 'webkitfullscreenchange' || 'mozfullscreenchange' || 'fullscreenchange'
	var isFullScreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
	var Dvideo = function (options) {
		// 判断是否是new Dvideo 的  不是的话 帮他new一下
		if (!(this instanceof Dvideo)) return new Dvideo(options)
		this.localValue = {
			ele: '',
			src: 'http://www.daiwei.org/index/video/EnV%20-%20PneumaticTokyo.mp4',
			width: '420px',
			height: '250px',
			autoplay: true,
			loop: true,
		}

		this.opt = this.extend(this.localValue, options, true)

		// 判断传进来的是DOM还是字符串  
        if ((typeof options.ele) === "string") {
            this.opt.ele = document.querySelector(options.ele)
        }else{  
            this.opt.ele = options.ele
        }

        this.initDom(this.opt.ele)
	}

	Dvideo.prototype = {
		constructor: this,
		initDom: function () {
			// video content
			this.videoC = document.createElement('div')
			this.videoC.className = 'Dvideo-content'
			this.videoC.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			this.opt.ele.appendChild(this.videoC)

			this.videoEle = document.createElement('video')
			this.videoEle.className = 'Dvideo-ele'
			this.videoEle.src = this.opt.src
			this.videoEle.loop = this.opt.loop
			this.videoEle.autoplay = this.opt.autoplay
			this.videoEle.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			this.videoC.appendChild(this.videoEle)

			// 添加监听是否改变窗口大小事件
			this.screenChangeEvent()
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
			// alert(screenChange)
			console.log('启用全屏')
			this.launchFullScreenStyle(element)
			if (element.requestFullscreen) {
				element.requestFullscreen()
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen()
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullscreen()
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen()
			}
		},

		// 全屏下视频的样式
		launchFullScreenStyle: function (element) {
			element.style.cssText = 'width: 100%; height: 100%;'
			this.videoC.style.cssText = 'width: 100%; height: 100%;'
			this.videoEle.style.cssText = 'width: 100%; height: 100%;'
		},

		// 关闭全屏
		exitFullscreen: function () {
			this.exitFullscreenStyle()
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		},

		// 关闭全屏的元素样式
		exitFullscreenStyle: function () {
			this.videoC.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
			this.videoEle.style.cssText = 'width:' + this.opt.width + '; height: ' + this.opt.height
		},

		// 屏幕全屏模式改变事件
		screenChangeEvent: function (element) {
			var _this = this
			document.addEventListener(screenChange, function () {
				if (isFullScreen) {
					console.log(isFullScreen)
					_this.exitFullscreenStyle();
				} else {
					console.log('-----------' + isFullScreen)
					_this.launchFullScreenStyle(element);
				}
			})
		}
	}

	// 暴露方法  
    window.Dvideo = Dvideo;
})(window, document)