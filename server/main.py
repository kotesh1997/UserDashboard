from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
import bleach
from typing import Dict, List, Optional

app = FastAPI()

# allow CORS origin to fetch data using frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Storing data in memory
users: Dict[int, dict] = {}
user_id_counter = 1

class UserDetailsBase(BaseModel):
    name: str
    email: EmailStr
    age: int

    #validating name & age from user Input
    @validator('name')
    def sanitize_name(cls, v):
        # Clean and validate name
        name = bleach.clean(str(v).strip())
        if len(name) < 2:
            raise ValueError("Name must be at least 2 characters long")
        return name

    @validator('age')
    def validate_age(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("Age must be between 0 and 100")
        return v

class UserCreate(UserDetailsBase):
    pass

class User(UserDetailsBase):
    id: int

@app.post("/users/", response_model=User, status_code=201)
def create_user(user: UserCreate):
    global user_id_counter
    
    # Check if email already exists then throw an error
    if any(u['email'] == user.email for u in users.values()):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = user.dict()
    user_dict['id'] = user_id_counter
    users[user_id_counter] = user_dict
    user_id_counter += 1
    
    return user_dict

@app.get("/users/", response_model=List[User])
def get_users():
    return list(users.values())

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int):
    if user_id not in users:
        raise HTTPException(status_code=404, detail="User not found")
    del users[user_id]
    return None

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)