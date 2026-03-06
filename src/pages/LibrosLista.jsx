import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

function LibrosLista() {
  const [libros, setLibros] = useState([])
  const [autores, setAutores] = useState([])
  const [autorSeleccionado, setAutorSeleccionado] = useState('todos')
  const navigate = useNavigate()

  // Cargar autores para el desplegable
  useEffect(() => {
    const cargarAutores = async () => {
      const { data } = await supabase
        .from('autores')
        .select('id, nombre')
        .order('nombre')
      setAutores(data || [])
    }
    cargarAutores()
  }, [])

  // Cargar libros (con filtro por autor si es necesario)
  useEffect(() => {
    const cargarLibros = async () => {
      let query = supabase
        .from('libros')
        .select('*,autores (nombre,nacionalidad)')

      // Si se seleccionó un autor específico, filtrar
      if (autorSeleccionado !== 'todos') {
        query = query.eq('autor_id', autorSeleccionado)
      }

      const { data } = await query.order('titulo')
      setLibros(data || [])
    }

    cargarLibros()
  }, [autorSeleccionado]) // Se ejecuta cuando cambia el autor seleccionado

  return (
    <div className="app">
      <h1>Todos los Libros</h1>

      {/* Botón para volver */}
      <button onClick={() => navigate('/')} className="boton-secundario">
        ← Volver a Autores
      </button>

      {/* SELECTOR (desplegable) para filtrar por autor */}
      <div className="filtros">
        <label htmlFor="filtro-autor">Filtrar por autor: </label>
        <select
          id="filtro-autor"
          value={autorSeleccionado}
          onChange={(e) => setAutorSeleccionado(e.target.value)}
          className="select-filtro"
        >
          <option value="todos">Todos los autores</option>
          {autores.map(autor => (
            <option key={autor.id} value={autor.id}>
              {autor.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de libros filtrados */}
      <ul className="lista-libros">
        {libros.map(libro => (
          <li key={libro.id} className="libro-item">
            <div className="libro-info">
              <span className="libro-titulo">{libro.titulo}</span>
            </div>
            <span className={`estado ${libro.publicado ? 'publicado' : 'no-publicado'}`}>
              {libro.publicado ? '✅ Publicado' : '📝 No publicado'}
            </span>
          </li>
        ))}
      </ul>

      {libros.length === 0 && (
        <p className="mensaje-vacio">No hay libros con este filtro</p>
      )}
    </div>
  )
}

export default LibrosLista