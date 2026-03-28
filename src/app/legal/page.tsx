import React from 'react';

export default function LegalPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4">Aviso Legal y Límite de Responsabilidad</h1>
      <p className="mb-4">El uso de esta plataforma implica la aceptación de los siguientes términos legales:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>El software y los contenidos se proveen "tal cual" sin garantías de ningún tipo.</li>
        <li>No somos responsables por daños directos, indirectos o incidentales derivados del uso.</li>
        <li>Si detectas contenido que infringe derechos, contáctanos para su revisión y remoción (DMCA).</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Propiedad Intelectual</h2>
      <p className="mb-4">Todo el código y contenido original está protegido por derechos de autor y licencias libres compatibles.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contacto DMCA</h2>
      <p>Para reportes de copyright, escribe a <a href="mailto:dmca@globalgate.com" className="text-blue-600 underline">dmca@globalgate.com</a>.</p>
    </main>
  );
}
