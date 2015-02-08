# Use Fastest Ubuntu Mirror  
[![Build Status](https://travis-ci.org/fredmwangi/ufum.svg?branch=master)](https://travis-ci.org/fredmwangi/ufum)

Hacked the code from [ffum](https://www.npmjs.com/package/ffum) and just
added the extra step of replacing the old mirror with the new in
/etc/apt/sources.list

This package assumes that your previous mirror information is at the top
of sources.list, beginning with the very first line. Like this:

![Screenshot](https://raw.githubusercontent.com/fredmwangi/ufum/master/screenshot.png)

## Install
	sudo npm install -g ufum

## Run
	ufum
