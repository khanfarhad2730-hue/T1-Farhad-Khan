# Git Commit Strategy

Follow this sequence to build a professional commit history.

## Recommended Commits

```
1.  init: initialize django project
2.  feat: setup django rest framework and dependencies
3.  feat: create custom user model
4.  feat: implement google oauth authentication
5.  feat: add jwt authentication with simplejwt
6.  feat: create quiz and question models
7.  feat: add quiz serializers with validation
8.  feat: create quiz CRUD api endpoints
9.  feat: implement attempt model and scoring logic
10. feat: create attempt submission and results apis
11. feat: add cors and environment configuration
12. init: setup react project with vite and typescript
13. style: configure tailwindcss with custom theme
14. feat: create auth context and api service
15. feat: create login page with google oauth
16. feat: create dashboard page with stats
17. feat: create quiz listing page with pagination
18. feat: create quiz attempt page with timer
19. feat: create result and review page
20. feat: create attempt history page
21. feat: add admin quiz creation page
22. feat: add protected routes and navbar
23. feat: add toast notifications and loading skeletons
24. docs: add readme and documentation
25. chore: final cleanup and review
```

## Branch Strategy

- `main` — Production-ready code
- `develop` — Development branch
- Feature branches: `feat/auth`, `feat/quizzes`, `feat/frontend`

## Example Commands

```bash
git init
git add backend/manage.py backend/config/
git commit -m "init: initialize django project"

git add backend/requirements.txt
git commit -m "feat: setup django rest framework and dependencies"

# ... continue for each logical unit of work
```
