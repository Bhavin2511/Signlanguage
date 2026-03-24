@echo off
echo --- Installing Python dependencies ---
pip install -r requirements.txt
pip install fastapi uvicorn python-multipart

echo.
echo --- Installing Root Node modules ---
npm install

echo.
echo --- Installing Voice Node modules ---
cd voice
npm install

echo.
echo --- Done ---
pause
