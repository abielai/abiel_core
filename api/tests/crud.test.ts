import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the shared package to provide an in-memory prisma and validators
vi.mock('@abiel/shared', () => {
  const dataStore: any = { empresas: [], usuarios: [], mensajes: [] }
  let idCounter = 1

  const genId = (prefix: string) => `${prefix}-${idCounter++}`

  const prisma = {
    empresa: {
      create: async ({ data }: any) => {
        const e = { id: genId('emp'), ...data }
        dataStore.empresas.push(e)
        return e
      },
      findFirst: async ({ where }: any) =>
        dataStore.empresas.find((e: any) => e.id === where.id && e.tenantId === where.tenantId) || null,
      findMany: async ({ where }: any) =>
        dataStore.empresas.filter((e: any) => e.tenantId === where.tenantId)
      ,
      update: async ({ where, data }: any) => {
        const idx = dataStore.empresas.findIndex((e: any) => e.id === where.id)
        if (idx === -1) throw new Error('not found')
        dataStore.empresas[idx] = { ...dataStore.empresas[idx], ...data }
        return dataStore.empresas[idx]
      },
      delete: async ({ where }: any) => {
        const idx = dataStore.empresas.findIndex((e: any) => e.id === where.id)
        if (idx === -1) throw new Error('not found')
        const [removed] = dataStore.empresas.splice(idx, 1)
        return removed
      }
    },
    usuario: {
      create: async ({ data }: any) => {
        const u = { id: genId('user'), ...data }
        dataStore.usuarios.push(u)
        return u
      },
      findFirst: async ({ where }: any) =>
        dataStore.usuarios.find((u: any) => u.id === where.id && u.tenantId === where.tenantId) || null,
      findMany: async ({ where }: any) =>
        dataStore.usuarios.filter((u: any) => u.tenantId === where.tenantId && (!where.empresaId || u.empresaId === where.empresaId))
    },
    mensaje: {
      create: async ({ data }: any) => {
        const m = { id: genId('msg'), ...data }
        dataStore.mensajes.push(m)
        return m
      },
      findFirst: async ({ where }: any) =>
        dataStore.mensajes.find((m: any) => m.id === where.id && m.tenantId === where.tenantId) || null,
      findMany: async ({ where }: any) =>
        dataStore.mensajes.filter((m: any) => m.tenantId === where.tenantId && (where.empresaId ? m.empresaId === where.empresaId : true)),
      update: async ({ where, data }: any) => {
        const idx = dataStore.mensajes.findIndex((m: any) => m.id === where.id)
        if (idx === -1) throw new Error('not found')
        dataStore.mensajes[idx] = { ...dataStore.mensajes[idx], ...data }
        return dataStore.mensajes[idx]
      }
    },
    buffer: {
      create: async ({ data }: any) => {
        const b = { id: genId('buf'), ...data }
        dataStore.empresas.push({ ...b })
        return b
      },
      findFirst: async ({ where }: any) =>
        dataStore.empresas.find((e: any) => e.id === where.id && e.tenantId === where.tenantId) || null
    },
    plantilla: {
      create: async ({ data }: any) => {
        const p = { id: genId('tpl'), ...data }
        dataStore.empresas.push({ ...p })
        return p
      },
      findFirst: async ({ where }: any) =>
        dataStore.empresas.find((e: any) => e.id === where.id && e.tenantId === where.tenantId) || null
    }
  }

  const validarEmpresaEnTenant = async (tenantId: string, empresaId: string) => {
    return dataStore.empresas.some((e: any) => e.id === empresaId && e.tenantId === tenantId)
  }

  const validarUsuarioEnTenant = async (tenantId: string, usuarioId: string) => {
    return dataStore.usuarios.some((u: any) => u.id === usuarioId && u.tenantId === tenantId)
  }

  return { prisma, validarEmpresaEnTenant, validarUsuarioEnTenant }
})

import {
  crearEmpresa,
  obtenerEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  crearUsuario,
  crearMensaje,
  obtenerMensaje,
  marcarMensajeComoLeido,
  listarMensajes,
  crearBuffer,
  obtenerBuffer,
  crearPlantilla,
  obtenerPlantilla
} from '../src/crud.example'

describe('CRUD básico (mocked in-memory)', () => {
  const tenant = 'tenant-test'
  let empresaId: string
  let usuarioId: string
  let mensajeId: string

  it('crea y obtiene una empresa', async () => {
    const empresa = await crearEmpresa(tenant, 'ACME')
    empresaId = empresa.id
    expect(empresa).toHaveProperty('id')
    const fetched = await obtenerEmpresa(tenant, empresaId)
    expect(fetched).not.toBeNull()
    expect(fetched?.nombre).toBe('ACME')
  })

  it('crea un usuario en la empresa', async () => {
    const usuario = await crearUsuario(tenant, empresaId, 'Alice', 'alice@example.com')
    usuarioId = usuario.id
    expect(usuario).toHaveProperty('id')
    const fetchedUser = await (await import('../src/crud.example')).obtenerUsuario(tenant, usuarioId)
    expect(fetchedUser).not.toBeNull()
    expect(fetchedUser?.email).toBe('alice@example.com')
  })

  it('crea y obtiene un mensaje, luego lo marca como leído', async () => {
    const mensaje = await crearMensaje(tenant, empresaId, usuarioId, 'hola')
    mensajeId = mensaje.id
    const fetched = await obtenerMensaje(tenant, mensajeId)
    expect(fetched).not.toBeNull()
    expect(fetched?.contenido).toBe('hola')

    const marcado = await marcarMensajeComoLeido(tenant, mensajeId)
    expect(marcado).not.toBeNull()
    expect(marcado?.leido).toBe(true)
  })

  it('lista mensajes del tenant', async () => {
    const msgs = await listarMensajes(tenant)
    expect(Array.isArray(msgs)).toBe(true)
    expect(msgs.length).toBeGreaterThanOrEqual(1)
  })

  it('actualiza y elimina empresa', async () => {
    const actualizado = await actualizarEmpresa(tenant, empresaId, { nombre: 'ACME S.A.' })
    expect(actualizado).not.toBeNull()
    expect(actualizado?.nombre).toBe('ACME S.A.')

    const eliminado = await eliminarEmpresa(tenant, empresaId)
    expect(eliminado).not.toBeNull()
  })

  it('gestiona buffers y plantillas con aislamiento por tenant', async () => {
    const nuevaEmpresa = await crearEmpresa(tenant, 'Buffer Test')
    const empresaBufferId = nuevaEmpresa.id

    const buffer = await crearBuffer(tenant, empresaBufferId, 'pending', { step: 'validation' })
    expect(buffer).not.toBeNull()
    expect(buffer?.tenantId).toBe(tenant)

    const bufferRecuperado = await obtenerBuffer(tenant, buffer!.id)
    expect(bufferRecuperado).not.toBeNull()
    expect(bufferRecuperado?.estado).toBe('pending')

    const plantilla = await crearPlantilla(tenant, empresaBufferId, 'bienvenida', 'Hola, bienvenido')
    expect(plantilla).not.toBeNull()
    expect(plantilla?.tenantId).toBe(tenant)

    const plantillaRecuperada = await obtenerPlantilla(tenant, plantilla!.id)
    expect(plantillaRecuperada).not.toBeNull()
    expect(plantillaRecuperada?.contenido).toContain('bienvenido')
  })
})
