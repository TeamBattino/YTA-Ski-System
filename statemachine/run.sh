#!/bin/bash
/usr/bin/unclutter -idle 0.1 -root &
source /home/pi/Documents/YTA-Ski-System/statemachine/.venv/bin/activate
/home/pi/Documents/YTA-Ski-System/statemachine/.venv/bin/python3 /home/pi/Documents/YTA-Ski-System/statemachine/main.py
