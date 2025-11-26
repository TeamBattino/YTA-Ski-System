import requests
from global_types import User
import os

class ApiClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.race_id = "6d3173f4-823b-4e05-a4d7-b2decacc7ade"

    def getUser(self, ski_pass) -> User:
        url = f"https://{self.base_url}/api/racers"
        params = {'ski_pass': ski_pass, 'race_id': self.race_id}
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 404:
            print(f"User {ski_pass} not found")
            return User("Unregistered User","Unregistered User")
        req_user = response.json()
        print(req_user)
        if response.status_code == 200:
            return User(req_user['ski_pass'], req_user['name'])

    def postRace(self, ski_pass, duration):
        if ski_pass == "Unregistered User":
            return
        print(f"Posting {ski_pass} with duration {duration}")
        url = f"https://{self.base_url}/api/runs"
        json_data = {'ski_pass': ski_pass, 'duration': int(duration), 'race_id': self.race_id}
        headers = {'secret-key': os.getenv('AUTH_SECRET')}
        print(json_data)
        response = requests.post(url, json=json_data, headers=headers, timeout=10)
        print(response)
        response.raise_for_status()
        return response.json()
