Crop Recommendation System

An AI-powered crop recommendation application with:

•
FastAPI backend

•
Random Forest crop recommendation model

•
Real agricultural dataset with 2,200 records

•
22 crop classes

•
Next.js and React frontend

•
Interactive soil and climate sliders

Project structure

Recommended local structure:

Plain Text


crop-recommendation/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── venv/
│   └── data/
│       └── crop_recommendation.csv
│
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json
    ├── tailwind.config.ts
    └── tsconfig.json



The backend and frontend run as two separate applications.

Requirements

Install the following software on Windows:

•
Python 3.14

•
Node.js LTS

•
npm

•
Visual Studio Code

Check the installed versions:

Plain Text


py -3.14 --version
node --version
npm --version



Python 3.14 is supported by the current dependency versions in this project.

Backend setup

Open a PowerShell terminal in the project root:

Plain Text


cd C:\Users\harsh\OneDrive\Desktop\crop-recommendation



If your folder has a different name, replace the path with your actual project path.

Create the backend virtual environment

Plain Text


py -3.14 -m venv .\backend\venv



This project can be run without activating the virtual environment. Using the full Python path avoids PowerShell execution-policy problems.

Install backend dependencies

Plain Text


.\backend\venv\Scripts\python.exe -m pip install --upgrade pip setuptools wheel
.\backend\venv\Scripts\python.exe -m pip install --only-binary=:all: -r .\backend\requirements.txt



The --only-binary=:all: option tells pip to use prebuilt packages instead of trying to compile NumPy or other dependencies.

Backend requirements

The backend\requirements.txt file should contain:

Plain Text


fastapi>=0.115
uvicorn[standard]>=0.34
numpy>=2.2
pandas>=2.2
scikit-learn>=1.7



Add the dataset

Place the real dataset at exactly:

Plain Text


backend\data\crop_recommendation.csv



The CSV should contain these columns:

Plain Text


N,P,K,temperature,humidity,ph,rainfall,label



The current dataset contains 2,200 rows and 22 crop classes.

Check the backend syntax

Plain Text


.\backend\venv\Scripts\python.exe -m py_compile .\backend\main.py



No output means that the syntax check passed.

Start the backend

Plain Text


.\backend\venv\Scripts\python.exe .\backend\main.py



The backend runs at:

Plain Text


http://127.0.0.1:8000



Keep this terminal open while using the frontend.

Test the backend health endpoint

Open this URL in a browser:

Plain Text


http://127.0.0.1:8000/health



Expected response:

JSON


{
  "status": "ok",
  "training_rows": 2200,
  "classes": 22
}



The response also includes the model OOB score and crop class names.

Open backend API documentation

FastAPI automatically provides interactive documentation at:

Plain Text


http://127.0.0.1:8000/docs



Use POST /predict with a request such as:

JSON


{
  "nitrogen": 60,
  "phosphorus": 50,
  "potassium": 50,
  "temperature": 25,
  "humidity": 65,
  "ph": 6.5,
  "rainfall": 120
}



Frontend setup

Open a second PowerShell terminal.

Go to the frontend folder:

Plain Text


cd C:\Users\harsh\OneDrive\Desktop\crop-recommendation\frontend



If the downloaded frontend folder has another name, use that folder instead.

Install the frontend packages:

Plain Text


npm install



Optional API URL configuration

By default, the frontend calls:

Plain Text


http://localhost:8000



To use a different backend URL, create a file named .env.local in the frontend folder:

Plain Text


NEXT_PUBLIC_API_URL=http://localhost:8000



Restart the frontend after changing .env.local.

Start the frontend in development mode

Plain Text


npm run dev



Open the frontend at:

Plain Text


http://localhost:3000



The backend must be running in the other terminal.

How to use the frontend

1.
Start the backend.

2.
Start the frontend.

3.
Open http://localhost:3000.

4.
Adjust the soil and climate sliders.

5.
Set rainfall, for example, to 120 mm.

6.
Click Analyze & Recommend.

7.
Review the recommended crop, confidence score, soil health, and alternative crops.

The frontend includes quick profiles for:

•
Current example

•
Rice field

•
Dry climate

Example recommendation

For these values:

Plain Text


Nitrogen:    60
Phosphorus:  50
Potassium:   50
Temperature: 25°C
Humidity:    65%
pH:          6.5
Rainfall:    120 mm



the current trained model recommends approximately:

Plain Text


Coffee



The result can vary slightly if the model or dataset changes. Rainfall by itself is not enough to recommend a crop; all seven input features are used.

Production build

Build the frontend

From the frontend folder:

Plain Text


npm run build



Start the production frontend

Plain Text


npm run start



The production frontend is normally available at:

Plain Text


http://localhost:3000



Common problems

PowerShell cannot activate Activate.ps1

Activation is not required. Use the full Python executable path:

Plain Text


.\backend\venv\Scripts\python.exe .\backend\main.py



If you still want to activate the environment temporarily:

Plain Text


Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\backend\venv\Scripts\Activate.ps1



Dataset not found

The backend expects:

Plain Text


backend\data\crop_recommendation.csv



Check it with:

Plain Text


Get-ChildItem .\backend\data



requirements.txt not found

Run the install command from the project root:

Plain Text


.\backend\venv\Scripts\python.exe -m pip install -r .\backend\requirements.txt



NumPy tries to compile and reports a missing compiler

Recreate the environment and install binary wheels:

Plain Text


Remove-Item -Recurse -Force .\backend\venv
py -3.14 -m venv .\backend\venv
.\backend\venv\Scripts\python.exe -m pip install --upgrade pip setuptools wheel
.\backend\venv\Scripts\python.exe -m pip install --only-binary=:all: -r .\backend\requirements.txt



Frontend displays “Offline”

Check that:

1.
The backend terminal is still running.

2.
http://127.0.0.1:8000/health opens successfully.

3.
The frontend is using the correct NEXT_PUBLIC_API_URL.

4.
The frontend was restarted after changing .env.local.

API request example with PowerShell

With the backend running, use:

Plain Text


$body = @{
    nitrogen = 60
    phosphorus = 50
    potassium = 50
    temperature = 25
    humidity = 65
    ph = 6.5
    rainfall = 120
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://127.0.0.1:8000/predict" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body



Daily commands

Terminal 1: backend

Plain Text


cd C:\Users\harsh\OneDrive\Desktop\crop-recommendation
.\backend\venv\Scripts\python.exe .\backend\main.py



Terminal 2: frontend

Plain Text


cd C:\Users\harsh\OneDrive\Desktop\crop-recommendation\frontend
npm run dev



Then open:

Plain Text


http://localhost:3000



