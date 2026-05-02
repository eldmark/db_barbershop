const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type ApiOptions = RequestInit & {
  token?: string | null;
};

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, headers, body, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Solo agregar Content-Type si hay body
  if (body) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body,
    });
  } catch (err) {
    throw new Error("Network error. Please check your connection.");
  }

  // Manejo de errores HTTP
  if (!response.ok) {
    let message = "Request could not be completed";

    try {
      const data = await response.json();
      message =
        data?.error ||
        data?.message ||
        message;
    } catch {
      // fallback silencioso
    }

    throw new Error(message);
  }

  // 204 → no content
  if (response.status === 204) {
    return [] as unknown as T; // importante para listas
  }

  // Parse seguro
  try {
    const data = await response.json();
    return data as T;
  } catch {
    throw new Error("Invalid response from server");
  }
}