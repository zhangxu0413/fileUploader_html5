define(function(require,exports,module){var $=require("jquery");var FileUploader=function(settings){this.settings=settings;this.init(settings);return this};FileUploader.prototype={_defaults:{inputClass:"fileUploader-element-invisible",labelClass:"fileUploader-label",Debug:false,id:"fileUpLoader",uploadUrl:"",picker:"input[type=file]",auto:true,responseType:"json",acceptType:undefined,data:null,sizeLimit:undefined,widthLimit:undefined,heightLimit:undefined,events:{beforeFileQueued:null,error:null,fileQueued:null,uploadStart:null,uploadAbort:null,uploadProgress:null,uploadComplete:null,uploadSuccess:null,uploadError:null}},_acceptTypeList:{image:/\.(jpg|png|gif)$/i,excel:/\.(xls|xlsx)$/i},_errorList:{101:"文件类型不符合要求",102:"文件大小超出限制",103:"图片尺寸不符合要求"},init:function(setting){if(!$){this.error("jquery is undefined,请引入jQuery文件");return false}if(!FileReader||!FormData){this.error("FileReader&FormData is unavailable,请检查浏览器版本");return false}$.extend(this,this._defaults,setting);this._createUpLoader();this._bindEvents()},_createUpLoader:function(){var _this=this;if(typeof _this.picker==="string"||!(_this.picker instanceof jQuery)){_this.picker=$(_this.picker)}if(_this.picker.is(":file")){_this.fileInput=_this.picker}else if(_this.picker.find(":file").length){_this.fileInput=_this.picker.find(":file")}else{_this.fileInput=$('<input type="file"/>');_this.picker.append(_this.fileInput)}var timestamp=new Date;_this.id=_this.id+"_"+timestamp.getTime().toString().slice(-4,-1);_this.fileInput.attr("id",_this.id).addClass(_this.inputClass);if(!_this.picker.find("label[for="+_this.id+"]").length){_this.label=$("<label></label>").attr("for",_this.id);_this.fileInput.before(_this.label)}else{_this.label=_this.picker.find("label[for="+_this.id+"]")}_this.label.addClass(_this.labelClass);_this.fr=new FileReader;_this.xhr=new XMLHttpRequest;_this.formatData=new FormData},reset:function(){var _this=this;_this.destory();_this.fr=new FileReader;_this.xhr=new XMLHttpRequest;_this.formatData=new FormData;_this.fileInput=_this.picker.find("input:file");_this.fileInput.attr("id",_this.id).addClass(_this.inputClass);_this._bindEvents()},destory:function(){var _this=this;_this.fr=null;_this.xhr=null;_this.formatData=null;_this.fileInput.replaceWith('<input type="file"/>')},upload:function(){var _this=this;_this.xhr.open("POST",_this.uploadUrl,true);_this.formatData.append("file",_this.file);_this.xhr.send(_this.formatData)},error:function(code,info){if(this._errorList[code]){this._log(this._errorList[code],2);this._executeEvents("error",this.file,{code:code,msg:this._errorList[code]})}else{this._log(code,2);this._executeEvents("error",this.file,{code:code,msg:"上传失败"})}},_log:function(text,level){var _this=this;if(_this.Debug===false){return}else{level=level||0;switch(level){case 0:console.log(text);break;case 1:console.warn(text);break;case 2:console.error(text);break;default:console.log(text)}}},_validate:function(file,result,callback){var _this=this;var fileName=file.name;var size=file.size;_this._log("文件名："+fileName);_this._log("上传文件大小："+size);if(_this.acceptType&&_this._acceptTypeList[_this.acceptType]){if(!_this._acceptTypeList[_this.acceptType].test(fileName)){_this.error(101);callback(false);return}}if(_this.sizeLimit&&_this.sizeLimit<size){_this.error(102);callback(false);return}if(_this.acceptType==="image"&&(!isNaN(_this.heightLimit)||!isNaN(_this.widthLimit))){_this._checkImage(result,callback);return}else{callback(true)}},_checkImage:function(result,callback){var _this=this;var img=new Image;img.onload=function(){if(img.width&&_this.widthLimit&&img.width!=_this.widthLimit){_this.error(103);callback(false)}else if(img.height&&_this.heightLimit&&img.height!=_this.heightLimit){_this.error(103);callback(false)}else{callback(true)}};img.src=result},_bindEvents:function(){var _this=this;_this.label.off("hover").hover(function(){_this.picker.find(".fileUploader-pick").addClass("fileUploader-pick-hover")},function(){_this.picker.find(".fileUploader-pick").removeClass("fileUploader-pick-hover")});_this.fileInput.off("change").on("change",function(){var files=this.files;if(files.length==1){_this._fileHandler(files[0])}});_this.fr.onload=function(e){var validate=_this._validate(_this.file,this.result,function(isReady){if(_this._executeEvents("beforeFileQueued",_this.file)!==false&&isReady){_this._executeEvents("fileQueued",_this.file,function(r){if(r){if(_this.auto){_this.upload()}}else{_this.reset()}})}else{_this.reset()}})};_this.xhr.onreadystatechange=function(e){if(_this.xhr.readyState==4&&_this.xhr.status==200){if(_this.responseType=="json"){_this._executeEvents("uploadSuccess",_this.file,JSON.parse(_this.xhr.responseText))}else{_this._executeEvents("uploadSuccess",_this.file,_this.xhr.responseText)}}};_this.fr.onabort=function(e){_this._executeEvents("uploadError",_this.file,e)};_this.fr.onerror=function(e){_this._executeEvents("uploadError",_this.file,e)};_this.xhr.upload.onabort=function(e){_this._executeEvents("uploadAbort",_this.file,e);_this._executeEvents("uploadError",_this.file,e)};_this.xhr.upload.onerror=function(e){_this._executeEvents("uploadError",_this.file,e)};_this.xhr.upload.onload=function(e){_this._executeEvents("uploadComplete",_this.file,e)};_this.xhr.upload.onprogress=function(e){_this._executeEvents("uploadProgress",_this.file,e)}},_fileHandler:function(file){var _this=this;_this.file=file;_this.fr.readAsDataURL(file)},_executeEvents:function(eventName,file,opts){var _this=this;if(typeof _this.events[eventName]=="function"){if(typeof opts=="function")opts(_this.events[eventName](file));return _this.events[eventName](file,opts)}else{if(typeof opts=="function")opts(true);return true}}};module.exports=FileUploader});