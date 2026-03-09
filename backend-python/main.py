from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from supabase import create_client
from pydantic import BaseModel


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
    allow_origins=["*"],  # Temporal para pruebas, NO para producción
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

@app.get("/autores")
async def getAutores():
    response = supabase.table("autores").select("*").execute()
    return response.data

class AutorCreate(BaseModel):
    nombre: str
    nacionalidad: str
    
class LibroCreate(BaseModel):
    titulo:str
    id: int

@app.post("/anadirautores")
async def altaAutor(autor : AutorCreate):
    response = supabase.table("autores").insert([{
        "nombre":autor.nombre, 
        "nacionalidad":autor.nacionalidad}]).execute()
    
    return {"mensaje": "Autor creado", "data": response.data}


@app.get("/autores/{id}")
async def get_Autor(id : int):
    autor = supabase.table("autores").select("*").eq("id", id).execute()
    
    # Obtener sus libros
    libros = supabase.table("libros").select("*").eq("autor_id", id).execute()
    
    return {
        "autor": autor.data,
        "libros": libros.data
    }

@app.post("/libro")
async def altaLibro(libro : LibroCreate):
    response = supabase.table("libros").insert([{
        "titulo":libro.titulo,
        "autor_id":libro.id}]).execute()
    
    return {"mensaje": "libro creado", "data" : response.data}
