import requests

class Alpenhunde:
    def __init__(self):
        self.race_running = False
        self.base_index = None
        self.previous_highest_index = None
        self.prev_len = None
        self.last_time = None

        times = self.get_race_results()["times"]
        self.previous_highest_index = self.get_highest_timing_index(times)
        self.prev_len = len(times)
        self.race_running = self.is_race_running()

    def get_race_status(self):
        try:
            response = requests.get("http://192.168.4.1/timing/?action=get_name_queue_and_running_times")
            response.raise_for_status()
            return response.json()    
        except requests.RequestException as e:
            print(f"Error fetching race status: {e}")
            return None

    def get_race_results(self):
        try:
            response = requests.get("http://192.168.4.1/timing/results/")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching race results: {e}")
            return None

    def is_race_running(self):
        response = self.get_race_status()
        return int(response["times"][0]["index"]) != 65535

    def get_highest_timing_index(self, times):
        highest_index_entry = max(times, key=lambda x: int(x["i"]))
        return int(highest_index_entry["i"])

    def send_post_request(self, url):
        try:
            response = requests.post(url)
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"Error sending POST request: {e}")

    def stop_all_running(self):
        if self.is_race_running():
            currently_running = self.get_race_status()["times"]
            for curr in currently_running:
                self.send_post_request("http://192.168.4.1/timing/?action=cancel&index=" + curr["index"])

    def run(self):
        try:
            self.race_running = self.is_race_running()
            print(f"Race running: {self.race_running}")

            times = self.get_race_results()["times"]

            highest_index = self.get_highest_timing_index(times)
            print(f"Highest index: {highest_index-1}")

            if len(times) != self.prev_len:
                print("New entry detected")
                new_time = times[len(times)-1]["t"]
                self.prev_len = len(times)
                if int(new_time) > 0:
                    print("times: ", new_time)
                    self.last_time = new_time

            if highest_index > self.previous_highest_index and self.race_running:
                print("stopping all running")
                self.stop_all_running()
                self.prev_len = len(self.get_race_results()["times"])

            self.previous_highest_index = highest_index

        except Exception as e:
            print(f"Flo made an oopsie: {e}")

# Example usage:
# alpenhunde = Alpenhunde()
# alpenhunde.run()