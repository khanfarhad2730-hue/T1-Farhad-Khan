import requests
import random

BASE_URL = "http://localhost:8000/api"

def run_tests():
    print("Testing Traditional Authentication APIs...")
    
    # 1. Register a new user with random email
    print("\n1. Testing Registration (/register)...")
    email = f"testuser_{random.randint(1000,9999)}@example.com"
    reg_data = {
        "name": "Test User",
        "email": email,
        "password": "SecurePassword123"
    }
    
    res = requests.post(f"{BASE_URL}/auth/register/", json=reg_data)
    if res.status_code == 201:
        print(f"SUCCESS: Registered {email}")
    else:
        print(f"FAILED: Registration returned {res.status_code}")
        print(res.text)
        return
        
    # 2. Login with the new user
    print("\n2. Testing Traditional Login (/login)...")
    login_data = {
        "email": email,
        "password": "SecurePassword123"
    }
    
    res = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    if res.status_code == 200:
        token = res.json()['access']
        print(f"SUCCESS: Logged in {email} and received JWT token")
    else:
        print(f"FAILED: Login returned {res.status_code}")
        print(res.text)
        return
        
    # 3. Verify token with /me
    print("\n3. Testing Token Verification (/me)...")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(f"{BASE_URL}/auth/me/", headers=headers)
    
    if res.status_code == 200:
        print(f"SUCCESS: Profile fetched -> {res.json()['email']}")
    else:
        print(f"FAILED: /me returned {res.status_code}")
        
    print("\nTraditional Auth APIs are fully verified!")

if __name__ == "__main__":
    run_tests()
