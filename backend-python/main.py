from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Crear cliente de Supabase
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

app = FastAPI()

# CONFIGURACIÓN CORS - ESTO ES LO CRÍTICO
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://libreria-theta.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/autores")
async def getAutores():
    response = supabase.table("autores").select("*").execute()
    return response.data
