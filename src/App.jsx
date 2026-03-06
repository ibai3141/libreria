import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AutoresLista from './pages/AutoresLista'
import AutorDetalle from './pages/AutorDetalle'
import './App.css'

function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AutoresLista/>}/>
        <Route path='/autores/:id' element={<AutorDetalle />} />

      </Routes>
    </BrowserRouter>
  )

}

export default App