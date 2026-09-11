import json
from datetime import datetime, date

from sqlmodel import Session, select

from .booking_service import create_booking_for_user
from .models import Booking, Space, User

import os

from anthropic import Anthropic
from dotenv import load_dotenv

from .retrieval import retrieve_relevant_chunks

load_dotenv()

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
MODEL = "claude-haiku-4-5-20251001"

SYSTEM_PROMPT = """Sei l'assistente virtuale di CoSpace, uno spazio coworking a Milano.
Rispondi in italiano, in modo breve e cordiale.
Non usare emoji nelle risposte.
Oggi è {today}. Usa questa data come riferimento per calcolare espressioni relative come "oggi", "domani", "questa settimana".
Usa gli strumenti a disposizione per consultare spazi e prenotazioni reali, o per crearne di nuove su richiesta dell'utente.
Se la domanda riguarda regole, orari o policy del coworking, usa le informazioni fornite nel contesto qui sotto — non inventare policy che non sono presenti.

Contesto rilevante dalla documentazione del coworking:
{context}
"""

TOOLS = [
    {
        "name": "list_my_bookings",
        "description": "Restituisce l'elenco delle prenotazioni dell'utente corrente, incluse quelle cancellate.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "list_spaces",
        "description": "Restituisce l'elenco di tutti gli spazi disponibili nel coworking (scrivanie, sale riunioni, ecc.) con nome, tipo e capienza.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "create_booking",
        "description": "Crea una nuova prenotazione per l'utente corrente su uno spazio specifico.",
        "input_schema": {
            "type": "object",
            "properties": {
                "space_id": {"type": "integer", "description": "ID dello spazio da prenotare"},
                "start_time": {"type": "string", "description": "Data e ora di inizio, formato ISO 8601, es. 2026-09-15T10:00:00"},
                "end_time": {"type": "string", "description": "Data e ora di fine, formato ISO 8601"},
            },
            "required": ["space_id", "start_time", "end_time"],
        },
    },
]


def run_tool(session: Session, user: User, tool_name: str, tool_input: dict) -> str:
    if tool_name == "list_my_bookings":
        bookings = session.exec(select(Booking).where(Booking.user_id == user.id)).all()
        result = []
        for b in bookings:
            space = session.get(Space, b.space_id)
            result.append({
                "id": b.id,
                "space_name": space.name if space else "Spazio sconosciuto",
                "start_time": b.start_time.isoformat(),
                "end_time": b.end_time.isoformat(),
                "status": b.status,
            })
        return json.dumps(result)

    if tool_name == "list_spaces":
        spaces = session.exec(select(Space)).all()
        return json.dumps([
            {"id": s.id, "name": s.name, "space_type": s.space_type, "capacity": s.capacity}
            for s in spaces
        ])

    if tool_name == "create_booking":
        try:
            booking = create_booking_for_user(
                session,
                user.id,
                tool_input["space_id"],
                datetime.fromisoformat(tool_input["start_time"]),
                datetime.fromisoformat(tool_input["end_time"]),
            )
            return json.dumps({"success": True, "booking_id": booking.id})
        except ValueError as e:
            return json.dumps({"success": False, "error": str(e)})

    return json.dumps({"error": f"Strumento sconosciuto: {tool_name}"})

def chat(session, user, message: str) -> str:
    context_chunks = retrieve_relevant_chunks(session, message, top_k=3)
    system = SYSTEM_PROMPT.format(context="\n\n".join(context_chunks), today=date.today().isoformat())

    messages = [{"role": "user", "content": message}]

    for _ in range(5):
        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=1024,
                system=system,
                tools=TOOLS,
                messages=messages,
            )
        except Exception:
            return "Mi dispiace, l'assistente non è al momento disponibile. Riprova tra qualche minuto."

        if response.stop_reason != "tool_use":
            return "".join(block.text for block in response.content if block.type == "text")

        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = run_tool(session, user, block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })
        messages.append({"role": "user", "content": tool_results})

    return "Mi dispiace, non sono riuscito a completare la richiesta."