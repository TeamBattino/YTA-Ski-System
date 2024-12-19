#!/bin/bash
/usr/bin/unclutter -idle 0.1 -root &
source /home/pi/YTA-Ski-System/statemachine/.venv/bin/activate
/home/pi/YTA-Ski-System/statemachine/.venv/bin/python3 /home/pi/YTA-Ski-System/statemachine/main.py
