interface FetchOptions extends RequestInit {
  secure?: boolean;
}

export async function fetchWithSSL(url: string, options: FetchOptions = {}) {
  const { secure = true, ...fetchOptions } = options;
  
  // Ajouter les en-têtes de sécurité
  const headers = new Headers(fetchOptions.headers);
  
  if (secure) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
    headers.set('Accept', 'application/json');
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'same-origin'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Une erreur est survenue');
  }

  return response;
} 