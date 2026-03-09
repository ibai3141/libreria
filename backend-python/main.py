import os
from dotenv import load_dotenv
from fastapi import FastAPI
from supabase import create_client
import uvicorn


load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)


app = FastAPI()

@app.get("/autores")
async def getAutores():
    response = supabase.table("autores").select("*").execute()
    return response.data
