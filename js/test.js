(function(window,docuement){
	var Test = function (options) {
		this.name = options.name || '戴伟',
		this.age = options.age || 24,
		this.sex = options.sex || '男'
		this.set = function () {alert(2)},
		this.init(options)
	}

	Test.prototype = {
		constructor: this,
		init: function (options) {
			this.set()
			alert(this.name)
		}
	}
	window.Test = Test
})(window, document)