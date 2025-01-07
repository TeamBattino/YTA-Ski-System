import tkinter as tk
from global_types import StateMachine, StateMachineState
from threading import Event
import os

class AlpenhundeUI:
    def __init__(self, state_machine: StateMachine, user_update_event: Event):
        self.root = tk.Tk()
        self.root.title("Alpenhunde State")
        self.rfid = ""
        self.state_machine = state_machine
        self.user_update_event = user_update_event
        
        self._setup_ui()
        self._bind_events()
        self.update_state()

    def _setup_ui(self):
        self.state_text = tk.Text(self.root, font=("Helvetica", 32), height=2, bd=0, bg=self.root.cget("bg"))
        self.state_text.pack(expand=True)
        self._configure_text_tags()
        self.state_text.insert(tk.END, "State: ", "state")
        self.state_text.config(state=tk.DISABLED)
        
        self.last_time_label = tk.Label(self.root, font=("Helvetica", 20))
        self.last_time_label.pack()
        
        self.debug_log_label = tk.Label(self.root, font=("Helvetica", 12), fg="blue", anchor='ne', justify='right')
        self.debug_log_label.place(relx=1.0, rely=0.0, anchor='ne')
        
        self.root.attributes('-fullscreen', True)

    def _configure_text_tags(self):
        self.state_text.tag_configure("state", font=("Helvetica", 32))
        self.state_text.tag_configure("NOT_READY", foreground="red")
        self.state_text.tag_configure("READY", foreground="green")

    def _bind_events(self):
        self.root.bind("<Key>", self.onKeyPress)
        
    def onKeyPress(self, event: tk.Event):
        if (self.state_machine.current_state == StateMachineState.IDLE):
            self.rfid += event.char
            if event.char == '\r':
                
                os.system("espeak 'detected skee paass' &")
                clean_rfid = self.rfid.strip().lower()
                self.state_machine.user.rfid = clean_rfid
                self.rfid = ""
                self.user_update_event.set()

    def update_state(self):
        self._update_last_time_label()
        self._update_state_text()
        self.root.update()

    def _update_state_text(self):
        state, tag = self._get_state_and_tag()
        self.state_text.config(state=tk.NORMAL)
        self.state_text.delete("1.7", tk.END)
        self.state_text.insert(tk.END, state, tag)
        self.state_text.config(state=tk.DISABLED)

    def _get_state_and_tag(self):
        if (self.state_machine.loading):
            return "Loading...", "NOT_READY"
        
        match self.state_machine.current_state:
            case StateMachineState.IDLE:
                return ("Please Close the gate (the long rod infront)\n"
                        "<- Then Scan your Badge on the gray NFC reader on the Left", "READY")
            case StateMachineState.REGISTERED:
                if (self.state_machine.user.name == "Unregistered User"):
                    return "User not found. \nPlease register yourself online and press the red button", "NOT_READY"
                return (f"Hey, {self.state_machine.user.name} You're ready to race!\n"
                        "Your time starts as soon as you open the gate.", "READY")
            case StateMachineState.RUNNING:
                return (f"{self.state_machine.user.name} is Racing...\n\n"
                "If you dont see anyone on the slope anymore press the red button", "NOT_READY")

    def _update_last_time_label(self):
        # Placeholder value for last_time
        last_time = None  # Replace with actual logic
        if last_time is not None:
            if last_time == -1:
                self.last_time_label.config(text="Last Time: Did Not Finish")
            else:
                self.last_time_label.config(text=f"Last Time: {last_time}")
            last_time = None

    def log_debug_message(self, message):
        self.debug_log_label.config(text=message)
        self.root.after(5000, self.clear_debug_message)

    def clear_debug_message(self):
        self.debug_log_label.config(text="")