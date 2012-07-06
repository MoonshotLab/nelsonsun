#!/bin/bash

matchbox-window-manager -use_titlebar no &
x11vnc -usepw -forever -shared -viewonly &
xset s off
xset -dpms
/opt/sun-pavilion/bin/sun-pavilion
