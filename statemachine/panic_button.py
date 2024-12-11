import RPi.GPIO as GPIO


class PanicButton:
    def __init__(self, pin, callback):
        self.BUTTON_PIN = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.BUTTON_PIN, GPIO.IN, GPIO.PUD_UP)
        GPIO.add_event_detect(self.BUTTON_PIN, GPIO.RISING, callback, bouncetime=1)