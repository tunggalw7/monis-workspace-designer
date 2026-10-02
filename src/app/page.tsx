import { Configurator } from "@/components/configurator/Configurator";
import { WorkspacePreview } from "@/components/preview/WorkspacePreview";
import { PresetBar } from "@/components/PresetBar";
import { RentBar } from "@/components/RentBar";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pt-6 pb-32 sm:px-6">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-semibold tracking-wide text-terracotta-dark uppercase">
          Monis · Workspace Designer
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Design your dream workspace in Bali
        </h1>
        <div className="mt-2">
          <PresetBar />
        </div>
      </header>

      <main className="grid flex-1 grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_440px]">
        <WorkspacePreview />
        <Configurator />
      </main>
      <RentBar />
    </div>
  );
}
