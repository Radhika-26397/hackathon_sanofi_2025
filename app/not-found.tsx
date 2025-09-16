export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md">The page you were looking for doesn't exist or has been moved.</p>
      <a href="/" className="underline text-primary">Return Home</a>
    </div>
  );
}
