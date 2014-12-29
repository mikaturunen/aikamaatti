/**
 * Gulp usage file for the whole project. 
 * Usage cases: Compiling all the typescript files.
 */
 
"use strict";

var gulp = require("gulp");
var ts = require("gulp-typescript");
var eventStream = require("event-stream");
var jade = require("gulp-jade");
var path = require("path");
var tslint = require("gulp-tslint");
var install = require("gulp-install");
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var sequence = require('run-sequence');

// common target locations
var serverReleaseLocation = "./release/server";
var clientReleaseLocation = "./release/client";
var jadeReleaseLocation = path.join(clientReleaseLocation, "html");
var jsClientReleaseLocation = path.join(clientReleaseLocation, "js");
var jsClientTempLocation = "./tmp/client/js/";
var jsServerReleaseLocation = path.join(serverReleaseLocation);

// TYPEDEFINITION RELATED
var typeDefinitions = [];
var projectDefinitions = [ ];
var fromDefinitelyTypedServer = [
	"definitions/server.d.ts"
];
var fromDefinitelyTypedClient = [
    "definitions/client.d.ts"
];
// concantenate a set for server side compilation
var typeDefinitionsServer = fromDefinitelyTypedServer
	.concat(projectDefinitions)
	.concat([ "1.server/**/*.ts" ]);

var typeDefinitionsClient = fromDefinitelyTypedClient
    .concat(projectDefinitions)
    .concat([ "2.client/**/*.ts" ]);

// JADE RELATED
var jadeLocation = [
    "2.client/**/*.jade"
];

// TASK NAMES
var taskTslintClient = "tslint-client";
var taskTslintServer = "tslint-server";
var taskJade = "jade";
var taskTsc = "ts";
var taskTscServer = "ts-server";
var taskTscClient = "ts-client";
var taskBower = "bower";
var taskNpm = "npm";
var taskBuild = "build";
var taskUglifyJs = "uglify-js";

// List of gulp tasks. Aim is to chop the individual tasks into as small chunks as possible and allow 
// gulp and associated set of tools take care of speed.
// NOTE turn into parallel tasks where possible if speed every becomes a factor

gulp.task(taskTslintServer, function() {
    console.log("Linting Server side TS: " + JSON.stringify(typeDefinitionsServer, null, 2));
    return gulp.src(typeDefinitionsServer).pipe(tslint()).pipe(tslint.report("verbose"));
});

gulp.task(taskTslintClient, function() {
    console.log("Linting Client side TS: " + JSON.stringify(typeDefinitionsClient, null, 2));
    return gulp.src(typeDefinitionsClient).pipe(tslint()).pipe(tslint.report("verbose"));
})

gulp.task(taskJade, function() {
    console.log("Compiling jade files from locations: " + JSON.stringify(jadeLocation, null, 2));
    return gulp.src(jadeLocation).pipe(jade()).pipe(gulp.dest(jadeReleaseLocation));
});

gulp.task(taskUglifyJs, function() {
    return gulp.src(jsClientTempLocation + "**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest(jsClientReleaseLocation));
});

gulp.task(taskTscServer, function() {
    console.log("Listed definitions to add for server compilation: " + JSON.stringify(typeDefinitionsServer, null, 2));
    var tsServerResult = gulp.src(typeDefinitionsServer)
                            .pipe(ts({
                                declarationFiles: true,
                                noImplicitAny: true,
                                noExternalResolve: false,
                                removeComments: true,
                                target: "ES5",
                                module: "commonjs",
                                showErrors: true
                            }));

    return eventStream.merge(
       // tsServerResult.dts.pipe(gulp.dest('definitions/server')),
        tsServerResult.js.pipe(gulp.dest(jsServerReleaseLocation))
    );
});

gulp.task(taskTscClient, function() {
    console.log("Listed definitions to add for client compilation: " + JSON.stringify(typeDefinitionsClient, null, 2));                        
    var tsClientResult = gulp.src(typeDefinitionsClient)
                            .pipe(ts({
                                declarationFiles: true,
                                noExternalResolve: false,
                                noImplicitAny: true,
                                removeComments: true,
                                target: "ES5",
                                module: "amd",
                                showErrors: true
                            }));

    return eventStream.merge(
        tsClientResult.dts.pipe(gulp.dest('definitions/client')),
        tsClientResult.js.pipe(gulp.dest(jsClientTempLocation))
    );
});

gulp.task(taskBower, function() {
    return gulp.src(["./bower.json"]).pipe(install());
});

gulp.task(taskNpm, function() {
     return gulp.src(["./package.json"]).pipe(install());
});

gulp.task(taskBuild, function() {
    sequence(
            [ taskJade, taskTslintServer, taskTslintClient ],
            [ taskTscServer, taskTscClient ],
            taskUglifyJs
        );
});

// defining the tasks gulp runs -- in default we do basically all the tasks in one
gulp.task("default", function() {
    sequence(
            taskNpm, 
            taskBower, 
            [ taskJade, taskTslintServer, taskTslintClient ],
            [ taskTscServer, taskTscClient ],
            taskUglifyJs
        );
});