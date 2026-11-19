import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Idoso, ItemFilaOffline, RegistroVisita } from '@termovida/shared'
import {
  enviarFila,
  limparTudo,
  listarFila,
  listarVisitas,
  registrarVisita,
  semear,
  ultimoEnvio,
} from './db'

interface Estado {
  carregando: boolean
  online: boolean
  idosos: Idoso[]
  fila: ItemFilaOffline[]
  ultimoEnvioEm: string | null
  registrar: (r: RegistroVisita) => Promise<void>
  sincronizar: () => Promise<{ ok: boolean; enviados: number }>
  sair: () => Promise<void>
}

const Ctx = createContext<Estado | null>(null)

/** Estado real da conexão, não um botão de mentirinha. */
function useOnline(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  useEffect(() => {
    const sobe = () => setOnline(true)
    const cai = () => setOnline(false)
    window.addEventListener('online', sobe)
    window.addEventListener('offline', cai)
    return () => {
      window.removeEventListener('online', sobe)
      window.removeEventListener('offline', cai)
    }
  }, [])
  return online
}

export function ProvedorEstado({ children }: { children: ReactNode }) {
  const online = useOnline()
  const [carregando, setCarregando] = useState(true)
  const [idosos, setIdosos] = useState<Idoso[]>([])
  const [fila, setFila] = useState<ItemFilaOffline[]>([])
  const [ultimoEnvioEm, setUltimoEnvioEm] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    const [lista, f, envio] = await Promise.all([listarVisitas(), listarFila(), ultimoEnvio()])
    setIdosos(lista)
    setFila(f)
    setUltimoEnvioEm(envio)
  }, [])

  useEffect(() => {
    let vivo = true
    ;(async () => {
      await semear()
      if (!vivo) return
      await recarregar()
      if (vivo) setCarregando(false)
    })().catch((e) => {
      console.error('TermoVida Campo: falha ao abrir o armazenamento local', e)
      if (vivo) setCarregando(false)
    })
    return () => {
      vivo = false
    }
  }, [recarregar])

  const registrar = useCallback(
    async (r: RegistroVisita) => {
      await registrarVisita(r)
      await recarregar()
    },
    [recarregar],
  )

  const sincronizar = useCallback(async () => {
    try {
      const enviados = await enviarFila()
      await recarregar()
      return { ok: true, enviados }
    } catch {
      return { ok: false, enviados: 0 }
    }
  }, [recarregar])

  const sair = useCallback(async () => {
    await limparTudo()
    await semear()
    await recarregar()
  }, [recarregar])

  const valor = useMemo<Estado>(
    () => ({ carregando, online, idosos, fila, ultimoEnvioEm, registrar, sincronizar, sair }),
    [carregando, online, idosos, fila, ultimoEnvioEm, registrar, sincronizar, sair],
  )

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useEstado(): Estado {
  const v = useContext(Ctx)
  if (!v) throw new Error('useEstado precisa estar dentro de <ProvedorEstado>')
  return v
}

export function useIdoso(id: string | undefined): Idoso | undefined {
  const { idosos } = useEstado()
  return idosos.find((i) => i.id === id)
}
