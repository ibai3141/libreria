import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
/**Añadir Libro (/anadir-libro)
Formulario con:

Campo para el título (obligatorio)

Selector desplegable con todos los autores (obligatorio)

Al enviar, guarda el libro en la base de datos (con publicado = false)

Redirige a la lista de libros después de guardar */


function AnadirLibro() {

    const [autores, setAutores] = useState([])
    const [autorSeleccionado, setAutorSeleccionado] = useState('')
    const [nuevoTitulo, setTitulo] = useState('')
    const navigate = useNavigate()




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


    const altaLibro = async (e) => {

        e.preventDefault()  // IMPORTANTE: evita recargar la página

        if (!nuevoTitulo.trim()) return  // Validación: nombre obligatorio

        try {
            await supabase
                .from('libros')
                .insert([{ titulo: nuevoTitulo, autor_id: autorSeleccionado }])

            setTitulo('')
            navigate('/libros')  // 👈 REDIRIGIR después de guardar

        } catch (error) {

            console.error("error en el alta del libro: ", error)
        }

    }



    return (
        <div className="app">
            <button onClick={() => navigate('/')}
 className="boton-secundario">
                ← volver
            </button>
      <h1>Añadir Nuevo Libro</h1>

            <form onSubmit={altaLibro} className="formulario-vertical">
                <input
                    type="text"
                    value={nuevoTitulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título del libro"
                    className="input-tarea"
                    required
                />

                <label htmlFor="autor">Autor:</label>
                <select
                    id="autor"
                    value={autorSeleccionado}
                    onChange={(e) => setAutorSeleccionado(e.target.value)}
                    required
                >
                    <option value="">Selecciona un autor</option>
                    {autores.map(autor => (
                        <option key={autor.id} value={autor.id}>
                            {autor.nombre}
                        </option>
                    ))}
                </select>

                <button type="submit" className="boton-añadir">
                    Añadir Autor
                </button>
            </form>
        </div>
    )


}

export default AnadirLibro