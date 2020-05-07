"use strict";
import { src, dest, series, parallel } from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import uglify from 'gulp-uglify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import concat from 'gulp-concat';
import clean from 'gulp-clean';
import plumber from 'gulp-plumber';
import watch from 'gulp-watch';
import maps from 'gulp-sourcemaps';
import sass from 'gulp-sass';
import minify from 'gulp-minify-css';
import log from 'fancy-log';
import glob from 'glob';
import fs from 'fs';
import livereload from 'livereload';
import livereloadMiddleware from 'connect-livereload';
//import https from 'https';
import http from 'http';
import mime from 'mime';
import connect from 'connect';
import path from 'path';
import globify from 'require-globify';
import transformTools from 'browserify-transform-tools';

const isProduction = (process.env.NODE_ENV || 'development') == 'production';
const endpoint = { host: 'localhost', port: 8088, livereloadPort: 35729 };
const sources = {
  dir: 'src',
  scripts: 'src/**/*.js',
  templates: 'src/components/**/*.html',
  styles: 'src/components/**/*.scss',
  static: 'src/static/**/*'
};
const dist = {
    dir: 'dist',
    static: 'static',
    js: 'app.js',
    styles: 'app.css',
    index: 'index.html'
};

//Remove the /dist directory
const cleanDist = () => 
    src(dist.dir, {read: false, allowEmpty: true})
    .pipe(clean())
    .pipe(dest('.'));

const integrateTemplate = transformTools.makeStringTransform("integrateTemplate", {},
function (content, transformOptions, done) {
    var file = transformOptions.file;

    if (!content.includes('@component') || content.includes('@template')) {
        done(null, content);
        return;
    }

    const templateFilename = file.replace(/js$/, 'html');
    if (!fs.existsSync(templateFilename)) {
        return done(new Error(`Component '${file}' must have an .html template`));
    }
    const template = JSON.stringify(fs.readFileSync(file.replace(/js$/, 'html'), { encoding: 'utf8' }).toString());
    content = content.replace(/@component/g, `import {template as __TemplateDecorator} from 'services/decorators'; @__TemplateDecorator(${template}) @component`);
    done(null, content);
});

//Bundle all js files to a single app.js file
const buildComponents = () => {
    let task = browserify({
        entries: glob.sync(sources.scripts),
        debug: !isProduction
    })
    .transform(integrateTemplate)
    .transform(babelify.configure({
        presets : [["@babel/preset-env", { useBuiltIns: "entry", targets: { ie: 11 }, corejs: 3 } ]],
        sourceMaps: !isProduction,
    }))
    .transform(globify)
    .bundle()
    .pipe(source(dist.js))
    .pipe(buffer());
    if (!isProduction) {
        task = task.pipe(maps.init({loadMaps: true}));
    }
    if (isProduction) {
        task = task.pipe(uglify({ mangle: isProduction }));
    }
    if (!isProduction)
    {
        task = task.pipe(maps.write('.', { sourceRoot: '..' }));
    }
    task = task.pipe(dest(dist.dir));
    return task;
};

const buildStyles = () =>
src(sources.styles)
.pipe(plumber())
.pipe(sass())
.pipe(concat(dist.styles))
.pipe(minify())
.pipe(dest(dist.dir));

//Just log completion
const logCompletion = done => {
    log.info('Finished processing');
    done();
};

const logServe = done => {
    log.info(`Server is listening at http://${endpoint.host}:${endpoint.port}`);
    done();
};

const spaMiddleware = (request, response, next) => {
    const url = new URL(request.url, `http://${endpoint.host}:${endpoint.port}`);
    const requestedFilePath = path.join(__dirname, dist.dir, url.pathname);
    const indexFilePath = path.join(__dirname, dist.dir, dist.index);

    if (!url.pathname || url.pathname == '/' || !fs.existsSync(requestedFilePath)) {
        response.writeHead(200, { 'Content-Type' : 'text/html', 'Max-Age': 0 });
        response.end(fs.readFileSync(indexFilePath));
    } else {
        response.writeHead(200, { 'Content-Type': mime.getType(url.pathname), 'Max-Age': 0 });
        response.end(fs.readFileSync(requestedFilePath));
    }
    next();
};

const copyStatic = () => 
    src(sources.static)
    .pipe(plumber())
    .pipe(dest(dist.dir));

//Run the server
const listen = done => {
    const app = connect();
    if (!isProduction) {
        app.use(livereloadMiddleware({ port: endpoint.livereloadPort }));
    }
    app.use(spaMiddleware);
    
    const options = {
        //key: fs.readFileSync(path.join(__dirname, '.secure/certificate.key')),
        //cert: fs.readFileSync(path.join(__dirname, '.secure/certificate.crt'))
    };
    const httpServer = http.createServer(options, app);
    
    if (!isProduction) {
        watch(sources.templates, series(buildComponents)); //series here is used just to get some output from gulp
        watch(sources.scripts, series(buildComponents));
        watch(sources.styles, series(buildStyles));
        watch(sources.static, series(copyStatic));

        const livereloadServer = livereload.createServer({ port: endpoint.livereloadPort, originalPath: `http://${endpoint.host}:${endpoint.port}` });
        livereloadServer.watch(path.join(__dirname, dist.dir));
    }

    httpServer.listen(endpoint.port, endpoint.host, done);
};

//Task composition
const preBuildPhase = series(cleanDist);
const buildPhase = parallel(buildComponents, buildStyles, copyStatic);
const postBuildPhase = series(logCompletion);
const build = series(preBuildPhase, buildPhase, postBuildPhase);

exports.build = build;

const serve = series(build, listen, logServe);
exports.serve = serve;