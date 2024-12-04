from panic_button import PanicButton
from alpenhunde import Alpenhunde

alpenhunde = Alpenhunde()

def panic_button_pressed(arg):
    alpenhunde.stop_all_running()
    print("Panic button pressed")

panic_button = PanicButton(21, panic_button_pressed)


while True:
    alpenhunde.run()