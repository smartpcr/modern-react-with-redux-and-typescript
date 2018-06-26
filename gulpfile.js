'use strict';

const build = require('@microsoft/web-library-build');
const serial = build.serial;
const buildConfig = build.getConfig();
const gulp = require('gulp');
const typescript = require('typescript');
const gcbt = require('@microsoft/gulp-core-build-typescript');

// Configure TypeScript
gcbt.TypeScriptConfiguration.setTypescriptCompiler(typescript);
build.typescript.setConfig({ typescript: typescript });

build.sass.setConfig({ sassMatch: [ 'src/**/*.scss' ], dropCssFiles: true });

// process *.Example.tsx as text for examples.
build.text.setConfig({ textMatch: ['src/**/*.Example.tsx', '../**/*.Props.d.ts', '../**/*.Props.ts', '../Utilities/**/*.ts'] });

build.task('build', serial(
    build.text,
    build.sass,
    build.typescript,
    build.webpack
));

// Shortcuts for individual subtasks.
build.task('webpack', build.webpack);
build.task('tslint', build.tslint);
build.task('ts', build.typescript);



// initialize tasks.
build.initialize(gulp);
