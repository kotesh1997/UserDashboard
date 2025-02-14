import pytest
from fastapi.testclient import TestClient
from main import app
import uuid

client = TestClient(app)

USERS = '/users/'

# Sample User Data
user_data = {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "age": 30
}

def test_create_user():
    """Test creating a new user"""
    response = client.post(USERS, json=user_data)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["name"] == user_data["name"]
    assert data["email"] == user_data["email"]
    assert data["age"] == user_data["age"]
    assert "created_at" in data 

def test_create_duplicate_user():
    """Test: creating a user with a duplicate email should fail"""
    response = client.post(USERS, json=user_data)
    assert response.status_code == 400
    assert response.json() == {"detail": "Email already registered"}

def test_get_all_users():
    """Test: fetching all users"""
    response = client.get(USERS)
    assert response.status_code == 200
    users = response.json()
    assert isinstance(users, list)
    assert len(users) > 0  # At least one user exists

def test_delete_user():
    """Test: deleting an existing user"""
    # Add new user
    new_user_data = {
        "name": "Jane Doe",
        "email": "janedoe@example.com",
        "age": 25
    }
    response = client.post(USERS, json=new_user_data)
    assert response.status_code == 201
    user_id = response.json()["id"]

    # Delete the user
    delete_response = client.delete(f"/users/{user_id}")
    assert delete_response.status_code == 204  # No Content

    # Check the user is deleted
    response = client.get(USERS)
    assert all(user["id"] != user_id for user in response.json())

def test_delete_nonexistent_user():
    """Test: deleting a non-existent user"""
    fake_id = str(uuid.uuid4())  # Generate a random UUID
    response = client.delete(f"/users/{fake_id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"}
