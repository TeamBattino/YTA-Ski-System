from panic_button import PanicButton
from alpenhunde import Alpenhunde
from UI import AlpenhundeUI
from dotenv import load_dotenv
from alpenhundeWS import AlpenhundeWS
import os
from queue import Queue
from threading import Thread, Event
from global_types import StateMachine, StateMachineState, User
from api import ApiClient
import time
import socket
import requests
import threading

""" INITIALIZATION """
def is_web_reachable(url, timeout=3):
    """Checks if a web address is reachable by making an HTTP GET request."""
    try:
        response = requests.get(url, timeout=timeout)
        return response.status_code == 200
    except requests.RequestException:
        return False

target_url = "http://192.168.4.1"

while not is_web_reachable(target_url):
    print(f"Waiting for URL {target_url} to be reachable...")
    os.system('espeak -a 400 "Waiting for internet connection"')
    time.sleep(5)
os.system('espeak -a 400 "Internet connection established. Resetting..."')
print("URL is reachable!")
requests.post(f"{target_url}/system/?action=full_reset")
while not is_web_reachable(target_url):
    print(f"Resetting, so {target_url} to is unreachable...")
    os.system('espeak -a 400 "resetting"')
    time.sleep(5)
os.system('espeak -a 400 "Reset was successful"')

""" Environment variables here """
load_dotenv()
ENV_PANIC_BUTTON_PIN = int(os.getenv("PANIC_BUTTON_PIN"))
ENV_API_URL = os.getenv("API_DOMAIN")    
ENV_AUTH_SECRET = os.getenv("AUTH_SECRET")

""" Shared state variables here """
state_machine = StateMachine(StateMachineState.IDLE, -1, User("", ""), False, False, User("",""))

""" Threads created here """
panic_event = Event()
def run_panic_button():
    PanicButton(ENV_PANIC_BUTTON_PIN, lambda pin: panic_event.set())

panic_thread = Thread(target=run_panic_button, daemon=True)
panic_thread.start()

message_queue = Queue(maxsize=1)
websocket_thread = Thread(target=AlpenhundeWS(message_queue).connect_websocket, daemon=True)
websocket_thread.start()

alpenhunde_update_event = Event()
alpenhunde_silent_update_event = Event()
race_finished_event = Event()
def run_alpenhunde():
    Alpenhunde(alpenhunde_update_event, alpenhunde_silent_update_event, race_finished_event,  state_machine).run()

alpenhunde_thread = Thread(target=run_alpenhunde, daemon=True)
alpenhunde_thread.start()

""" Main thread Functions here """
api = ApiClient(ENV_API_URL)

cancel_timer = None
last_call_time = 0
DEBOUNCE_INTERVAL = 1.0  # seconds

def transition_if_still_cancelling():
    """Timer callback: only moves to RUNNING if nothing else changed the state."""
    if state_machine.current_state == StateMachineState.CANCELLING:
        state_machine.current_state = StateMachineState.RUNNING

def panic_button_call():
    global cancel_timer, last_call_time
    
    current_time = time.time()
    
    if current_time - last_call_time < DEBOUNCE_INTERVAL:
        return 
    
    last_call_time = current_time

    if state_machine.current_state == StateMachineState.CANCELLING:
        if cancel_timer:
            cancel_timer.cancel()
        
        state_machine.current_state = StateMachineState.IDLE
        os.system('espeak -a 400 "RESET RACER" &')
        
    else:
        state_machine.current_state = StateMachineState.CANCELLING
        
        cancel_timer = threading.Timer(5.0, transition_if_still_cancelling)
        cancel_timer.start()

def update_user():
    next_user = None
    if state_machine.current_state == StateMachineState.RUNNING:
        next_user = api.getUser(state_machine.next_user.rfid)
    else:
        user = api.getUser(state_machine.user.rfid)
    if(next_user):
        state_machine.next_user = next_user
    else:
        state_machine.user = user
        state_machine.next_user = User("","")

user_update_event = Event()
ui = AlpenhundeUI(state_machine, user_update_event)
""" Main thread Loop here """
while True:
    ui.update_state()
    if user_update_event.is_set():
        alpenhunde_update_event.set()
        state_machine.loading = True
        ui.update_state()
        update_user()
        state_machine.loading = False
        if state_machine.next_user.rfid == "":
            state_machine.current_state = StateMachineState.REGISTERED
        user_update_event.clear()
    if not message_queue.empty():
        message = message_queue.get()
        match message:
            case "UpdateAlpenhunde":
                print("Update Alpenhunde")
                alpenhunde_update_event.set()
                state_machine.connection_issues = False
            case "WSConnected":
                print("WebSocket connected")
                state_machine.connection_issues = False
            case "WSError":
                print("WebSocket error")
                state_machine.connection_issues = True
                os.system('espeak -a 400 "Websocket disconnect detected. Reconnecting"')
            case "WSClosed":
                print("WebSocket closed")
            case _:
                print("Unknown message")
        message_queue.task_done()
    if race_finished_event.is_set():
        state_machine.loading = True
        ui.update_state()
        api.postRace(state_machine.user.rfid, state_machine.last_race_time)
        if state_machine.next_user.rfid != "":
            state_machine.user = state_machine.next_user
            state_machine.next_user = User("","")
            state_machine.current_state = StateMachineState.REGISTERED
        state_machine.loading = False
        race_finished_event.clear()
    if panic_event.is_set():
        panic_button_call()
        panic_event.clear()
