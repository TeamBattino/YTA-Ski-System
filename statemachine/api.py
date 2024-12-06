import requests

class ApiClient:
    def __init__(self, base_url):
        self.base_url = base_url

    def getUser(self, params=None):
        url = f"{self.base_url}/api/users"
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def postRace(self, endpoint, data=None, json=None):
        url = f"{self.base_url}/{endpoint}"
        response = requests.post(url, data=data, json=json)
        response.raise_for_status()
        return response.json()