import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client


load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://libreria-theta.vercel.app",
    "https://libreria-theta.vercel.app/",  # A veces con barra también funciona
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # Quién puede llamar a tu API
    allow_credentials=True,
    allow_methods=["*"],         # Permite todos los métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],         # Permite todas las cabeceras
)

@app.get("/autores")
async def getAutores():
    response = supabase.table("autores").select("*").execute()
    return response.data
