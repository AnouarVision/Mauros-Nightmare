# Mauro's Nightmare
## Time-Based Blind SQL Injection CTF

### Overview

**Mauro's Nightmare** is an interactive horror-themed capture the flag challenge that simulates a time-based blind SQL injection vulnerability. Players enter the dark world of Mauro, a creepy plumber inspired by classic platformers but twisted into a nightmare realm.

The challenge combines engaging gameplay with cybersecurity education, requiring players to uncover a hidden flag by navigating a minimalist platform environment and carefully exploiting a vulnerability in the login system.

---

## Challenge Features

### Immersive Horror Experience
- **Cinematic Introduction**: Chilling opening message introducing Mauro and the challenge
- **Atmospheric Design**: Horror-themed interface to enhance immersion and engagement

### Interactive Minigame
- **Platform Controls**: Navigate a character through a challenging environment
- **Survival Mechanics**: Jump and movement controls with engaging gameplay

### Hidden Secret Level
- **Discovery Mechanism**: Triggered by jumping on a specific block during gameplay
- **Vulnerable Login Page**: Gateway to the main security challenge

### Time-Based SQL Injection Challenge
- **Time Constraint**: Complete the exploit within a 5 minute window

---

## Installation Guide

### System Requirements
- Docker installed and running
- Network access for dependency downloads
- Web browser for challenge interface

### Setup Instructions

**Step 1: Clone Repository**
```bash
git clone https://github.com/<yourusername>/Mauros-Nightmare.git #Replace <yourusername> with your GitHub username
cd Mauros-Nightmare
```

**Step 2: Build Docker Image**
```bash
docker build -t <image_name> . #Replace <image_name> with the name of your Docker image
```

**Step 3: Launch Container**
```bash
docker run --env-file .env -p 5000:5000 <image_name> #Replace <image_name> with the name of your Docker image
```

**Step 4: Access Application**
```
http://127.0.0.1:5000
```

---

## Technical Architecture

### Technology Stack
- **Backend Framework**: Flask (Python 3.11)
- **Security Layer**: Flask-WTF for CSRF Protection
- **Containerization**: Docker for consistent deployment
- **Configuration Management**: python-dotenv for environment variables

### Project Structure
```
Mauros-Nightmare/
├── app.py                    # Main Flask application
├── requirements.txt          # Python dependencies
├── Dockerfile               # Container configuration
├── .env                     # Environment variables
├── .dockerignore            # Docker build exclusions
├── .gitignore              
├── templates/           
│   ├── index.html              # Main landing page
│   ├── game.html               # Minigame interface
│   ├── game_over.html          # Game completion screen
│   ├── secret_login.html       # Vulnerable login form
│   └── flag.html               # Success page with flag
└── static/                
    ├── css/
    │   └── style.css            
    ├── js/
    │   ├── game.js              
    │   └── secret_login.js      # Login form interactions
    └── resources/
        ├── mauro_intro.mp4      # Introduction video
        └── player.png           # Player character
```

## Environment Configuration

The **`.env`** file located at the root of the project contains critical environment variables required for configuring the application. These include:

- `SECRET_KEY` — used for session and CSRF protection  
- `FLASK_DEBUG` — enables or disables debug mode  
- `FLAG`, `SECRET_PASSWORD` — challenge specific secrets

You are absolutely free to **customize or modify** the contents of the `.env` file for your own deployment or experimentation purposes.

However, we **strongly advise against** inspecting its contents right away. Doing so would **spoil the core of the challenge** and diminish the investigative thrill that's central to the experience.

> Resist the temptation — Mauro's nightmare is best faced without spoilers.


---

## Challenge Rules

### Time Constraints
- **5-minute limit** to complete the SQL injection exploit once the secret level is accessed
- Timer begins when the vulnerable login page is discovered

### Technical Limitations
- **Manual exploitation required**: Automated tools like sqlmap will not be effective
- **Precision necessary**: The vulnerability requires careful timing and methodology

### Success Criteria
- Successfully discover the hidden secret level through gameplay
- Exploit the time-based blind SQL injection vulnerability
- Extract the flag within the allocated time limit

---

## Educational Objectives

### Core Learning Concepts

**Time-Based Attack Vectors**
Understanding how subtle temporal differences can reveal sensitive information and compromise system security.

**Cybersecurity Gamification**
Integration of gaming elements with security education to create engaging learning experiences.

**Defense in Depth Analysis**
Examining how multiple security layers can still be insufficient when core application logic contains vulnerabilities.

**Ethical Hacking Methodology**
Practicing penetration testing techniques in a controlled, legal environment.

### Skill Development

**Web Vulnerability Analysis**
- Identifying time-based injection points
- Understanding application response patterns
- Recognizing subtle security indicators

**Python Scripting for Security**
- Developing custom exploit scripts

**Reconnaissance Techniques**
- Application mapping and discovery
- Hidden functionality identification
- Systematic vulnerability assessment

---

## Important Disclaimers

### Educational Use Only
This CTF challenge is designed exclusively for educational purposes and should only be deployed in controlled environments for learning cybersecurity concepts.

### Legal Compliance
The techniques demonstrated in this challenge must never be used against unauthorized systems. Always ensure proper authorization before conducting security testing.


---

## Getting Started

1. **Deploy the environment** following the installation guide
2. **Access the application** through your web browser
3. **Watch the introduction** to understand the challenge context
4. **Play the minigame** to discover hidden elements
5. **Find the secret level** by exploring gameplay mechanics
6. **Exploit the vulnerability**
7. **Capture the flag** within the time limit

Ready to enter Mauro's nightmare? The clock is ticking...
