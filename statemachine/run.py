import RPi.GPIO as GPIO
import requests
import time
from dataclasses import dataclass
from typing import List, Optional


""" PANIC BUTTON SETUP """
BUTTON_PIN = 21

GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN,GPIO.IN, GPIO.PUD_UP)


def callback(channel):
    print("Button pressed")

GPIO.add_event_detect(BUTTON_PIN, GPIO.RISING, callback, bouncetime=1)

""" ALPENHUNDE SETUP """


def get_race_status():
    try:
        response = requests.get("http://192.168.4.1/timing/?action=get_name_queue_and_running_times")
        response.raise_for_status()
        return response.json()    
    except requests.RequestException as e:
        print(f"Error fetching race status: {e}")
        return None

def get_race_results():
    try:
        response = requests.get("http://192.168.4.1/timing/results/")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching race results: {e}")
        return None


def is_race_running():
    response = get_race_status()
    return int(response["times"][0]["index"]) != 65535

def get_highest_timing_index(times):
    highest_index_entry = max(times, key=lambda x: int(x["i"]))
    return int(highest_index_entry["i"])

def send_post_request(url):
    try:
        response = requests.post(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error sending POST request: {e}")

def stop_all_running():
    if (is_race_running()):
        currently_running = get_race_status()["times"]
        for curr in currently_running:
            send_post_request("http://192.168.4.1/timing/?action=cancel&index=" + curr["index"])

def initValues():
    global race_running, base_index, previous_highest_index, prev_len
    times = get_race_results()["times"]
    previous_highest_index = get_highest_timing_index(times)
    prev_len = len(times)
    race_running = False


initValues()
try:
    while True:

        try:
            race_running = is_race_running()
            print(f"Race running: {race_running}")

            times = get_race_results()["times"]

            highest_index = get_highest_timing_index(times)
            print(f"Highest index: {highest_index-1}")

            if (len(times) != prev_len):
                print("New entry detected")
                print("times: ", times[len(times)-1]["t"])
                prev_len = len(times)

            if highest_index > previous_highest_index and race_running:
                print("stopping all running")
                stop_all_running()
                prev_len = len(get_race_results()["times"])
            
            previous_highest_index = highest_index

            time.sleep(1)
        except Exception as e:
            print(f"Flo made an oopsie: {e}")

finally:
    GPIO.cleanup()