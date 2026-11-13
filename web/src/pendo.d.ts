// The Pendo agent, when it is installed on the page, exposes a global `pendo` object.
// It is optional so tracking calls are skipped when the agent hasn't loaded.
interface PendoAgent {
  track: (eventName: string, properties?: Record<string, string | number | boolean | null>) => void;
}

interface Window {
  pendo?: PendoAgent;
}
