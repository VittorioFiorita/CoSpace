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