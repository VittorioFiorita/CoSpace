"use client"

import { useState } from "react";
import { useCreateSpace } from "@/lib/queries";

export function SpaceModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const [spaceType, setSpaceType] = useState("meeting_room");
    const [capacity, setCapacity] = useState("");
    const [openingTime, setOpeningTime] = useState("09:00");
    const [closingTime, setClosingTime] = useState("18:00");
    const createSpace = useCreateSpace();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        createSpace.mutate(
            {
                name,
                space_type: spaceType,
                capacity: Number(capacity),
                opening_time: openingTime,
                closing_time: closingTime,
            },
            { onSuccess: onClose }
        );
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-bg-card border border-border rounded-2xl p-6">
                <div className="font-heading text-lg font-bold text-text mb-4">Nuovo spazio</div>

                {createSpace.isError && (
                    <div className="mb-3 text-sm text-red-600">{createSpace.error instanceof Error ? createSpace.error.message : "Errore imprevisto"}</div>
                )}

                <label className="block text-sm font-medium text-text-secondary mb-1">Nome</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
                />

                <label className="block text-sm font-medium text-text-secondary mb-1">Tipo</label>
                <select
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    required
                    className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
                >
                    <option value="meeting_room">Sala riunioni</option>
                    <option value="desk">Scrivania</option>
                </select>

                <label className="block text-sm font-medium text-text-secondary mb-1">Capienza</label>
                <input
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    required
                    className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
                />

                <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Apertura</label>
                        <input
                            type="time"
                            value={openingTime}
                            onChange={(e) => setOpeningTime(e.target.value)}
                            required
                            className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Chiusura</label>
                        <input
                            type="time"
                            value={closingTime}
                            onChange={(e) => setClosingTime(e.target.value)}
                            required
                            className="w-full mb-3 rounded-lg border border-border bg-bg-page px-3 py-2 text-text"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-border py-2 text-text text-sm font-semibold"
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        disabled={createSpace.isPending}
                        className="flex-1 rounded-lg bg-accent text-white py-2 text-sm font-semibold disabled:opacity-60"
                    >
                        {createSpace.isPending ? "Creo..." : "Crea"}
                    </button>
                </div>
            </form>
        </div>
    );
}