import websocket
import time
from queue import Queue

class AlpenhundeWS:
    def __init__(self, message_queue: Queue):
        self.message_queue = message_queue

    def on_error(self, ws, error):
        print(error)
        self.message_queue.put("WSError")

    def on_close(self, ws, close_status_code, close_msg):
        self.message_queue.put("WSClosed")

    def on_open(self, ws):
        print("WebSocket connection opened")

    def on_message(self, ws, message):
        self.message_queue.put("UpdateAlpenhunde")
    
    


    def connect_websocket(self):
        websocket.enableTrace(True)
        websocket.setdefaulttimeout(2)
        ws = websocket.WebSocketApp(
            "ws://192.168.4.1/ws/events",
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
            on_open=self.on_open,
        ) 
        ws.run_forever(ping_interval=3, ping_timeout=1, reconnect=2)
