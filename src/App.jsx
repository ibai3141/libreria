import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AutoresLista from './pages/AutoresLista'
import AutorDetalle from './pages/AutorDetalle'
import LibrosLista from './pages/LibrosLista'
import './App.css'

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AutoresLista/>}/>
        <Route path='/libros' element={<LibrosLista/>}/>
        <Route path='/autores/:id' element={<AutorDetalle />} />

      </Routes>
    </BrowserRouter>
  )

}

export default App