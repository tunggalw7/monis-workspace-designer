import { Configurator } from "@/components/configurator/Configurator";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold tracking-wide text-terracotta-dark uppercase">
          Monis · Workspace Designer
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Design your dream workspace in Bali
        </h1>
      </header>

      <main className="grid flex-1 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
        {/* Live preview lands here in #5. */}
        <section
          aria-label="Workspace preview"
          className="grid min-h-72 place-items-center self-stretch rounded-3xl bg-sand/60 p-6 text-center text-muted"
        >
          Your workspace preview
        </section>
        <Configurator />
      </main>
    </div>
  );
}
