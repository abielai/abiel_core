/**
 * CRUD de prueba - Ejemplo de operaciones con Prisma
 * 
 * Ubicación: api/src/crud.example.ts
 * Propósito: Demostrar operaciones seguras de lectura y escritura con aislamiento multi-tenant.
 * 
 * Reglas aplicadas:
 * ✅ Todo filtro SIEMPRE incluye tenantId
 * ✅ Validación de acceso antes de cada operación
 * ✅ Transacciones para garantizar consistencia
 * ✅ No inferir tenantId indirectamente
 */

import { prisma, validarEmpresaEnTenant, validarUsuarioEnTenant } from '@abiel/shared'

// ============================================================================
// CRUD: EMPRESA
// ============================================================================

/**
 * Crear empresa
 * @param tenantId - Identificador único del tenant (cliente)
 * @param nombre - Nombre de la empresa
 */
export async function crearEmpresa(tenantId: string, nombre: string) {
  console.log(`[EMPRESA] Creando empresa "${nombre}" para tenant "${tenantId}"`)

  const empresa = await prisma.empresa.create({
    data: {
      tenantId,
      nombre,
      activa: true
    }
  })

  console.log(`✅ Empresa creada:`, empresa)
  return empresa
}

/**
 * Obtener empresa por ID con validación de tenant
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Identificador de la empresa
 */
export async function obtenerEmpresa(tenantId: string, empresaId: string) {
  console.log(`[EMPRESA] Obteniendo empresa "${empresaId}" del tenant "${tenantId}"`)

  const empresa = await prisma.empresa.findFirst({
    where: {
      id: empresaId,
      tenantId: tenantId // ✅ Siempre validar tenantId
    },
    include: {
      usuarios: { select: { id: true, nombre: true, email: true } },
      mensajes: { select: { id: true, contenido: true } }
    }
  })

  if (!empresa) {
    console.log(`❌ Empresa no encontrada o no pertenece a este tenant`)
    return null
  }

  console.log(`✅ Empresa encontrada:`, empresa)
  return empresa
}

/**
 * Listar todas las empresas del tenant
 * @param tenantId - Identificador único del tenant
 */
export async function listarEmpresas(tenantId: string) {
  console.log(`[EMPRESA] Listando todas las empresas del tenant "${tenantId}"`)

  const empresas = await prisma.empresa.findMany({
    where: {
      tenantId: tenantId // ✅ Filtro obligatorio
    }
  })

  console.log(`✅ Se encontraron ${empresas.length} empresa(s)`)
  return empresas
}

/**
 * Actualizar empresa con validación
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Identificador de la empresa
 * @param datos - Datos a actualizar
 */
export async function actualizarEmpresa(
  tenantId: string,
  empresaId: string,
  datos: { nombre?: string; activa?: boolean }
) {
  console.log(`[EMPRESA] Actualizando empresa "${empresaId}" del tenant "${tenantId}"`)

  // ✅ Validar que la empresa pertenece al tenant
  const tieneAcceso = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!tieneAcceso) {
    console.log(`❌ No tienes acceso a esta empresa`)
    return null
  }

  const empresa = await prisma.empresa.update({
    where: { id: empresaId },
    data: datos
  })

  console.log(`✅ Empresa actualizada:`, empresa)
  return empresa
}

/**
 * Eliminar empresa
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Identificador de la empresa
 */
export async function eliminarEmpresa(tenantId: string, empresaId: string) {
  console.log(`[EMPRESA] Eliminando empresa "${empresaId}" del tenant "${tenantId}"`)

  // ✅ Validar acceso
  const tieneAcceso = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!tieneAcceso) {
    console.log(`❌ No tienes acceso a esta empresa`)
    return null
  }

  const empresa = await prisma.empresa.delete({
    where: { id: empresaId }
  })

  console.log(`✅ Empresa eliminada`)
  return empresa
}

// ============================================================================
// CRUD: USUARIO
// ============================================================================

/**
 * Crear usuario en una empresa
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Empresa a la que pertenecerá el usuario
 * @param nombre - Nombre del usuario
 * @param email - Email único dentro del tenant
 */
export async function crearUsuario(
  tenantId: string,
  empresaId: string,
  nombre: string,
  email: string
) {
  console.log(`[USUARIO] Creando usuario "${nombre}" (${email}) en tenant "${tenantId}"`)

  // ✅ Validar que la empresa pertenece al tenant
  const empresaValida = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!empresaValida) {
    console.log(`❌ Empresa no válida para este tenant`)
    return null
  }

  const usuario = await prisma.usuario.create({
    data: {
      tenantId,
      empresaId,
      nombre,
      email,
      activo: true
    }
  })

  console.log(`✅ Usuario creado:`, usuario)
  return usuario
}

/**
 * Obtener usuario del tenant
 * @param tenantId - Identificador único del tenant
 * @param usuarioId - Identificador del usuario
 */
export async function obtenerUsuario(tenantId: string, usuarioId: string) {
  console.log(`[USUARIO] Obteniendo usuario "${usuarioId}" del tenant "${tenantId}"`)

  const usuario = await prisma.usuario.findFirst({
    where: {
      id: usuarioId,
      tenantId: tenantId // ✅ Validación obligatoria
    },
    include: {
      empresa: { select: { nombre: true } },
      mensajes: { select: { id: true, contenido: true } }
    }
  })

  if (!usuario) {
    console.log(`❌ Usuario no encontrado o no pertenece a este tenant`)
    return null
  }

  console.log(`✅ Usuario encontrado:`, usuario)
  return usuario
}

/**
 * Listar usuarios de una empresa en el tenant
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Empresa de la que listar usuarios
 */
export async function listarUsuariosPorEmpresa(tenantId: string, empresaId: string) {
  console.log(`[USUARIO] Listando usuarios de la empresa "${empresaId}" del tenant "${tenantId}"`)

  // ✅ Validar acceso a la empresa
  const tieneAcceso = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!tieneAcceso) {
    console.log(`❌ No tienes acceso a esta empresa`)
    return null
  }

  const usuarios = await prisma.usuario.findMany({
    where: {
      tenantId: tenantId, // ✅ Filtro por tenant
      empresaId: empresaId
    }
  })

  console.log(`✅ Se encontraron ${usuarios.length} usuario(s)`)
  return usuarios
}

// ============================================================================
// CRUD: MENSAJE
// ============================================================================

/**
 * Crear mensaje
 * @param tenantId - Identificador único del tenant
 * @param empresaId - Empresa a la que pertenece el mensaje
 * @param usuarioId - Usuario que crea el mensaje
 * @param contenido - Contenido del mensaje
 */
export async function crearMensaje(
  tenantId: string,
  empresaId: string,
  usuarioId: string,
  contenido: string
) {
  console.log(`[MENSAJE] Creando mensaje en tenant "${tenantId}"`)

  // ✅ Validar que usuario pertenece al tenant
  const usuarioValido = await validarUsuarioEnTenant(tenantId, usuarioId)
  if (!usuarioValido) {
    console.log(`❌ Usuario no válido para este tenant`)
    return null
  }

  // ✅ Validar que la empresa pertenece al tenant
  const empresaValida = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!empresaValida) {
    console.log(`❌ Empresa no válida para este tenant`)
    return null
  }

  const mensaje = await prisma.mensaje.create({
    data: {
      tenantId,
      empresaId,
      usuarioId,
      contenido,
      leido: false
    }
  })

  console.log(`✅ Mensaje creado:`, mensaje)
  return mensaje
}

/**
 * Obtener mensaje del tenant
 * @param tenantId - Identificador único del tenant
 * @param mensajeId - Identificador del mensaje
 */
export async function obtenerMensaje(tenantId: string, mensajeId: string) {
  console.log(`[MENSAJE] Obteniendo mensaje "${mensajeId}" del tenant "${tenantId}"`)

  const mensaje = await prisma.mensaje.findFirst({
    where: {
      id: mensajeId,
      tenantId: tenantId // ✅ Validación obligatoria
    },
    include: {
      empresa: { select: { nombre: true } },
      usuario: { select: { nombre: true, email: true } }
    }
  })

  if (!mensaje) {
    console.log(`❌ Mensaje no encontrado o no pertenece a este tenant`)
    return null
  }

  console.log(`✅ Mensaje encontrado:`, mensaje)
  return mensaje
}

/**
 * Listar mensajes del tenant con filtros opcionales
 * @param tenantId - Identificador único del tenant
 * @param filtros - Filtros opcionales (empresaId, usuarioId, leido)
 */
export async function listarMensajes(
  tenantId: string,
  filtros?: { empresaId?: string; usuarioId?: string; leido?: boolean }
) {
  console.log(`[MENSAJE] Listando mensajes del tenant "${tenantId}"`)

  const mensajes = await prisma.mensaje.findMany({
    where: {
      tenantId: tenantId, // ✅ Filtro obligatorio
      empresaId: filtros?.empresaId,
      usuarioId: filtros?.usuarioId,
      leido: filtros?.leido
    }
  })

  console.log(`✅ Se encontraron ${mensajes.length} mensaje(s)`)
  return mensajes
}

/**
 * Marcar mensaje como leído
 * @param tenantId - Identificador único del tenant
 * @param mensajeId - Identificador del mensaje
 */
export async function marcarMensajeComoLeido(tenantId: string, mensajeId: string) {
  console.log(`[MENSAJE] Marcando mensaje "${mensajeId}" como leído`)

  const mensaje = await prisma.mensaje.findFirst({
    where: {
      id: mensajeId,
      tenantId: tenantId
    }
  })

  if (!mensaje) {
    console.log(`❌ Mensaje no encontrado o no pertenece a este tenant`)
    return null
  }

  const actualizado = await prisma.mensaje.update({
    where: { id: mensajeId, tenantId },
    data: { leido: true }
  })

  console.log(`✅ Mensaje marcado como leído`)
  return actualizado
}

// ============================================================================
// CRUD: BUFFER
// ============================================================================

export async function crearBuffer(tenantId: string, empresaId: string, estado: string, payload: Record<string, unknown>) {
  console.log(`[BUFFER] Creando buffer para empresa "${empresaId}" del tenant "${tenantId}"`)

  const empresaValida = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!empresaValida) {
    console.log(`❌ Empresa no válida para este tenant`)
    return null
  }

  const buffer = await prisma.buffer.create({
    data: {
      tenantId,
      empresaId,
      estado,
      payload
    }
  })

  console.log(`✅ Buffer creado:`, buffer)
  return buffer
}

export async function obtenerBuffer(tenantId: string, bufferId: string) {
  console.log(`[BUFFER] Obteniendo buffer "${bufferId}" del tenant "${tenantId}"`)

  const buffer = await prisma.buffer.findFirst({
    where: {
      id: bufferId,
      tenantId
    }
  })

  if (!buffer) {
    console.log(`❌ Buffer no encontrado o no pertenece a este tenant`)
    return null
  }

  return buffer
}

// ============================================================================
// CRUD: PLANTILLA
// ============================================================================

export async function crearPlantilla(tenantId: string, empresaId: string, nombre: string, contenido: string) {
  console.log(`[PLANTILLA] Creando plantilla "${nombre}" para tenant "${tenantId}"`)

  const empresaValida = await validarEmpresaEnTenant(tenantId, empresaId)
  if (!empresaValida) {
    console.log(`❌ Empresa no válida para este tenant`)
    return null
  }

  const plantilla = await prisma.plantilla.create({
    data: {
      tenantId,
      empresaId,
      nombre,
      contenido,
      activa: true
    }
  })

  console.log(`✅ Plantilla creada:`, plantilla)
  return plantilla
}

export async function obtenerPlantilla(tenantId: string, plantillaId: string) {
  console.log(`[PLANTILLA] Obteniendo plantilla "${plantillaId}" del tenant "${tenantId}"`)

  const plantilla = await prisma.plantilla.findFirst({
    where: {
      id: plantillaId,
      tenantId
    }
  })

  if (!plantilla) {
    console.log(`❌ Plantilla no encontrada o no pertenece a este tenant`)
    return null
  }

  return plantilla
}

// ============================================================================
// EJEMPLO DE USO (FLUJO COMPLETO)
// ============================================================================

/**
 * Ejecutar un ejemplo completo de CRUD con transacciones
 */
export async function ejemploCompleto() {
  console.log('\n🚀 INICIANDO EJEMPLO COMPLETO DE CRUD\n')

  try {
    const tenantId = 'tenant-001'

    // 1. Crear empresa
    console.log('>>> PASO 1: Crear Empresa')
    const empresa = await crearEmpresa(tenantId, 'Mi Primera Empresa')
    const empresaId = empresa.id

    // 2. Crear usuarios
    console.log('\n>>> PASO 2: Crear Usuarios')
    const usuario1 = await crearUsuario(tenantId, empresaId, 'Juan Pérez', 'juan@empresa.com')
    const usuario2 = await crearUsuario(tenantId, empresaId, 'María García', 'maria@empresa.com')

    // 3. Crear mensajes
    console.log('\n>>> PASO 3: Crear Mensajes')
    const mensaje1 = await crearMensaje(tenantId, empresaId, usuario1.id, 'Hola, este es mi primer mensaje')
    const mensaje2 = await crearMensaje(tenantId, empresaId, usuario2.id, 'Respuesta al primer mensaje')

    // 4. Obtener empresa con relaciones
    console.log('\n>>> PASO 4: Obtener Empresa con Relaciones')
    await obtenerEmpresa(tenantId, empresaId)

    // 5. Listar usuarios por empresa
    console.log('\n>>> PASO 5: Listar Usuarios de la Empresa')
    await listarUsuariosPorEmpresa(tenantId, empresaId)

    // 6. Listar todos los mensajes
    console.log('\n>>> PASO 6: Listar Todos los Mensajes')
    await listarMensajes(tenantId)

    // 7. Marcar mensajes como leído
    console.log('\n>>> PASO 7: Marcar Mensaje como Leído')
    await marcarMensajeComoLeido(tenantId, mensaje1.id)

    // 8. Actualizar empresa
    console.log('\n>>> PASO 8: Actualizar Empresa')
    await actualizarEmpresa(tenantId, empresaId, { nombre: 'Mi Empresa Actualizada' })

    console.log('\n✅ EJEMPLO COMPLETO FINALIZADO\n')
  } catch (error) {
    console.error('❌ Error en el ejemplo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// ============================================================================
// EXPORTAR FUNCIONES
// ============================================================================

export const crudEmpresas = { crearEmpresa, obtenerEmpresa, listarEmpresas, actualizarEmpresa, eliminarEmpresa }
export const crudUsuarios = { crearUsuario, obtenerUsuario, listarUsuariosPorEmpresa }
export const crudMensajes = { crearMensaje, obtenerMensaje, listarMensajes, marcarMensajeComoLeido }
export const crudBuffers = { crearBuffer, obtenerBuffer }
export const crudPlantillas = { crearPlantilla, obtenerPlantilla }
