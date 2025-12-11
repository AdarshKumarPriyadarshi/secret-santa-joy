from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Names(BaseModel):
    names: list[str]

class Event(BaseModel):
    id: str
    name: str
    org: str
    date: str
    participants: int
    status: str

events_db = [
    {
        "id": "1",
        "name": "Christmas 2024",
        "org": "Tech Corp",
        "date": "2024-12-25",
        "participants": 15,
        "status": "active"
    },
    {
        "id": "2",
        "name": "Holiday Party",
        "org": "Design Team",
        "date": "2024-12-20",
        "participants": 8,
        "status": "active"
    },
]

@app.get("/")
def home():
    return {"message": "Secret Santa Backend is running!"}

@app.post("/pair")
def generate_pairs(data: Names):
    names = data.names.copy()
    givers = names.copy()
    receivers = names.copy()

    random.shuffle(receivers)

    for i in range(len(givers)):
        if givers[i] == receivers[i]:
            receivers[i], receivers[(i+1) % len(receivers)] = receivers[(i+1) % len(receivers)], receivers[i]

    result = [
        {"giver": givers[i], "receiver": receivers[i]}
        for i in range(len(names))
    ]

    return {"pairs": result}

@app.get("/events")
def get_events():
    return {"events": events_db}
