import { Navigate, Route, Routes } from 'react-router-dom'
import { useEstado } from './estado'
import { Entrada } from './rotas/Entrada'
import { Hoje } from './rotas/Hoje'
import { Ficha } from './rotas/Ficha'
import { Registrar } from './rotas/Registrar'
import { Fila } from './rotas/Fila'

export function App() {
  const { carregando } = useEstado()

  return (
    <div className="telefone">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {carregando ? (
        <p className="vazio" role="status">
          Abrindo a lista guardada no aparelho…
        </p>
      ) : (
        <Routes>
          <Route path="/" element={<Entrada />} />
          <Route path="/hoje" element={<Hoje />} />
          <Route path="/idoso/:id" element={<Ficha />} />
          <Route path="/visita/:id" element={<Registrar />} />
          <Route path="/fila" element={<Fila />} />
          <Route path="*" element={<Navigate to="/hoje" replace />} />
        </Routes>
      )}
    </div>
  )
}
