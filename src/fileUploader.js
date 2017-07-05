/**
 * @fileOverview 基于html5的文件上传插件
 * @version 0.0.1
 * @author zhangxu <zhangxu0413@139.com>
 * @module FileUploader
 */

define(function(require, exports, module) {
	var $ = require('jquery')
	/**
	 * @class
	 * @name FileUploader
	 * @classdesc 文件上传工具构建类
	 * @param {Object} settings 初始化参数集
	 */
	var FileUploader = function(settings){
		this.settings = settings;
		this.init(settings);
		return this;
	};
	FileUploader.prototype = {
		/**
		 * @var {Object} _defaults
		 * @description 默认参数配置
		 */
		_defaults:{
			inputClass:'fileUploader-element-invisible',//input上的样式
			labelClass:'fileUploader-label',					         //label的样式
			Debug : false,							 //是否开启调试模式，调试模式会在控制台打印日志
			id : 'fileUpLoader' ,                    //实例 id
			uploadUrl : '',                          //上传路径
			picker : 'input[type=file]',             //指定选择文件的按钮容器
			auto : true,                             //读取文件后是否自动开始上传，默认自动上传
			responseType:"json",                         //返回数据的数据类型,默认json
			acceptType:undefined,                    //允许上传的文件类型，默认不做限制
			data : null,						     //上传过程中携带的参数
			sizeLimit : undefined,                   //上传文件大小限制，默认不限制
			widthLimit : undefined,                  //上传文件的宽度限制,仅在上传文件类型为图片的情况下生效，单位px
			heightLimit : undefined,                 //上传文件的高度限制,仅在上传文件类型为图片的情况下生效,单位px
			events : {                               //事件
				/** 
				 * @event 
				 * @description 在文件被加入读入内存前触发
				 * @name beforeFileQueued
				 * @param {file} file 从本地读入的文件
				 */
				'beforeFileQueued' : null,
				/** 
				 * @event 
				 * @description 校验出错触发
				 * @name error
				 * @param {file} file 从本地读入的文件
				 * @param {Object} data 错误对象
				 * @param {number} data.code 错误码,{@link member:_errorList}
				 * @param {string} data.msg 错误文案
				 */
				'error':null,
				/** 
				 * @event 
				 * @description 在文件准备上传时触发
				 * @name fileQueued
				 * @param {file} file 从本地读入的文件
				 */
				'fileQueued' : null,
				/** 
				 * @event 
				 * @description 在开始上传时触发
				 * @name uploadStart
				 * @param {file} file 从本地读入的文件
				 */
				'uploadStart' : null,
				/** 
				 * @event 
				 * @description 上传中断时出触发
				 * @name uploadAbort
				 * @param {file} file 从本地读入的文件
				 */
				'uploadAbort' : null, 
				/** 
				 * @event 
				 * @description 上传过程中触发
				 * @name uploadProgress
				 * @param {file} file 从本地读入的文件
				 */
				'uploadProgress' : null,
				/** 
				 * @event 
				 * @description 上传完成时出触发
				 * @name uploadComplete
				 * @param {file} file 从本地读入的文件
				 */
				'uploadComplete' : null,
				/** 
				 * @event 
				 * @description 上传成功时触发
				 * @name uploadSuccess
				 * @param {file} file 从本地读入的文件
				 * @param {Object|String} res 服务器返回的内容
				 */
				'uploadSuccess' : null,
				/** 
				 * @event 
				 * @description 上传出错时触发，不包括校验时出错
				 * @name uploadError
				 * @param {file} file 从本地读入的文件
				 */
				'uploadError' : null
			}			
		},
		/**
		 * @member 
		 * @name _acceptTypeList
		 * @enum {RegExp} 
		 * @description 文件类型映射
		 */
		_acceptTypeList:{
			"image":/\.(jpg|png|gif)$/i,
			"excel":/\.(xls|xlsx)$/i
		},
		/**
		 * @member 
		 * @name _errorList
		 * @enum {string} 
		 * @description 错误码映射
		 */
		_errorList:{
			101:'文件类型不符合要求',
			102:'文件大小超出限制',
			103:'图片尺寸不符合要求'
		},
		/**
		 * @function 
		 * @name init
		 * @description 上传工具实例化入口
		 * @param {Object} setting 初始化参数
		 * @param {String} setting.Debug 是否开启调试模式，调试模式会在控制台打印日志
		 * @param {String} setting.id   实例id
		 * @param {String} setting.uploadUrl 上传路径
		 * @param {String|jQuery|Document} setting.picker 指定选择文件的按钮容器,可以是选择器，也可以是dom元素或jquery元素
		 * @param {Boolean} setting.auto 读取文件后是否自动开始上传，默认自动上传
		 * @param {String} setting.responseType [json|xml|text] 返回数据的数据类型,默认json
		 * @param {String} setting.acceptType [excel|html|image|zip|xml]  允许上传的文件类型，默认不做限制,字符串或者字符串数组
		 * @param {Object} setting.data 上传过程中携带的参数
		 * @param {Number} setting.sizeLimit 上传文件大小限制，默认不限制 单位是k
		 * @param {Number} setting.widthLimit 上传文件的宽度限制,仅在上传文件类型为图片的情况下生效，单位px
		 * @param {Number} setting.heightLimit 上传文件的高度限制,仅在上传文件类型为图片的情况下生效，单位px
		 * @param {Object} setting.events 上传过程中的事件
		 * @param {Function} setting.events.beforeFileQueued 在文件被加入读入内存前触发
		 * @param {Function} setting.events.error 校验出错触发
		 * @param {Function} setting.events.fileQueued 在文件准备上传时触发
		 * @param {Function} setting.events.uploadStart 在开始上传时触发
		 * @param {Function} setting.events.uploadAbort 上传中断时出触发
		 * @param {Function} setting.events.uploadProgress 上传过程中触发
		 * @param {Function} setting.events.uploadComplete 上传完成时出触发
		 * @param {Function} setting.events.uploadSuccess 上传成功时触发
		 * @param {Function} setting.events.uploadError 出错时触发，上传过程中出错
		 */
		init : function(setting){
			if(!$){//校验jQuery是否存在,如果不存在，就报错并终止后面代码的执行
				this.error('jquery is undefined,请引入jQuery文件');
				return false;
			}
			
			if(!FileReader || !FormData){//校验FileReader是否可用，否则，就报错并终止后面代码的执行
				this.error('FileReader&FormData is unavailable,请检查浏览器版本');
				return false;
			}
			
			$.extend(this,this._defaults,setting);
			this._createUpLoader();
			this._bindEvents();	
		},
		/**
		 * @function 
		 * @name _createUpLoader
		 * @description 创建uploader实例
		 */
		_createUpLoader:function(){
			var _this = this;
			//如果选择文件的容器不是jQuery对象，统一转换成jQuery对象
			if( typeof _this.picker === 'string' || !(_this.picker instanceof jQuery)){
				_this.picker = $(_this.picker);
			}
			//确定选择文件的input
			if(_this.picker.is(':file')){
				_this.fileInput = _this.picker;
			} else if(_this.picker.find(':file').length) {
				_this.fileInput = _this.picker.find(':file');
			} else {
				_this.fileInput = $('<input type="file"/>');
				_this.picker.append(_this.fileInput);
			}
			
			
			var timestamp = new Date();
			_this.id = _this.id +'_' + timestamp.getTime().toString().slice(-4,-1);
			_this.fileInput.attr('id',_this.id)
			               .addClass(_this.inputClass);
			if(!_this.picker.find('label[for='+_this.id+']').length){
				_this.label = $('<label></label>').attr("for",_this.id);
				_this.fileInput.before(_this.label);
			}else{
				_this.label = _this.picker.find('label[for='+_this.id+']')
			}
			_this.label.addClass(_this.labelClass);
			//初始化变量对象
			_this.fr = new FileReader();
			_this.xhr = new XMLHttpRequest();
			_this.formatData = new FormData();			
		},
		/**
		 * @function 
		 * @name reset
		 * @description 重置上传实例
		 */
		reset : function(){
			var _this = this;
			//清除已实例对象
			_this.destory();
			//重新实例化
			_this.fr = new FileReader();
			_this.xhr = new XMLHttpRequest();
			_this.formatData = new FormData();
			_this.fileInput = _this.picker.find('input:file');
			_this.fileInput.attr('id',_this.id)
			               .addClass(_this.inputClass);
			_this._bindEvents();
		},
		/**
		 * @function 
		 * @name destory
		 * @description 销毁上传实例
		 */
		destory:function(){
			var _this = this;
			_this.fr = null;
			_this.xhr = null;
			_this.formatData = null;
			_this.fileInput.replaceWith('<input type="file"/>');
		},
		/**
		 * @function upload
		 * @description 开始上传，仅在auto为false时生效
		 */
		upload : function(){
			var _this = this;
			_this.xhr.open("POST", _this.uploadUrl, true);
			_this.formatData.append('file', _this.file);
            _this.xhr.send(_this.formatData);
		},
		/**
		 * @function 
		 * @name error
		 * @description 报错函数
		 * @param {Number} code 错误码 详见错误码列表
		 * @param {String} info 错误信息
		 */
		error : function(code,info){
			if(this._errorList[code]){
				this._log(this._errorList[code],2);
				this._executeEvents('error',this.file,{code:code,msg:this._errorList[code]});
			}else{
				this._log(code,2);
				this._executeEvents('error',this.file,{code:code,msg:"上传失败"});
			}
			
		},
		/**
		 * @function 
		 * @name _log
		 * @description 本地日志打印,调试模式开启时在控制台打印日志
		 * @param {String} text 需要打印的日志内容 
		 * @param {Number}[level=0] level 日志级别，选填，默认为0，
		 */
		_log : function(text,level){
			var _this = this;
			if(_this.Debug === false){//调试模式关闭时不打印日志
				return;
			}else{
				level = level || 0;
				switch(level){
					case 0://正常的info日志
						console.log(text);
						break;
					case 1://警告日志
						console.warn(text);
						break;
					case 2://错误日志
						console.error(text);
						break;
					default:
						console.log(text);
				}
			}
		},
		/**
		 * @function 
		 * @name _valiate
		 * @decription 验证文件是否符合要求
		 * @param {Object} file
		 * @param {Function} callback 回调函数
		 */
		_validate:function(file,result,callback){
			var _this = this;
			var fileName = file.name;
			var size = file.size;
			_this._log('文件名：' + fileName);
			_this._log('上传文件大小：' + size);
			/**验证文件类型*/
			if(_this.acceptType && _this._acceptTypeList[_this.acceptType]){
				if(!_this._acceptTypeList[_this.acceptType].test(fileName)){
					_this.error(101);
					callback(false);
					return;
				}
			}
			/**验证文件大小*/
			if(_this.sizeLimit && _this.sizeLimit < size){
				_this.error(102);
				callback(false)
				return;
			}
			/**校验图片尺寸*/
			if(_this.acceptType === 'image' && (!isNaN(_this.heightLimit)||!isNaN(_this.widthLimit))){
				_this._checkImage(result,callback);
				return;
			}else{
				callback(true)
			}
		},
		/**
		 * @function 
		 * @name _checkImage
		 * @description 核对图片尺寸
		 * @param {Object} result
		 * @return {Boolean}
		 */
		_checkImage:function(result,callback){
			var _this = this;
			var img = new Image();
			img.onload = function(){
				if(img.width && _this.widthLimit && img.width != _this.widthLimit) {
					_this.error(103);
					callback(false)
				} else if(img.height && _this.heightLimit && img.height != _this.heightLimit) {
					_this.error(103);
					callback(false);
				} else {
					callback(true);
				}
			}
			img.src = result;			
		},
		/**
		 * @function
		 * @name _bindEvents
		 * @description 上传组件事件绑定
		 */
		_bindEvents : function(){
			var _this = this;
			/**
			 * 选文件按钮hover事件
			 */
			_this.label.off('hover').hover(function(){
				_this.picker.find('.fileUploader-pick').addClass('fileUploader-pick-hover');
			},function(){
				_this.picker.find('.fileUploader-pick').removeClass('fileUploader-pick-hover');
			})
			/**
			 * fileInput载入文件时触发的时间
			 */
			_this.fileInput.off("change").on('change',function(){
				var files = this.files;
				if(files.length == 1){
					_this._fileHandler(files[0]);
				}
			})
			/**
			 * FileReader当文件被读入成功成功时触发
			 */
			_this.fr.onload = function (e) {
          		var validate = _this._validate(_this.file,this.result,function(isReady){
          			if(_this._executeEvents('beforeFileQueued',_this.file) !== false && isReady){
          				_this._executeEvents('fileQueued',_this.file,function(r){
          					if(r){
          						if(_this.auto){
          							_this.upload();
          						}          						
          					}else{
          						_this.reset();
          					}
          				})
          			}else{
  						_this.reset();
  					}
          		});
           	};
           	/**
			 * 当上传成功后触发
			 */           	
           	_this.xhr.onreadystatechange = function (e) {
                if (_this.xhr.readyState == 4 && _this.xhr.status == 200) {
                	if(_this.responseType == 'json'){
                		_this._executeEvents('uploadSuccess',_this.file,JSON.parse(_this.xhr.responseText));
                	}else{
                		_this._executeEvents('uploadSuccess',_this.file,_this.xhr.responseText);
                	}
                }
            };
            /**
			 * FileReader当文件被读入中断时触发
			 */
           	_this.fr.onabort = function(e){
           		_this._executeEvents('uploadError',_this.file,e);
           	}
           	_this.fr.onerror = function(e){
           		_this._executeEvents('uploadError',_this.file,e);
           	}
           	/**
			 * 当文件上传服务器中断时触发
			 */
           	_this.xhr.upload.onabort = function(e){
           		_this._executeEvents('uploadAbort',_this.file,e);
           		_this._executeEvents('uploadError',_this.file,e);
           	}
           	/**
			 * 当文件上传服务器出错时触发
			 */
           	_this.xhr.upload.onerror = function(e){
           		_this._executeEvents('uploadError',_this.file,e);
           	}
           	/**
			 *  当文件上传服务器完成时触发
			 */
           	_this.xhr.upload.onload = function(e){
           		_this._executeEvents('uploadComplete',_this.file,e);
           	}
           	/**
			 *  当文件上传服务器过程中触发
			 */
           	_this.xhr.upload.onprogress = function(e){
           		_this._executeEvents('uploadProgress',_this.file,e);
           	}            		
		},
		/**
		 * @function
		 * @name _fileHander 
		 * @description 用fileReader对文件处理
		 * @param {File} file 从input上读入的文件
		 */
		_fileHandler:function(file){
			var _this = this;
			_this.file = file;
			_this.fr.readAsDataURL(file);
		},
		/**
		 * @function
		 * @name _executeEvents
		 * @description 手动触发绑定过的事件，类似于trigger
		 * @param {String} eventName 事件名称
		 * @param {Object} file 当前的文件
		 * @param {Object|Function} opts 其他数据或回调函数
		 */
		_executeEvents:function(eventName,file,opts){
			var _this = this;
			if(typeof _this.events[eventName] == 'function'){
				if(typeof opts == 'function') opts( _this.events[eventName](file));
				return _this.events[eventName](file,opts);
			}else{
				if(typeof opts == 'function') opts(true);
				return true;
			}
		}		
	}
	module.exports = FileUploader;
})