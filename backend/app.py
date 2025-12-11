from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

# Allow frontend (Vite dev server + production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Names(BaseModel):
    names: list[str]

@app.get("/")
def home():
    return {"message": "Secret Santa Backend is running!"}

@app.post("/pair")
def generate_pairs(data: Names):
    names = data.names.copy()
    givers = names.copy()
    receivers = names.copy()

    random.shuffle(receivers)

    # Fix self-pair issue
    for i in range(len(givers)):
        if givers[i] == receivers[i]:
            receivers[i], receivers[(i+1) % len(receivers)] = receivers[(i+1) % len(receivers)], receivers[i]

    result = [
        {"giver": givers[i], "receiver": receivers[i]} 
        for i in range(len(names))
    ]

    return {"pairs": result}
