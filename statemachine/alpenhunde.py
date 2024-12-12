import requests
from threading import Event
from global_types import StateMachine, StateMachineState
class Alpenhunde():
    def __init__(self, update_event: Event, race_finished_event: Event,global_state: StateMachine):
        self.race_running = False
        self.update_event = update_event
        self.race_finished_event = race_finished_event
        self.global_state = global_state
        self.prev_result_len = None
        
        

    def get_running_races(self):
        try:
            response = requests.get("http://192.168.4.1/timing/?action=get_name_queue_and_running_times")
            response.raise_for_status()
            return response.json()["times"]
        except requests.RequestException as e:
            print(f"Error fetching race status: {e}")
            return None

    def get_race_results(self):
        try:
            response = requests.get("http://192.168.4.1/timing/results/")
            response.raise_for_status()
            return response.json()["times"]
        except requests.RequestException as e:
            print(f"Error fetching race results: {e}")
            return None


    def is_race_running(self):
        response = self.get_running_races()
        return int(response[0]["index"]) != 65535

    def stop_race(self,index):
        try:
            response = requests.post("http://192.168.4.1/timing/?action=cancel&index=" + index)
        except requests.RequestException as e:
            print(f"Error sending POST request: {e}")

    def run(self):
        while True:
            self.update_event.wait()
            self.update_event.clear()
            match self.global_state.current_state:
                case StateMachineState.IDLE:
                    self.clear()
                case _:
                    self.update()

    def update(self):
        running = self.is_race_running()
        result_timings = self.get_race_results()
        if len(result_timings) != self.prev_result_len:
            self.prev_result_len = len(result_timings)
            new_time = result_timings[len(result_timings)-1]["t"]
            if int(new_time) > 0:
                print(f"New time: {new_time}")
                self.global_state.last_race_time = new_time
                self.race_finished_event.set()
                self.clear()
                
        if (running):
            self.global_state.current_state = StateMachineState.RUNNING

        else:
            self.global_state.current_state = StateMachineState.IDLE
            
    def clear(self):
        if self.is_race_running():
            currently_running = self.get_running_races()
            for curr in currently_running:
                self.stop_race(curr["index"])