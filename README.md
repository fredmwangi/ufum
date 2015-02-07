# Use Fastest Ubuntu Mirror

Hacked the code from [ffum](https://www.npmjs.com/package/ffum) and just
added the extra step of replacing the old mirror with the new in
/etc/apt/sources.list

This package assumes that your previous mirror information is at the top
of sources.list, beginning with the very first line.

## Install
	sudo npm install -g ufum

## Run
	ufum
