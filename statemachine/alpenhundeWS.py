import websocket
import time
from queue import Queue

class AlpenhundeWS:
    def __init__(self, message_queue: Queue):
        self.message_queue = message_queue
        self.last_update_time = 0
        self.update_cooldown = 0.5  # Check every 0.5 seconds to catch race finish

    def on_error(self, ws, error):
        print(error)
        self.message_queue.put("WSError")

    def on_close(self, ws, close_status_code, close_msg):
        self.message_queue.put("WSClosed")

    def on_open(self, ws):
        print("WebSocket connection opened")

    def on_message(self, ws, message):
        # Rate-limit updates to prevent spam
        current_time = time.time()
        if current_time - self.last_update_time >= self.update_cooldown:
            self.last_update_time = current_time
            self.message_queue.put("UpdateAlpenhunde")
        # else: ignore message, too soon since last update
    
    


    def connect_websocket(self):
        websocket.enableTrace(False)  # Disable verbose logging
        websocket.setdefaulttimeout(5)
        ws = websocket.WebSocketApp(
            "ws://192.168.4.1/ws/events",
            on_message=self.on_message,
            on_error=self.on_error,
            on_close=self.on_close,
            on_open=self.on_open,
        ) 
        ws.run_forever(ping_interval=5, ping_timeout=3, reconnect=5)
