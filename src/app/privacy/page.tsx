import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-3">Política de Privacidad</h1>
      <p className="text-sm text-muted-foreground mb-6">Última actualización: 2026-01-01</p>
      <p className="mb-4">
        En Goldek Key International respetamos tu privacidad. Esta política describe qué datos tratamos,
        con qué finalidad y qué opciones tienes para ejercer control sobre tu información.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Datos que podemos recopilar</h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Datos de cuenta: nombre, correo electrónico, teléfono, rol y credenciales de acceso.</li>
        <li>Datos operativos: servicios contratados, historial de pedidos, facturación e impuestos aplicables.</li>
        <li>Datos técnicos: dirección IP, navegador, dispositivo, métricas de uso y registros de seguridad.</li>
        <li>Datos de comunicación: mensajes enviados por formularios, CRM o canales integrados.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Finalidades del tratamiento</h2>
      <ul className="list-disc ml-6 mb-4 space-y-1">
        <li>Prestar, mantener y mejorar la plataforma y sus módulos de automatización.</li>
        <li>Procesar compras, emitir comprobantes e informes comerciales.</li>
        <li>Atender solicitudes de soporte, incidencias y requerimientos técnicos.</li>
        <li>Cumplir obligaciones legales, contables, fiscales y de prevención de fraude.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Base legal y conservación</h2>
      <p className="mb-4">
        Tratamos datos con base en la ejecución de contrato, interés legítimo y cumplimiento normativo.
        Conservamos la información durante el tiempo necesario para operar el servicio y cumplir obligaciones legales.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Compartición de datos</h2>
      <p className="mb-4">
        Podemos compartir datos con proveedores tecnológicos y de procesamiento de pagos bajo acuerdos de confidencialidad.
        No vendemos datos personales a terceros.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Derechos del titular</h2>
      <p className="mb-4">
        Puedes solicitar acceso, rectificación, actualización, oposición o supresión de tus datos, sujeto a la ley aplicable.
        Para ejercer estos derechos escribe a{' '}
        <a href="mailto:privacy@goldenkey.website" className="text-blue-600 underline">privacy@goldenkey.website</a>.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Seguridad de la información</h2>
      <p className="mb-4">
        Aplicamos medidas administrativas, técnicas y organizativas razonables para proteger los datos frente a pérdida,
        acceso no autorizado, alteración o divulgación indebida.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Cambios a esta política</h2>
      <p>
        Podemos actualizar este documento para reflejar cambios regulatorios o funcionales. La versión vigente se publica en esta misma página.
      </p>
    </main>
  );
}
