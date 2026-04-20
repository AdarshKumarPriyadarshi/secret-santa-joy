from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import os
import sqlite3
import json
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# MODELS
# ==============================

class Names(BaseModel):
    names: list[str]


class EventBase(BaseModel):
    name: str
    date: str
    participants: int


class GlobalEvent(EventBase):
    org_id: str   # 👈 REQUIRED here


class OrgEvent(EventBase):
    pass          # 👈 org_id comes from URL


class Organization(BaseModel):
    name: str
    photo: str | None = None
    budget: int
    description: str | None = None

class Member(BaseModel):
    id: str
    name: str
    email: str


# ==============================
# DATABASE (SQLite - No installation needed!)
# ==============================

DB_PATH = os.path.join(os.path.dirname(__file__), "secret_santa.db")

def get_db():
    """Get SQLite database connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Return rows as dict-like objects
    return conn

def init_db():
    """Initialize database tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Organizations table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS organizations (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            photo TEXT,
            budget INTEGER NOT NULL,
            description TEXT,
            members TEXT DEFAULT '[]'
        )
    """)
    
    # Events table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            org_id TEXT NOT NULL,
            org_name TEXT NOT NULL,
            date TEXT NOT NULL,
            participants INTEGER NOT NULL,
            status TEXT DEFAULT 'active',
            drawn INTEGER DEFAULT 0
        )
    """)

    # Assignments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assignments (
            id TEXT PRIMARY KEY,
            event_id TEXT NOT NULL,
            giver_id TEXT NOT NULL,
            giver_name TEXT NOT NULL,
            receiver_name TEXT NOT NULL
        )
    """)

    
    conn.commit()
    conn.close()
    print("✅ SQLite database initialized successfully")

# Initialize database on startup
init_db()


def serialize_org(row: sqlite3.Row) -> dict:
    """Convert SQLite row to dict"""
    members_json = row["members"] if "members" in row.keys() else "[]"
    try:
        members = json.loads(members_json) if members_json else []
    except:
        members = []
    
    return {
        "id": row["id"],
        "name": row["name"],
        "photo": row["photo"] if "photo" in row.keys() else None,
        "budget": row["budget"],
        "description": row["description"] if "description" in row.keys() else None,
        "members": members,
    }


def serialize_event(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "name": row["name"],
        "org_id": row["org_id"],
        "org_name": row["org_name"],
        "date": row["date"],
        "participants": row["participants"],
        "status": row["status"],
        "drawn": row["drawn"]
    }


# ==============================
# BASIC ROUTES
# ==============================

@app.get("/")
def home():
    return {"message": "Secret Santa Backend is running!"}

@app.get("/health")
def health_check():
    """Health check endpoint - tests database connection"""
    try:
        conn = get_db()
        conn.execute("SELECT 1")
        conn.close()
        return {"status": "ok", "message": "Backend and SQLite database are healthy"}
    except Exception as e:
        return {"status": "error", "message": f"Database connection failed: {str(e)}"}


# ==============================
# PAIR GENERATOR
# ==============================

@app.post("/pair")
def generate_pairs(data: Names):
    names = data.names.copy()
    givers = names.copy()
    receivers = names.copy()

    random.shuffle(receivers)

    for i in range(len(givers)):
        if givers[i] == receivers[i]:
            receivers[i], receivers[(i + 1) % len(receivers)] = receivers[(i + 1) % len(receivers)], receivers[i]

    result = [{"giver": givers[i], "receiver": receivers[i]} for i in range(len(names))]
    return {"pairs": result}


# ==============================
# GLOBAL EVENTS (NON-ORG)
# ==============================

@app.get("/events")
def get_events():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM events")
        rows = cursor.fetchall()
        conn.close()
        return [serialize_event(row) for row in rows]
    except Exception as e:
        print(f"Error fetching events: {e}")
        return []



@app.post("/events")
def create_event(event: GlobalEvent):
    try:
        conn = get_db()
        cursor = conn.cursor()

        # Check if organization exists
        cursor.execute(
            "SELECT * FROM organizations WHERE id = ?",
            (event.org_id,)
        )
        org = cursor.fetchone()
        if not org:
            conn.close()
            return {"error": "Organization not found"}

        event_id = f"evt_{random.randint(100000, 999999)}"

        cursor.execute("""
            INSERT INTO events (id, name, org_id, org_name, date, participants, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            event_id,
            event.name,
            event.org_id,
            org["name"],
            event.date,
            event.participants,
            "active"
        ))

        conn.commit()

        cursor.execute("SELECT * FROM events WHERE id = ?", (event_id,))
        created = cursor.fetchone()
        conn.close()

        return {
            "message": "Event created",
            "event": serialize_event(created)
        }

    except Exception as e:
        return {"error": str(e)}




# ==============================
# ORGANIZATIONS
# ==============================

@app.get("/organizations")
def get_organizations():
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM organizations")
        rows = cursor.fetchall()
        conn.close()
        orgs = [serialize_org(row) for row in rows]
        return {"organizations": orgs}
    except Exception as e:
        print(f"Error fetching organizations: {e}")
        return {"error": str(e), "organizations": []}

@app.post("/organizations")
def create_organization(org: Organization):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Generate unique ID
        org_id = f"org_{random.randint(100000, 999999)}"
        
        cursor.execute("""
            INSERT INTO organizations (id, name, photo, budget, description, members)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (org_id, org.name, org.photo, org.budget, org.description, "[]"))
        
        conn.commit()
        
        # Get created organization
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        created = cursor.fetchone()
        conn.close()
        
        if created:
            return {"message": "Organization created", "organization": serialize_org(created)}
        return {"error": "Failed to create organization"}
    except Exception as e:
        print(f"Error creating organization: {e}")
        return {"error": str(e)}

@app.get("/organizations/{org_id}")
def get_organization(org_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()
        conn.close()
        
        if org:
            return {"organization": serialize_org(org)}
        return {"error": "Organization not found"}
    except Exception as e:
        print(f"Error fetching organization: {e}")
        return {"error": str(e)}


# ==============================
# ORGANIZATION MEMBERS
# ==============================

@app.get("/organizations/{org_id}/members")
def get_members(org_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()
        conn.close()
        
        if org:
            members_json = org["members"] if "members" in org.keys() else "[]"
            try:
                members = json.loads(members_json) if members_json else []
            except:
                members = []
            return {"members": members}
        return {"error": "Organization not found"}
    except Exception as e:
        print(f"Error fetching members: {e}")
        return {"error": str(e)}

@app.post("/organizations/{org_id}/members")
def add_member(org_id: str, member: Member):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get current organization
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()
        if not org:
            conn.close()
            return {"error": "Organization not found"}
        
        # Get current members
        members_json = org["members"] if "members" in org.keys() else "[]"
        try:
            members = json.loads(members_json) if members_json else []
        except:
            members = []
        
        # Add new member
        members.append(member.dict())
        
        # Update organization
        cursor.execute("""
            UPDATE organizations 
            SET members = ? 
            WHERE id = ?
        """, (json.dumps(members), org_id))
        
        conn.commit()
        conn.close()
        
        return {"message": "Member added", "members": members}
    except Exception as e:
        print(f"Error adding member: {e}")
        return {"error": str(e)}


# ==============================
# ORGANIZATION EVENTS
# ==============================

@app.get("/organizations/{org_id}/events")
def get_org_events(org_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM events WHERE org_id = ?", (org_id,))
        rows = cursor.fetchall()
        conn.close()
        return [serialize_event(row) for row in rows]
    except Exception as e:
        print(f"Error fetching org events: {e}")
        return []

 
@app.post("/organizations/{org_id}/events")
def create_org_event(org_id: str, event: OrgEvent):
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Check if organization exists
        cursor.execute("SELECT * FROM organizations WHERE id = ?", (org_id,))
        org = cursor.fetchone()
        if not org:
            conn.close()
            return {"error": "Organization not found"}
        
        # Create event
        event_id = f"evt_{random.randint(100000, 999999)}"
        cursor.execute("""
            INSERT INTO events (id, name, org_id, org_name, date, participants, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (event_id, event.name, org_id, org["name"], event.date, event.participants, "active"))
        
        conn.commit()
        
        # Get created event
        cursor.execute("SELECT * FROM events WHERE id = ?", (event_id,))
        created = cursor.fetchone()
        conn.close()
        
        if created:
            return {
                "message": "Event created",
                "event": serialize_event(created)
            }
        return {"error": "Failed to create event"}
    except Exception as e:
        print(f"Error creating org event: {e}")
        return {"error": str(e)}

@app.post("/events/{event_id}/assignments")
def save_assignments(event_id: str, pairs: List[dict]):
    try:
        conn = get_db()
        cursor = conn.cursor()

        # 🔒 Check if already drawn
        cursor.execute("SELECT drawn FROM events WHERE id = ?", (event_id,))
        event = cursor.fetchone()

        if event and event["drawn"] == 1:
            conn.close()
            return {"error": "Event already drawn"}

        for p in pairs:
            cursor.execute("""
                INSERT INTO assignments (id, event_id, giver_id, giver_name, receiver_name)
                VALUES (?, ?, ?, ?, ?)
            """, (
                f"asg_{random.randint(100000,999999)}",
                event_id,
                p["giver"],
                p["giver"],
                p["receiver"]
            ))

        # 🔒 Mark event as drawn
        cursor.execute(
            "UPDATE events SET drawn = 1 WHERE id = ?",
            (event_id,)
        )

        conn.commit()
        conn.close()
        return {"message": "Assignments saved and event locked"}

    except Exception as e:
        return {"error": str(e)}



@app.get("/events/{event_id}/assignments/{giver_id}")
def get_assignment(event_id: str, giver_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT * FROM assignments
            WHERE event_id = ? AND giver_id = ?
        """, (event_id, giver_id))

        row = cursor.fetchone()
        conn.close()

        if not row:
            return {"error": "Assignment not found"}

        return {
            "event_id": row["event_id"],
            "giver": row["giver_name"],
            "receiver": row["receiver_name"]
        }
    except Exception as e:
        return {"error": str(e)}


@app.get("/events/{event_id}/assignments")
def get_event_assignments(event_id: str):
    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT giver_name, receiver_name
            FROM assignments
            WHERE event_id = ?
        """, (event_id,))

        rows = cursor.fetchall()
        conn.close()

        return [
            {
                "giver": row["giver_name"],
                "receiver": row["receiver_name"]
            }
            for row in rows
        ]
    except Exception as e:
        return {"error": str(e)}
