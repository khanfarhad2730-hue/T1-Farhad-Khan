import requests

BASE_URL = "http://localhost:8000/api"

def run_tests():
    print("Starting Integration Tests...")
    
    # 1. Dev Login
    print("\n1. Testing Dev Login...")
    res = requests.post(f"{BASE_URL}/auth/dev-login/", json={"email": "admin@example.com"})
    if res.status_code != 200:
        print(f"FAILED: Dev login returned {res.status_code}")
        print(res.text)
        return
    data = res.json()
    token = data['access']
    headers = {"Authorization": f"Bearer {token}"}
    print("SUCCESS: Logged in and received JWT")
    
    # 2. Get Profile (/me)
    print("\n2. Testing /me endpoint...")
    res = requests.get(f"{BASE_URL}/auth/me/", headers=headers)
    if res.status_code == 200:
        print(f"SUCCESS: Fetched profile -> {res.json()['email']}")
    else:
        print(f"FAILED: /me returned {res.status_code}")
        
    # 3. Create Quiz
    print("\n3. Testing Quiz Creation...")
    quiz_data = {
        "title": "Integration Test Quiz",
        "description": "Created via automated test",
        "time_limit": 10
    }
    res = requests.post(f"{BASE_URL}/quizzes/create/", json=quiz_data, headers=headers)
    if res.status_code == 201:
        quiz_id = res.json()['id']
        print(f"SUCCESS: Created quiz ID {quiz_id}")
    else:
        print(f"FAILED: Quiz creation returned {res.status_code}")
        print(res.text)
        return
        
    # 4. Add Question
    print("\n4. Testing Question Creation...")
    q1_data = {
        "question_text": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct_answer_index": 1
    }
    res = requests.post(f"{BASE_URL}/quizzes/{quiz_id}/questions/create/", json=q1_data, headers=headers)
    if res.status_code == 201:
        q1_id = res.json()['id']
        print("SUCCESS: Added question 1")
    else:
        print(f"FAILED: Question 1 returned {res.status_code}")
        
    q2_data = {
        "question_text": "What color is the sky?",
        "options": ["Red", "Green", "Blue", "Yellow"],
        "correct_answer_index": 2
    }
    res = requests.post(f"{BASE_URL}/quizzes/{quiz_id}/questions/create/", json=q2_data, headers=headers)
    if res.status_code == 201:
        q2_id = res.json()['id']
        print("SUCCESS: Added question 2")
    else:
        print(f"FAILED: Question 2 returned {res.status_code}")
        
    # 5. Fetch Quiz List
    print("\n5. Testing Quiz Listing...")
    res = requests.get(f"{BASE_URL}/quizzes/", headers=headers)
    if res.status_code == 200 and res.json()['count'] > 0:
        print(f"SUCCESS: Found {res.json()['count']} quizzes")
    else:
        print("FAILED: Quiz list")
        
    # 6. Fetch Quiz Detail (Check answers are hidden)
    print("\n6. Testing Quiz Detail (Answers hidden)...")
    res = requests.get(f"{BASE_URL}/quizzes/{quiz_id}/", headers=headers)
    if res.status_code == 200:
        detail = res.json()
        questions = detail.get('questions', [])
        hidden = True
        for q in questions:
            if 'correct_answer_index' in q:
                hidden = False
        if hidden and len(questions) == 2:
            print("SUCCESS: Quiz detail fetched, 2 questions, answers are hidden")
        else:
            print("FAILED: Answers exposed or missing questions!")
            print(questions)
    else:
        print("FAILED: Fetching quiz detail")
        
    # 7. Submit Attempt (1 correct, 1 wrong)
    print("\n7. Testing Attempt Submission (Scoring logic)...")
    attempt_data = {
        "quiz_id": quiz_id,
        "answers": {
            str(q1_id): 1, # Correct (4)
            str(q2_id): 1  # Wrong (Green instead of Blue)
        }
    }
    res = requests.post(f"{BASE_URL}/attempt/", json=attempt_data, headers=headers)
    if res.status_code == 201:
        attempt = res.json()
        attempt_id = attempt['id']
        score = attempt['score']
        print(f"SUCCESS: Attempt submitted! Score: {score}/{attempt['total_questions']}")
        if score == 1:
            print("SUCCESS: Server-side scoring matched expected (1/2)")
        else:
            print("FAILED: Scoring logic incorrect")
    else:
        print(f"FAILED: Attempt submission returned {res.status_code}")
        print(res.text)
        
    # 8. Fetch Attempt History
    print("\n8. Testing Attempt History...")
    res = requests.get(f"{BASE_URL}/my-attempts/", headers=headers)
    if res.status_code == 200 and res.json()['count'] > 0:
        print(f"SUCCESS: Checked attempt history, found {res.json()['count']} attempts")
    else:
        print("FAILED: History fetch")
        
    print("\nAll integration tests complete!")

if __name__ == "__main__":
    run_tests()
