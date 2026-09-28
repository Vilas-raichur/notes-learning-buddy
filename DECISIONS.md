# Design Decisions
## Argon2 instead of bcrypt/passlib

While researching about password hashing, I found that passlib is unmaintained since 2020 and breaks against the current version of bcrypt that pip installs. I switched to argon2-cffi directly instead, which is the current OWASP-recommended standard for password hashing and the winner of the Password Hashing Competition.

## Windows venv paths are not portable

This came up during the project reorganization, when I moved venv into the backend folder. After that, uvicorn stopped being recognized, even though my prompt still showed (venv). The actual error was: 'uvicorn' is not recognized as an internal or external command, operable program or batch file. This happens because Windows' activate.bat hardcodes the absolute path at creation time, so moving the folder silently breaks it. The fix: delete the venv and recreate it in its new location, then reinstall everything from requirements.txt.

## Database: SQLite instead of PostgreSQL
Chose SQLite for local development to avoid any hosted database service or payment method — this project runs entirely on one machine at zero cost. SQLite ships with Python's standard library and stores everything as a single file. Swapping to PostgreSQL for production would mean changing one connection string, since SQLAlchemy abstracts the underlying database engine.

## LLM: Local Ollama instead of a hosted API
Running an open-source model locally via Ollama instead of Claude/OpenAI's paid APIs, to avoid adding any payment method to any account for this project. Trade-off: slower inference and lower answer quality than a hosted frontier model, in exchange for zero cost and complete data privacy — no document or query ever leaves the machine.

## Auth library: PyJWT instead of python-jose
Compared both before choosing. python-jose has an unresolved denial-of-service issue ("JWT bomb"). PyJWT is more actively maintained, and pinned to 2.13.0+ specifically since earlier versions had signature-verification vulnerabilities patched in that release.

## No LICENSE file (all rights reserved)
Repo is public for portfolio visibility, but deliberately has no LICENSE file, so default copyright applies: visitors can view the code but have no legal right to reuse or run it without permission, as stated explicitly in the README.

## Project structure: backend/ and frontend/ separation
Started with a flat folder while learning FastAPI fundamentals, then reorganized once the file count grew, to reflect the actual deployment boundary between the API server and the client. Kept README, DECISIONS, and .gitignore at the repo root since they describe the whole project, not just one layer.


## Local LLM sensitivity to question phrasing
Observed that the "/ask" endpoint returned "I don't have enough information" for the question "give at least two references," despite the correct chunk being retrieved successfully (verified independently). Rephrasing to "What references are listed in this document?" returned a complete, correct answer using the same retrieved chunk. This confirms retrieval works reliably; the 3B local model is simply more sensitive to ambiguous phrasing than a larger hosted model would typically be — an accepted trade-off of running entirely offline at zero cost.

## Serving the frontend from the same FastAPI server
Instead of running a separate frontend server and configuring CORS, I mount the frontend folder as static files on the FastAPI app, so the browser and the API share one origin and cross-origin restrictions never come up. The trade-off is that the two can't be deployed or scaled independently, which is fine at this size. The folder path is resolved from the file's own location, so it works no matter which directory the server is started from.


## Avatar colors: email hash instead of signup-order rotation
Each user's avatar color is picked by hashing their email into a four-color palette. This is stateless and needs no extra request, but it can't guarantee distinct colors: with three accounts, all three differ only about 37.5% of the time, so repeats are normal. Rotating by database ID would guarantee distinct colors for consecutive signups, but it depends on signup order and needs an extra request after login. I chose the hash because a repeated avatar color has no real cost.