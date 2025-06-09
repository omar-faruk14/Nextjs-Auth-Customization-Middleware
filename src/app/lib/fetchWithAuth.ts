export async function fetchWithAuth(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let res = await fetch(input, init);

  // If token expired, try refresh
  if (res.status === 401) {
    const refreshRes = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (refreshRes.ok) {
      // Retry original request after refresh
      res = await fetch(input, init);
    }
  }

  return res;
}
