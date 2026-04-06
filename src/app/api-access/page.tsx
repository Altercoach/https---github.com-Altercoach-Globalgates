import React from 'react';

export default function ApiAccessPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4">Acceso a la API</h1>
      <p className="mb-4">Para acceder a nuestra API, debes registrarte y solicitar acceso. Cada solicitud es revisada y autorizada manualmente para garantizar un uso responsable.</p>
      <ol className="list-decimal ml-6 mb-4 space-y-2">
        <li>Regístrate o inicia sesión en la plataforma.</li>
        <li>Completa el formulario de solicitud de acceso a la API (próximamente).</li>
        <li>Describe el caso de uso y justifica la necesidad de acceso.</li>
        <li>Recibirás una notificación por email cuando tu solicitud sea aprobada o rechazada.</li>
      </ol>
      <h2 className="text-xl font-semibold mt-6 mb-2">Documentación de la API</h2>
      <p>Consulta la <a href="/API_REFERENCE.md" className="text-blue-600 underline">documentación de endpoints</a> para ver métodos, ejemplos y límites de uso.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Soporte</h2>
      <p>¿Dudas? Escribe a <a href="mailto:api@goldenkey.website" className="text-blue-600 underline">api@goldenkey.website</a>.</p>
    </main>
  );
}
