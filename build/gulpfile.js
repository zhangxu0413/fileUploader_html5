var gulp = require('gulp'),
    clean = require('gulp-clean'),
    cleanCSS = require('gulp-clean-css'),   // css压缩 
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),    // 合并文件
    uglify = require('gulp-uglify'),    // js压缩
    transport = require("gulp-seajs-transport") ;

var baseUrl = '../src/';
var dist = '../dist/';
gulp.task('docs2md',function(){
	const fs = require('fs');
    const jsdoc2md = require('jsdoc-to-markdown')
	const output = jsdoc2md.renderSync({files:baseUrl+'*.js'});
	fs.writeFileSync('../readme.md', output)
})
gulp.task('css',function(){
	 gulp.src(baseUrl+'*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest(dist));
})
gulp.task('js',function(){
	 gulp.src(baseUrl+'*.js')
        .pipe(transport())
        .pipe(uglify({}))
        .pipe(gulp.dest(dist));
     gulp.src(baseUrl+'*.js')
     	.pipe(rename(function(path){
     		path.basename +='.debug'
     	}))
     	.pipe(uglify({
     		mangle: false,//类型：Boolean 默认：true 是否修改变量名
            compress: false,//类型：Boolean 默认：true 是否完全压缩
            preserveComments:false
     	}))
        .pipe(gulp.dest(dist));
})
gulp.task('default',['docs2md','css','js'],function(){})