import { src, dest, watch, parallel, series } from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean';
import newer from 'gulp-newer';
import imagemin from 'gulp-imagemin';
import avif from 'gulp-avif';
import webp from 'gulp-webp';
import svgSprite from 'gulp-svg-sprite';
import include from 'gulp-include';

const scss = gulpSass(dartSass);
const sync = browserSync.create();
const build = series(cleanDist, building);

function pages() {
	return src('app/pages/*.html')
		.pipe(include({
			includePaths: 'app/components'
		}))
		.pipe(dest('app'))
		.pipe(sync.stream())
}

function images() {
	return src(['app/images/src/**/*.*', '!app/images/src/**/*.svg'], { encoding: false })
		.pipe(newer('app/images'))
		.pipe(imagemin())
		.pipe(dest('app/images'))

		.pipe(newer('app/images/**/*.avif'))
		.pipe(avif({ quality: 50 }))
		.pipe(dest('app/images'))
}

function converttowebp() {
	return src('app/images/src/**/*.*', { encoding: false })
		.pipe(newer('app/images/**/*.webp'))
		.pipe(webp())
		.pipe(dest('app/images'))
}

function sprite() {
	return src('app/images/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					example: true
				}
			}
		}))
		.pipe(dest('app/images'))
}

function scripts() {
	return src([
		'app/js/main.js',
	])
		.pipe(concat('main.min.js'))
		.pipe(terser())
		.pipe(dest('app/js'))
		.pipe(sync.stream())
}

function styles() {
	return src('app/scss/style.scss')
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions']
		}))
		.pipe(concat('style.min.css'))
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(dest('app/css'))
		.pipe(sync.stream())
}

function watching() {
	sync.init({
		server: {
			baseDir: "app/"
		}
	});
	watch(['app/scss/*.scss'], styles)
	watch(['app/images/src'], images)
	watch(['app/js/main.js'], scripts)
	watch(['app/components/*', 'app/pages/*'], pages)
	watch(['app/*.html']).on('change', sync.reload)
}

function cleanDist() {
	return src('dist')
		.pipe(clean())
}
function building() {
	return src([
		'app/css/style.min.css',
		'app/images/*.*',
		'!app/images/*.svg',
		'app/images/sprite.svg',
		'app/fonts/*.*',
		'app/js/main.min.js',
		'app/**/*.html'
	], { base: 'app' })
		.pipe(dest('dist'))
}

export { styles, images, converttowebp, pages, sprite, scripts, watching, build };

export default parallel(styles, images, converttowebp, scripts, pages, watching);