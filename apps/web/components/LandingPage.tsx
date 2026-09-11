import Link from "next/link";
import { BookingsIcon, AssistantIcon, AnalyticsIcon } from "@/components/icons";

const FEATURES = [
  {
    title: "Prenotazioni in tempo reale",
    description:
      "Prenota sale riunioni e postazioni in pochi click, con controllo automatico delle sovrapposizioni.",
    icon: BookingsIcon,
  },
  {
    title: "Assistente AI integrato",
    description:
      "Chiedi in linguaggio naturale: l'assistente conosce le policy dello spazio e può prenotare al posto tuo.",
    icon: AssistantIcon,
  },
  {
    title: "Analytics per lo staff",
    description:
      "Dashboard con andamento prenotazioni e occupazione per spazio, per chi gestisce il coworking.",
    icon: AnalyticsIcon,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <header className="flex items-center justify-between px-9 py-6">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#6D5FE0" />
            <circle cx="12" cy="12" r="3.4" fill="#FAF7F2" />
            <circle cx="20" cy="12" r="3.4" fill="#FAF7F2" />
            <path
              d="M7 22c0-3 2.5-5 5-5s5 2 5 5"
              fill="none"
              stroke="#FAF7F2"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M15 22c0-3 2.5-5 5-5s5 2 5 5"
              fill="none"
              stroke="#FAF7F2"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <rect x="6" y="23" width="20" height="2.4" rx="1.2" fill="#FAF7F2" />
          </svg>
          <span className="font-heading text-lg font-bold text-text">CoSpace</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-text-secondary px-4 py-2">
            Accedi
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white bg-accent rounded-lg px-4 py-2"
          >
            Registrati
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="font-heading text-4xl font-bold text-text mb-4 max-w-xl">
          Il gestionale per il tuo coworking, con un assistente AI integrato
        </h1>
        <p className="text-text-secondary max-w-md mb-8">
          Prenota spazi, gestisci prenotazioni e monitora l&apos;occupazione — tutto in
          un&apos;unica dashboard, con un assistente che risponde alle domande e prenota al posto
          tuo.
        </p>
        <div className="flex gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-accent text-white px-6 py-3 text-sm font-semibold"
          >
            Inizia ora
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-border text-text px-6 py-3 text-sm font-semibold"
          >
            Accedi
          </Link>
        </div>
      </main>

      <section className="px-9 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-bg-card border border-border rounded-2xl p-5">
                <div className="w-9 h-9 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-text mb-2">{f.title}</div>
                <div className="text-xs text-text-secondary">{f.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}