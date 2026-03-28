# **App Name**: GlobalGate Agency

## Checklist de Producción

- [ ] Variables de entorno documentadas y configuradas (ver ENVIRONMENT.md)
- [ ] No hay datos sensibles en el repositorio
- [ ] Flujos críticos probados: autenticación, pagos, dashboard, IA
- [ ] UI responsiva y multilingüe
- [ ] Documentación actualizada y clara
- [ ] Build y deploy sin errores
- [ ] Pruebas básicas de usabilidad y performance

---

## Core Features:

- Multilingual Support: Enable different languages for the user interface, adapting text and labels accordingly.
- Regional Billing: Implement regional billing to support different tax laws and compliance requirements for various regions.
- Multi-Currency Support: Allow users to select their preferred currency for transactions, displaying prices and handling payments accordingly.
- AI-Powered Translation: Implement an AI-powered tool to automatically translate the website content into the user's selected language. The tool will reason about the proper inclusion of industry-specific verbiage to maintain relevance across translations.
- Language Selector: Offer a language selector in the header or footer, allowing users to switch between available languages.
- Currency Display: Display prices and billing information in the user's local currency based on their geographic location.


## Guía de Deploy (Netlify)

1. Sube tu código a GitHub (rama main)
2. Conecta el repo a Netlify (Add new site > Import from Git)
3. Configura las variables de entorno (ver ENVIRONMENT.md)
4. Build command: `next build`  |  Publish directory: `.next`
5. Haz deploy y revisa la URL pública

## Guía de Deploy (Firebase Hosting)

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Ejecuta `firebase login` y `firebase init hosting`
3. Configura las variables de entorno en tu backend
4. Build: `next build`  |  Deploy: `firebase deploy`
5. Revisa la URL pública de Firebase

---

## Style Guidelines:

- Primary color: Deep blue (#34495E) to convey trust and global reach.
- Background color: Light gray (#F4F6F6) for a clean and modern look.
- Accent color: Teal (#008080) to highlight important elements and CTAs.
- Body and headline font: 'Inter' sans-serif font, for a modern, machined, objective, neutral feel
- Use globally recognized icons for languages and currencies.
- Design a responsive layout that adapts to different screen sizes and languages, ensuring readability and usability across all devices.