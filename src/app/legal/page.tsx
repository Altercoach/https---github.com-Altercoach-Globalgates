import React from 'react';

export default function LegalPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-3">Aviso Legal y Límites de Responsabilidad</h1>
      <p className="text-sm text-muted-foreground mb-6">Última actualización: 2026-01-01</p>

      <p className="mb-4">
        Este aviso regula el alcance de responsabilidades derivadas del uso de la plataforma de Goldek Key International,
        incluyendo sus módulos de automatización, analítica y asistencia digital.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Naturaleza del servicio</h2>
      <p className="mb-4">
        El servicio se proporciona sobre una base de mejor esfuerzo y disponibilidad razonable. Aunque aplicamos controles de calidad,
        no garantizamos continuidad ininterrumpida, ausencia total de errores ni resultados comerciales específicos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Limitación de responsabilidad</h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>En la máxima medida permitida por ley, se excluyen daños indirectos, incidentales, punitivos o consecuenciales.</li>
        <li>La responsabilidad agregada del prestador se limita al monto efectivamente pagado por el cliente en el periodo reciente aplicable.</li>
        <li>El cliente conserva responsabilidad sobre decisiones comerciales, campañas, segmentación y cumplimiento sectorial.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Servicios de terceros</h2>
      <p className="mb-4">
        La plataforma puede integrar APIs o servicios externos. No controlamos su disponibilidad o políticas,
        por lo que cualquier impacto causado por terceros queda sujeto a sus propios términos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Propiedad intelectual y reclamaciones</h2>
      <p className="mb-4">
        El contenido y software original están protegidos por legislación de propiedad intelectual.
        Si detectas una posible infracción, envía una notificación detallada para revisión y, en su caso, retiro de contenido.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Contacto legal y de reclamaciones</h2>
      <p>
        Correo legal general:{' '}
        <a href="mailto:legal@goldenkey.website" className="text-blue-600 underline">legal@goldenkey.website</a>
        <br />
        Reportes de propiedad intelectual:{' '}
        <a href="mailto:dmca@goldenkey.website" className="text-blue-600 underline">dmca@goldenkey.website</a>
      </p>
    </main>
  );
}
