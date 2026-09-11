const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function authFetch(url: string, token: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("token");
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- authFetch è fuori da un componente React, useRouter() non è disponibile qui; un reload completo è anche voluto per azzerare lo stato
    window.location.href = "/login";
  }
  return res;
}

type RegisterData = {
  email: string;
  password: string;
  full_name: string;
};

export async function register(data: RegisterData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail ?? "Registrazione fallita");
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail ?? "Login fallito");
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export type Space = {
  id: number;
  name: string;
  space_type: string;
  capacity: number;
};

export type Booking = {
  id: number;
  space_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  status: string;
};

export async function getSpaces(token: string): Promise<Space[]> {
  const res = await authFetch(`${API_URL}/spaces/`, token);
  if (!res.ok) throw new Error("Impossibile caricare gli spazi");
  return res.json();
}

export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await authFetch(`${API_URL}/bookings/me`, token);
  if (!res.ok) throw new Error("Impossibile caricare le prenotazioni");
  return res.json();
}

export type BookingCreate = {
  space_id: number;
  start_time: string;
  end_time: string;
};

export async function createBooking(token: string, data: BookingCreate): Promise<Booking> {
  const res = await authFetch(`${API_URL}/bookings/`, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail ?? "Impossibile creare la prenotazione");
  }
  return res.json();
}

export async function cancelBooking(token: string, bookingId: number): Promise<void> {
  const res = await authFetch(`${API_URL}/bookings/${bookingId}`, token, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Impossibile cancellare la prenotazione");
}

export type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
};

export async function getMe(token: string): Promise<User> {
  const res = await authFetch(`${API_URL}/auth/me`, token);
  if (!res.ok) throw new Error("Impossibile recuperare l'utente");
  return res.json();
}

export async function getAllBookings(token: string): Promise<Booking[]> {
  const res = await authFetch(`${API_URL}/bookings/`, token);
  if (!res.ok) throw new Error("Impossibile caricare le prenotazioni");
  return res.json();
}

export async function sendChatMessage(token: string, message: string): Promise<string> {
  const res = await authFetch(`${API_URL}/assistant/chat`, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("Impossibile contattare l'assistente");
  const data = await res.json();
  return data.reply;
}

export async function getUsers(token: string): Promise<User[]> {
  const res = await authFetch(`${API_URL}/users/`, token);
  if (!res.ok) throw new Error("Impossibile caricare gli utenti");
  return res.json();
}

export async function updateUserRole(token: string, userId: number, role: string): Promise<User> {
  const res = await authFetch(`${API_URL}/users/${userId}/role`, token, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error("Impossibile aggiornare il ruolo");
  return res.json();
}