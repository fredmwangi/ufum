#!/usr/bin/env node

var childProcess = require('child_process');
var http = require('http');
var fs = require('fs');
var readline = require('readline');

function getMirrorsList(callbackFn, errorFn) {
    var url = 'http://mirrors.ubuntu.com/mirrors.txt';

    http.get(url).on('response', function(response) {
        var content = '';

        response.on('data', function(chunk) {
            content += chunk;
        });

        response.on('end', function() {
            callbackFn(content.split(/\r?\n/));
        });
    }).on('error', function(error) {
        errorFn(error);
    });
}

function getOldMirror(callbackFn, errorFn) {
    var rd = readline.createInterface({
        input: fs.createReadStream('/etc/apt/sources.list', {
            start: 0,
            end: 120
        }),
        output: process.stdout,
        terminal: false
    });

    rd.on('line', function(line) {
        var oldMirror = "" + line.substring(4, line.length - 43);
        callbackFn(oldMirror);
    });
}

function sortByAverageResponseTime(mirrors, callbackFn) {
    var servers = [];

    function getAverageResponseTime(mirror) {
        var hostname = mirror.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1],
            command = "ping -c 5 " + hostname + " | tail -1 | awk -F '/' '{print $5}'";

        childProcess.exec(command, function(error, stdout, stderr) {
            servers.push({
                mirror: mirror,
                time: Math.round(+stdout.trim())
            });

            if (servers.length === mirrors.length) {
                servers.sort(function(a, b) {
                    return a.time - b.time;
                });

                callbackFn(servers);
            }
        });
    }

    for (var i in mirrors) {
        getAverageResponseTime(mirrors[i]);
    }
}

console.log('Downloading mirrors list...');

getMirrorsList(function(mirrors) {
    console.log('Testing download servers...');

    sortByAverageResponseTime(mirrors, function(servers) {
        var newMirror = "" + servers[0].mirror;
        newMirror = newMirror.trim();
        getOldMirror(function(oldMirror) {
            console.log('Old mirror: ' + oldMirror);
            console.log('Winner: ' + newMirror);
            oldMirror = oldMirror.trim();
            var replaceCommand = "sudo sed -i 's," + oldMirror + "," + newMirror + ",g' /etc/apt/sources.list";
            childProcess.exec(replaceCommand, function(error, stdout, stderr) {
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
        });
    });

}, function(error) {
    console.log('Connection error');
});