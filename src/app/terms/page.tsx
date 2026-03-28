import React from 'react';

export default function TermsPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4">Términos y Condiciones</h1>
      <ol className="list-decimal ml-6 mb-4 space-y-2">
        <li><b>Uso del Servicio:</b> El usuario se compromete a utilizar la plataforma conforme a la ley y a las buenas costumbres.</li>
        <li><b>Propiedad Intelectual:</b> Todo el contenido, marcas y software son propiedad de GlobalGate Agency o sus licenciantes.</li>
        <li><b>Límites de Responsabilidad:</b> No garantizamos resultados específicos. El uso es bajo tu propio riesgo.</li>
        <li><b>Jurisdicción:</b> Cualquier disputa será resuelta bajo la jurisdicción de la Ciudad de México, México.</li>
        <li><b>Modificaciones:</b> Nos reservamos el derecho de modificar estos términos. Los cambios serán notificados en la plataforma.</li>
      </ol>
      <h2 className="text-xl font-semibold mt-6 mb-2">Contacto</h2>
      <p>Para dudas legales, escribe a <a href="mailto:legal@globalgate.com" className="text-blue-600 underline">legal@globalgate.com</a>.</p>
    </main>
  );
}
