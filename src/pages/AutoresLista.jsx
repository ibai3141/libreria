import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

/**
 * Página 1: Lista de Autores (/)
Muestra todos los autores en una lista

Cada autor muestra: nombre

Al hacer clic en un autor, navega a su página de detalle

Formulario para añadir un nuevo autor (nombre y nacionalidad opcional)

Botón "Ver Todos los Libros" que navega a la lista completa de libros

Botón "Añadir Libro" que navega al formulario para añadir libro
 */
function AutoresLista() {

  const [autores, setAutores] = useState([])
  const navigate = useNavigate()
  const [nuevoAutor, setNuevoAutor] = useState('')
  const [nuevanacionalidad, setNacionalidad] = useState('')

  useEffect(() => {

    const cargarAutores = async () => {

      try {
        const res = await fetch('http://127.0.0.1:8000/autores')
        const data = await res.json()
        setAutores(data)
      } catch (error) {

        console.error('Error al conectar con la API:', error)
      }

    }

    cargarAutores()
  }, [])

  const altaAutor = async (e) => {

    e.preventDefault()  // IMPORTANTE: evita recargar la página

    if (!nuevoAutor.trim()) return  // Validación: nombre obligatorio

    try {

      const response = await fetch('http://127.0.0.1:8000/anadirautores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nuevoAutor, nacionalidad: nuevanacionalidad })
      });

      const result = await response.json()

      if (response.ok) {

        // Actualizar la lista con el nuevo autor
        setAutores([...autores, result.data[0]])
        // Limpiar formulario
        setNuevoAutor('')
        setNacionalidad('')

      }else{
        console.error('Error en la API:', result)

      }

    } catch (error) {
      console.error("error durante el alta del autor: ", error)
    }


  }

  return (
    <div className="app">
      <h1>Lista de autores</h1>

      <form onSubmit={altaAutor} className="formulario-vertical">
        {/*PRIMER INPUT: nombre del autor */}
        <input
          type="text"
          value={nuevoAutor}
          onChange={(e) => setNuevoAutor(e.target.value)}
          placeholder="Nombre del autor"
          className="input-tarea"
          required  // Hace que el campo sea obligatorio
        />

        {/*SEGUNDO INPUT: nacionalidad (opcional) */}
        <input
          type="text"
          value={nuevanacionalidad}
          onChange={(e) => setNacionalidad(e.target.value)}
          placeholder="Nacionalidad"
          className="input-tarea"
          required
        />

        <button type="submit" className="boton-añadir">
          Añadir Autor
        </button>
        <button onClick={() => navigate('/libros')} className="boton-añadir">
          Ver Libros
        </button>
        <button onClick={() => navigate('/anadirlibro')} className="boton-añadir">
          Añadir libro
        </button>

      </form>

      {/* Lista de autores */}
      <ul className="lista-autores">
        {autores.map(autor => (
          <li key={autor.id} className="autor-item">
            {autor.nombre && ` nombre: ${autor.nombre}`}
            {autor.nacionalidad && ` nacionalidad: ${autor.nacionalidad}`}

            <button
              onClick={() => navigate(`/autores/${autor.id}`)}
              className="autor-boton"
            >
              ver detalles
            </button>

          </li>
        ))}
      </ul>

    </div>
  )


}

export default AutoresLista