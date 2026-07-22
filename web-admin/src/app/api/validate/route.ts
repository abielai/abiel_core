import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = body?.token?.toString().trim();
    const expected = process.env.ADMIN_ACCESS_TOKEN?.trim();

    if (!expected) {
      return NextResponse.json({ error: 'No hay token configurado en el entorno' }, { status: 500 });
    }

    if (!token || token !== expected) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true, message: 'Token validado correctamente' });
    response.cookies.set({
      name: 'abiel_admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }
}
