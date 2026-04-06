import React from 'react';

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-3">Términos y Condiciones</h1>
      <p className="text-sm text-muted-foreground mb-6">Última actualización: 2026-01-01</p>

      <ol className="list-decimal ml-6 mb-4 space-y-3">
        <li>
          <b>Aceptación de los términos:</b> Al acceder o usar la plataforma de Goldek Key International,
          aceptas estas condiciones y la normativa aplicable.
        </li>
        <li>
          <b>Uso permitido:</b> El servicio debe utilizarse con fines lícitos. Está prohibido el uso para actividades
          fraudulentas, invasión de sistemas, spam malicioso o vulneración de derechos de terceros.
        </li>
        <li>
          <b>Cuenta y seguridad:</b> Eres responsable de mantener la confidencialidad de tus credenciales y de las acciones
          realizadas desde tu cuenta.
        </li>
        <li>
          <b>Pagos y facturación:</b> Los precios, impuestos, renovaciones y condiciones comerciales se muestran antes de confirmar
          una compra. La falta de pago puede generar suspensión de servicios activos.
        </li>
        <li>
          <b>Propiedad intelectual:</b> El software, diseño, marca y contenidos originales de la plataforma son propiedad de
          Goldek Key International o sus licenciantes. No se concede cesión de derechos más allá del uso autorizado.
        </li>
        <li>
          <b>Disponibilidad y cambios:</b> Podemos actualizar, modificar o discontinuar funcionalidades para mejorar rendimiento,
          seguridad o cumplimiento normativo.
        </li>
        <li>
          <b>Terminación:</b> Podemos suspender o cancelar cuentas por incumplimientos graves, riesgos de seguridad o requerimiento legal.
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitaciones y exclusiones</h2>
      <p className="mb-4">
        El alcance de responsabilidades, garantías y daños aplicables se detalla en nuestro Aviso Legal y Límites de Responsabilidad,
        disponible en la sección Legal del sitio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ley aplicable y jurisdicción</h2>
      <p className="mb-4">
        Estos términos se interpretan conforme a la legislación aplicable en la jurisdicción operativa principal del prestador,
        sin perjuicio de los derechos irrenunciables del consumidor en su territorio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Contacto legal</h2>
      <p>
        Para aclaraciones legales, escribe a{' '}
        <a href="mailto:legal@goldenkey.website" className="text-blue-600 underline">legal@goldenkey.website</a>.
      </p>
    </main>
  );
}
