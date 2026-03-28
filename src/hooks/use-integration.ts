import { useSite } from '@/hooks/use-site';

export type IntegrationId = 'whatsapp' | 'messenger' | 'instagram' | 'telegram' | 'webchat' | 'email' | 'linkedin' | 'twitter';

export interface IntegrationStatus {
  connected: boolean;
  connecting: boolean;
  error?: string;
}

export function useIntegration(id: IntegrationId) {
  const { site, setSite } = useSite();
  // Garantiza que integrationStatus siempre exista
  const integrationStatus = site.integrationStatus || {};
  const status: IntegrationStatus = integrationStatus[id] || { connected: false, connecting: false };

  const connect = async (apiKey?: string) => {
    setSite(prev => ({
      ...prev,
      integrationStatus: {
        ...(prev.integrationStatus || {}),
        [id]: { connected: false, connecting: true }
      }
    }));
    // Simulación de delay y éxito/fracaso
    await new Promise(res => setTimeout(res, 1200));
    if (apiKey === 'fail') {
      setSite(prev => ({
        ...prev,
        integrationStatus: {
          ...(prev.integrationStatus || {}),
          [id]: { connected: false, connecting: false, error: 'Error de autenticación' }
        }
      }));
      return false;
    }
    setSite(prev => ({
      ...prev,
      integrationStatus: {
        ...(prev.integrationStatus || {}),
        [id]: { connected: true, connecting: false }
      }
    }));
    return true;
  };

  const disconnect = async () => {
    setSite(prev => ({
      ...prev,
      integrationStatus: {
        ...(prev.integrationStatus || {}),
        [id]: { connected: false, connecting: false }
      }
    }));
  };

  return { status, connect, disconnect };
}
