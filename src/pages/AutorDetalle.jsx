import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useParams, useNavigate, Navigate } from 'react-router-dom'

/**Página 2: Detalle de Autor (/autores/:id)
Muestra el nombre del autor y su nacionalidad

Muestra solo los libros de ese autor

Formulario para añadir un nuevo libro a este autor

Cada libro muestra: título y un botón para marcar/desmarcar como "publicado"

Al marcar/desmarcar, debe actualizarse en la base de datos

Botón "Volver" que regresa a la lista de autores */
function AutorDetalle() {

    const [libros, setLibros] = useState([])
    const { id } = useParams()//extrae los parametros de la URL
    const [autor, setAutor] = useState(null)
    const [nuevoTitulo, setTitulo] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        const cargarLibros = async () => {

            const { data: autordata } = await supabase
                .from('autores')
                .select('*')
                .eq('id', id)
                .single()

            setAutor(autordata)



            const { data: librosdata } = await supabase
                .from('libros')
                .select('*')
                .eq('autor_id', id)

            setLibros(librosdata || [])
        }

        cargarLibros()

    }, [id])


    const altaLibro = async (e) => {
        e.preventDefault()
        try {
            const { data } = await supabase
                .from('libros')
                .insert({ titulo: nuevoTitulo, autor_id: id })
                .select()

            if (data) {
                setLibros([...libros, data[0]])
                setTitulo('')
            }

        } catch (error) {

            console.error("error durante el alta del nuevo libro: ", error)

        }
    }

    const setPublicado = async (idTitulo, publicadoActual) => {
        try {
            await supabase
                .from('libros')
                .update({ publicado: !publicadoActual })
                .eq('id', idTitulo)

            // Actualizar el estado LOCAL correctamente
            setLibros(libros.map(libro =>
                libro.id === idTitulo
                    ? { ...libro, publicado: !publicadoActual }
                    : libro
            ))

        } catch (error) {
            console.error("Error al cambiar el estado de publicación: ", error)
        }
    }

    if (!autor) {
        return <div className="app">Cargando autor...</div>
    }




    return (
        <div className='app'>
            <h2>Libros de {autor.nombre}</h2>

            <form onSubmit={altaLibro}>
                <input
                    type='text'
                    value={nuevoTitulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder='nombre del titulo'
                    required>
                </input>

                <button type='submit'>
                    añadir titulo
                </button>

            </form>


            <ul className="lista-libros">
                {libros.map(libro => (
                    <li key={libro.id} className="libro-item">
                        <span>{libro.titulo}</span>
                        <button
                            onClick={() => setPublicado(libro.id, libro.publicado)}
                            className={`boton-estado ${libro.publicado ? 'publicado' : 'no-publicado'}`}
                        >
                            {libro.publicado ? 'disponible' : 'agotado'}
                        </button>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => navigate('/')}
                className="boton-volver"
            >
                Volver a Autores
            </button>




        </div>
    )
}

export default AutorDetalle 