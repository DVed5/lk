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
	return src('docs/pages/*.html')
		.pipe(include({
			includePaths: 'docs/components'
		}))
		.pipe(dest('docs'))
		.pipe(sync.stream())
}

function images() {
	return src(['docs/images/src/**/*.{png,jpg,jpeg,gif}', '!docs/images/src/**/*.svg'], { encoding: false })
		.pipe(newer('docs/images'))
		.pipe(imagemin([
			imagemin.mozjpeg({ quality: 75, progressive: true }),
			imagemin.optipng({ optimizationLevel: 5 }),
			imagemin.gifsicle({ interlaced: true })
		]))
		.pipe(dest('docs/images'))

		.pipe(src('docs/images/src/**/*.{png,jpg,jpeg}', { passthrough: true }))
		.pipe(newer({ dest: 'docs/images', ext: '.webp' }))
		.pipe(webp())
		.pipe(dest('docs/images'));
}

function sprite() {
	return src('docs/images/**/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg',
					example: true
				}
			}
		}))
		.pipe(dest('docs/images'))
}

function scripts() {
	return src([
		'docs/js/main.js',
	])
		.pipe(concat('main.min.js'))
		.pipe(terser())
		.pipe(dest('docs/js'))
		.pipe(sync.stream())
}

function styles() {
	return src('docs/scss/style.scss')
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 10 versions']
		}))
		.pipe(concat('style.min.css'))
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(dest('docs/css'))
		.pipe(sync.stream())
}

function watching() {
	sync.init({
		server: {
			baseDir: "docs/"
		}
	});
	watch(['docs/scss/*.scss'], styles)
	watch(['docs/images/src'], images)
	watch(['docs/js/main.js'], scripts)
	watch(['docs/components/*', 'docs/pages/*'], pages)
	watch(['docs/*.html']).on('change', sync.reload)
}

function cleanDist() {
	return src('dist')
		.pipe(clean())
}
function building() {
	return src([
		'docs/css/style.min.css',
		'docs/images/*.*',
		'!docs/images/*.svg',
		'docs/images/sprite.svg',
		'docs/fonts/*.*',
		'docs/js/main.min.js',
		'docs/**/*.html'
	], { base: 'docs' })
		.pipe(dest('dist'))
}

export { styles, images, pages, sprite, scripts, watching, build };

export default parallel(styles, images, scripts, pages, watching);