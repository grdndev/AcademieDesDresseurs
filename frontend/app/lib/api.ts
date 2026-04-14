export function getApiBase(): string {
  // On the server (Next.js server components) use the docker-internal API URL if available.
  if (typeof window === 'undefined') {
    return process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL || '';
  }
  // In the browser use the public NEXT_PUBLIC_API_URL
  return process.env.NEXT_PUBLIC_API_URL || '';
}

export default getApiBase;
