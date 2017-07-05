<a name="module_FileUploader"></a>

## FileUploader
基于html5的文件上传插件

**Version**: 0.0.1  
**Author**: zhangxu <zhangxu0413@139.com>  

* [FileUploader](#module_FileUploader)
    * [~FileUploader](#module_FileUploader..FileUploader)
        * [new FileUploader(settings)](#new_module_FileUploader..FileUploader_new)
    * [~_defaults](#module_FileUploader.._defaults) : <code>Object</code>
    * [~_acceptTypeList](#module_FileUploader.._acceptTypeList) : <code>enum</code>
    * [~_errorList](#module_FileUploader.._errorList) : <code>enum</code>
    * [~init(setting)](#module_FileUploader..init)
    * [~_createUpLoader()](#module_FileUploader.._createUpLoader)
    * [~reset()](#module_FileUploader..reset)
    * [~destory()](#module_FileUploader..destory)
    * [~upload()](#module_FileUploader..upload)
    * [~error(code, info)](#module_FileUploader..error)
    * [~_log(text, [level])](#module_FileUploader.._log)
    * [~_valiate(file, callback)](#module_FileUploader.._valiate)
    * [~_checkImage(result)](#module_FileUploader.._checkImage) ⇒ <code>Boolean</code>
    * [~_bindEvents()](#module_FileUploader.._bindEvents)
    * [~_fileHander(file)](#module_FileUploader.._fileHander)
    * [~_executeEvents(eventName, file, opts)](#module_FileUploader.._executeEvents)
    * ["beforeFileQueued" (file)](#event_beforeFileQueued)
    * ["error" (file, data)](#event_error)
    * ["fileQueued" (file)](#event_fileQueued)
    * ["uploadStart" (file)](#event_uploadStart)
    * ["uploadAbort" (file)](#event_uploadAbort)
    * ["uploadProgress" (file)](#event_uploadProgress)
    * ["uploadComplete" (file)](#event_uploadComplete)
    * ["uploadSuccess" (file, res)](#event_uploadSuccess)
    * ["uploadError" (file)](#event_uploadError)

<a name="module_FileUploader..FileUploader"></a>

### FileUploader~FileUploader
文件上传工具构建类

**Kind**: inner class of [<code>FileUploader</code>](#module_FileUploader)  
<a name="new_module_FileUploader..FileUploader_new"></a>

#### new FileUploader(settings)

| Param | Type | Description |
| --- | --- | --- |
| settings | <code>Object</code> | 初始化参数集 |

<a name="module_FileUploader.._defaults"></a>

### FileUploader~_defaults : <code>Object</code>
默认参数配置

**Kind**: inner property of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader.._acceptTypeList"></a>

### FileUploader~_acceptTypeList : <code>enum</code>
文件类型映射

**Kind**: inner enum of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader.._errorList"></a>

### FileUploader~_errorList : <code>enum</code>
错误码映射

**Kind**: inner enum of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader..init"></a>

### FileUploader~init(setting)
上传工具实例化入口

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| setting | <code>Object</code> | 初始化参数 |
| setting.Debug | <code>String</code> | 是否开启调试模式，调试模式会在控制台打印日志 |
| setting.id | <code>String</code> | 实例id |
| setting.uploadUrl | <code>String</code> | 上传路径 |
| setting.picker | <code>String</code> \| <code>jQuery</code> \| <code>Document</code> | 指定选择文件的按钮容器,可以是选择器，也可以是dom元素或jquery元素 |
| setting.auto | <code>Boolean</code> | 读取文件后是否自动开始上传，默认自动上传 |
| setting.responseType | <code>String</code> | [json|xml|text] 返回数据的数据类型,默认json |
| setting.acceptType | <code>String</code> | [excel|html|image|zip|xml]  允许上传的文件类型，默认不做限制,字符串或者字符串数组 |
| setting.data | <code>Object</code> | 上传过程中携带的参数 |
| setting.sizeLimit | <code>Number</code> | 上传文件大小限制，默认不限制 单位是k |
| setting.widthLimit | <code>Number</code> | 上传文件的宽度限制,仅在上传文件类型为图片的情况下生效，单位px |
| setting.heightLimit | <code>Number</code> | 上传文件的高度限制,仅在上传文件类型为图片的情况下生效，单位px |
| setting.events | <code>Object</code> | 上传过程中的事件 |
| setting.events.beforeFileQueued | <code>function</code> | 在文件被加入读入内存前触发 |
| setting.events.error | <code>function</code> | 校验出错触发 |
| setting.events.fileQueued | <code>function</code> | 在文件准备上传时触发 |
| setting.events.uploadStart | <code>function</code> | 在开始上传时触发 |
| setting.events.uploadAbort | <code>function</code> | 上传中断时出触发 |
| setting.events.uploadProgress | <code>function</code> | 上传过程中触发 |
| setting.events.uploadComplete | <code>function</code> | 上传完成时出触发 |
| setting.events.uploadSuccess | <code>function</code> | 上传成功时触发 |
| setting.events.uploadError | <code>function</code> | 出错时触发，上传过程中出错 |

<a name="module_FileUploader.._createUpLoader"></a>

### FileUploader~_createUpLoader()
创建uploader实例

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader..reset"></a>

### FileUploader~reset()
重置上传实例

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader..destory"></a>

### FileUploader~destory()
销毁上传实例

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader..upload"></a>

### FileUploader~upload()
开始上传，仅在auto为false时生效

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader..error"></a>

### FileUploader~error(code, info)
报错函数

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>Number</code> | 错误码 详见错误码列表 |
| info | <code>String</code> | 错误信息 |

<a name="module_FileUploader.._log"></a>

### FileUploader~_log(text, [level])
本地日志打印,调试模式开启时在控制台打印日志

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| text | <code>String</code> |  | 需要打印的日志内容 |
| [level] | <code>Number</code> | <code>0</code> | level 日志级别，选填，默认为0， |

<a name="module_FileUploader.._valiate"></a>

### FileUploader~_valiate(file, callback)
**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
**Decription**: 验证文件是否符合要求  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>Object</code> |  |
| callback | <code>function</code> | 回调函数 |

<a name="module_FileUploader.._checkImage"></a>

### FileUploader~_checkImage(result) ⇒ <code>Boolean</code>
核对图片尺寸

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type |
| --- | --- |
| result | <code>Object</code> | 

<a name="module_FileUploader.._bindEvents"></a>

### FileUploader~_bindEvents()
上传组件事件绑定

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  
<a name="module_FileUploader.._fileHander"></a>

### FileUploader~_fileHander(file)
用fileReader对文件处理

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>File</code> | 从input上读入的文件 |

<a name="module_FileUploader.._executeEvents"></a>

### FileUploader~_executeEvents(eventName, file, opts)
手动触发绑定过的事件，类似于trigger

**Kind**: inner method of [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>String</code> | 事件名称 |
| file | <code>Object</code> | 当前的文件 |
| opts | <code>Object</code> \| <code>function</code> | 其他数据或回调函数 |

<a name="event_beforeFileQueued"></a>

### "beforeFileQueued" (file)
在文件被加入读入内存前触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_error"></a>

### "error" (file, data)
校验出错触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |
| data | <code>Object</code> | 错误对象 |
| data.code | <code>number</code> | 错误码,[member:_errorList](member:_errorList) |
| data.msg | <code>string</code> | 错误文案 |

<a name="event_fileQueued"></a>

### "fileQueued" (file)
在文件准备上传时触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_uploadStart"></a>

### "uploadStart" (file)
在开始上传时触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_uploadAbort"></a>

### "uploadAbort" (file)
上传中断时出触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_uploadProgress"></a>

### "uploadProgress" (file)
上传过程中触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_uploadComplete"></a>

### "uploadComplete" (file)
上传完成时出触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

<a name="event_uploadSuccess"></a>

### "uploadSuccess" (file, res)
上传成功时触发

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |
| res | <code>Object</code> \| <code>String</code> | 服务器返回的内容 |

<a name="event_uploadError"></a>

### "uploadError" (file)
上传出错时触发，不包括校验时出错

**Kind**: event emitted by [<code>FileUploader</code>](#module_FileUploader)  

| Param | Type | Description |
| --- | --- | --- |
| file | <code>file</code> | 从本地读入的文件 |

