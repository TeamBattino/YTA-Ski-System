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

load_dotenv()
ENV_PANIC_BUTTON_PIN = int(os.getenv("PANIC_BUTTON_PIN"))
ENV_API_URL = os.getenv("API_DOMAIN")    

""" Shared state variables here """
statemachne = StateMachine(StateMachineState.IDLE, -1, User("", ""), False)

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
race_finished_event = Event()
def run_alpenhunde():
    Alpenhunde(alpenhunde_update_event,race_finished_event,  statemachne).run()

alpenhunde_thread = Thread(target=run_alpenhunde, daemon=True)
alpenhunde_thread.start()

""" Main thread Functions here """
api = ApiClient(ENV_API_URL)

def panic_button_call():
    statemachne.current_state = StateMachineState.IDLE

def update_user():
    user = api.getUser(statemachne.user.rfid)
    statemachne.user = user

user_update_event = Event()
ui = AlpenhundeUI(statemachne, user_update_event)
""" Main thread Loop here """
while True:
    ui.update_state()
    if user_update_event.is_set():
        alpenhunde_update_event.set()
        statemachne.loading = True
        ui.update_state()
        update_user()
        statemachne.loading = False
        statemachne.current_state = StateMachineState.REGISTERED
        user_update_event.clear()
    if not message_queue.empty():
        message = message_queue.get()
        match message:
            case "UpdateAlpenhunde":
                print("Update Alpenhunde")
                alpenhunde_update_event.set()
            case "WSConnected":
                print("WebSocket connected")
            case "WSError":
                print("WebSocket error")
            case "WSClosed":
                print("WebSocket closed")
            case _:
                print("Unknown message")
        message_queue.task_done()
    if race_finished_event.is_set():
        statemachne.loading = True
        ui.update_state()
        api.postRace(statemachne.user.rfid, statemachne.last_race_time)
        statemachne.loading = False
        race_finished_event.clear()
    if panic_event.is_set():
        panic_button_call()
        panic_event.clear()