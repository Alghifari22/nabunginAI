export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="size-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />

        <p className="text-muted-foreground">
          Loading Nabungin.AI
        </p>
      </div>
    </div>
  );
}