import requests
from global_types import User
import os

class ApiClient:
    def __init__(self, base_url):
        self.base_url = base_url

    def getUser(self, ski_pass) -> User:
        url = f"https://{self.base_url}/api/racers"
        params = {'ski_pass': ski_pass}
        response = requests.get(url, params=params)
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
        json_data = {'ski_pass': ski_pass, 'duration': int(duration)}
        headers = {'secret-key': os.getenv('AUTH_SECRET')}
        print(json_data)
        response = requests.post(url, json=json_data, headers=headers)
        print(response)
        response.raise_for_status()
        return response.json()
