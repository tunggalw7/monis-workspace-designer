export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <span className="bg-sand text-terracotta-dark rounded-full px-4 py-1 text-sm font-medium">
        Coming soon
      </span>
      <h1 className="font-display max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Design your dream workspace in Bali
      </h1>
      <p className="text-muted max-w-xl text-lg">
        Pick a desk, a chair and the extras you need. We set it up at your villa before you arrive.
      </p>
      <div className="flex gap-3">
        <span className="bg-terracotta h-3 w-3 rounded-full" />
        <span className="bg-jungle h-3 w-3 rounded-full" />
        <span className="bg-ocean h-3 w-3 rounded-full" />
      </div>
    </main>
  );
}
