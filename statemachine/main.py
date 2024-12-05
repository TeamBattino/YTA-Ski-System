from panic_button import PanicButton
from alpenhunde import Alpenhunde
from UI import AlpenhundeUI
import os
from websocket import create_connection
ENV_PANIC_BUTTON_PIN = int(os.environ["PANIC_BUTTON_PIN"])
ENV_API_URL = os.environ["API_URL"]


alpenhunde = Alpenhunde()
ui = AlpenhundeUI(alpenhunde)

def panic_button_pressed(arg):
    alpenhunde.last_time = -1
    alpenhunde.stop_all_running()
    print("Panic button pressed")
    ui.update_state()

panic_button = PanicButton(21, panic_button_pressed)


ws = create_connection("ws://192.168.4.1/ws/events")
try:
    while True:
        message = ws.recv()
        if message:
            alpenhunde.run()
            ui.update_state()
finally:
    ws.close()