import subprocess
import os
import sys

def run_command(command, cwd=None):
    print(f"Running: {command} in {cwd or os.getcwd()}")
    try:
        # Use shell=True to handle commands like 'pip' which might be .exe or .bat
        result = subprocess.run(command, cwd=cwd, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        print(e.stdout)
        print(e.stderr)
        return False

def main():
    root_dir = os.getcwd()
    
    # 1. Install Python dependencies from requirements.txt
    print("--- Installing Python dependencies ---")
    if not run_command("pip install -r requirements.txt"):
        print("Failed to install Python dependencies from requirements.txt")
    
    # 2. Install Python dependencies from package.json script (additional ones)
    print("--- Installing additional Python dependencies ---")
    if not run_command("pip install fastapi uvicorn python-multipart"):
        print("Failed to install additional Python dependencies")

    # 3. Install Node.js dependencies in root
    print("--- Installing Node.js dependencies in root ---")
    if not run_command("npm install"):
        print("Failed to install Node.js dependencies in root")

    # 4. Install Node.js dependencies in voice directory
    voice_dir = os.path.join(root_dir, "voice")
    if os.path.exists(voice_dir):
        print("--- Installing Node.js dependencies in voice directory ---")
        if not run_command("npm install", cwd=voice_dir):
            print("Failed to install Node.js dependencies in voice directory")
    else:
        print("Voice directory not found.")

if __name__ == "__main__":
    main()
