from dataclasses import dataclass
from enum import Enum

class StateMachineState(Enum):
    IDLE = 1
    REGISTERED = 2
    RUNNING = 3

@dataclass
class User:
    rfid: str
    name: str
@dataclass
class StateMachine:
    current_state: StateMachineState
    last_race_time: int
    user: User
    loading: bool
    connection_issues: bool