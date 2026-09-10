const API_URL = process.env.NEXT_PUBLIC_API_URL;

type RegisterData = {
    email: string;
    password: string;
    full_name: string;
};

export async function register(data: RegisterData) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
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
    body.set("password", password)

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });

    if(!res.ok) {
        const error = await res.json();
        throw new Error(error.detail ?? "Login fallito")
    }
    return res.json() as Promise<{ access_token: string; token_type: string}>;
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
  const res = await fetch(`${API_URL}/spaces/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Impossibile caricare gli spazi");
  return res.json();
}

export async function getMyBookings(token: string): Promise<Booking[]> {
  const res = await fetch(`${API_URL}/bookings/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Impossibile caricare le prenotazioni");
  return res.json();
}

export type BookingCreate = {
  space_id: number;
  start_time: string;
  end_time: string;
};

export async function createBooking(token: string, data: BookingCreate): Promise<Booking> {
  const res = await fetch(`${API_URL}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail ?? "Impossibile creare la prenotazione");
  }
  return res.json();
}