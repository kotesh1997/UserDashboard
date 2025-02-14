from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
import bleach
import uuid
import threading
from typing import Dict, List
from datetime import datetime

# Initialize FastAPI App
app = FastAPI()

# Configure CORS dynamically
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Storage (Storing data here with in-memory store)
users: Dict[str, dict] = {}
lock = threading.Lock()  # Thread safety

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, description="User's full name")
    email: EmailStr
    age: int = Field(..., ge=0, le=100, description="Age must be between 0 and 100")

    @classmethod
    def sanitize_name(cls, name: str) -> str:
        sanitized = bleach.clean(name.strip())
        if len(sanitized) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return sanitized

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str  # using UUID for uniqueness
    created_at: datetime


@app.post("/users/", response_model=User, status_code=201)
def create_user(user: UserBase):
    """Store new user with unique email validation"""
    sanitized_name = UserBase.sanitize_name(user.name)
    
    with lock:
        # Check if email already exists
        if any(u['email'].lower() == user.email.lower() for u in users.values()):
            raise HTTPException(status_code=400, detail="Email already registered")

        user_id = str(uuid.uuid4())  # Generate unique ID
        user_dict = user.dict()
        user_dict.update({"id": user_id, "name": sanitized_name , "created_at": datetime.utcnow()})
        users[user_id] = user_dict

    return user_dict

@app.get("/users/", response_model=List[User])
def get_users():
    """Fetches all registered users."""
    return list(users.values())

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str):
    """Deletes User based on 'user_id'"""
    with lock:
        if user_id not in users:
            raise HTTPException(status_code=404, detail="User not found")
        del users[user_id]

    return None  # 204 No Content response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
