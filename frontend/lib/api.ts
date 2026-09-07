const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...(options?.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options?.headers,
      },
    }
  );

  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}