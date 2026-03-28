import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-4">Tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, usamos y protegemos tus datos personales.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">1. Datos que Recopilamos</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Datos de registro (nombre, email, contraseña)</li>
        <li>Datos de uso y navegación</li>
        <li>Datos de pago (si aplica)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">2. Uso de los Datos</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Proveer y mejorar nuestros servicios</li>
        <li>Personalizar tu experiencia</li>
        <li>Comunicaciones importantes y soporte</li>
        <li>Cumplimiento legal</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">3. Derechos ARCO</h2>
      <p className="mb-4">Puedes acceder, rectificar, cancelar u oponerte al uso de tus datos escribiendo a <a href="mailto:soporte@globalgate.com" className="text-blue-600 underline">soporte@globalgate.com</a>.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">4. Seguridad</h2>
      <p className="mb-4">Aplicamos medidas técnicas y organizativas para proteger tus datos. Solo personal autorizado puede acceder a ellos.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cambios</h2>
      <p>Podemos actualizar esta política. Notificaremos cambios importantes por email o en la plataforma.</p>
    </main>
  );
}
