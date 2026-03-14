import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.quizzes.models import Quiz, Question

def seed():
    print("Seeding database...")
    
    # Check if admin exists
    admin_email = 'admin@example.com'
    if not User.objects.filter(email=admin_email).exists():
        User.objects.create_superuser(
            email=admin_email,
            name='System Administrator',
            password='adminpassword123'
        )
        print(f"Created Admin: {admin_email} (Password: adminpassword123)")
        
    # Check if a test user exists
    test_user_email = 'user@example.com'
    if not User.objects.filter(email=test_user_email).exists():
        User.objects.create_user(
            email=test_user_email,
            name='Test Student',
            password='userpassword123'
        )
        print(f"Created Student: {test_user_email} (Password: userpassword123)")
        
    admin = User.objects.get(email=admin_email)
        
    # Check if a quiz exists
    if not Quiz.objects.exists():
        quiz = Quiz.objects.create(
            title="General Knowledge Assessment",
            description="A quick 3-question quiz to test your general knowledge and verify the system works.",
            created_by=admin
        )
        
        Question.objects.create(
            quiz=quiz,
            text="What is the time complexity of binary search?",
            options=["O(1)", "O(log n)", "O(n)", "O(n^2)"],
            correct_answer_index=1
        )
        
        Question.objects.create(
            quiz=quiz,
            text="Which planet is known as the Red Planet?",
            options=["Venus", "Jupiter", "Mars", "Saturn"],
            correct_answer_index=2
        )
        
        Question.objects.create(
            quiz=quiz,
            text="What is the main language used for styling web pages?",
            options=["HTML", "Python", "JavaScript", "CSS"],
            correct_answer_index=3
        )
        print("Created sample quiz: 'General Knowledge Assessment'")
    else:
        print("Quiz already exists, skipping quiz creation.")
        
    print("Database seeding complete!")

if __name__ == "__main__":
    seed()
