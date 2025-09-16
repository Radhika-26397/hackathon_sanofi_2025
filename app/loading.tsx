// Global route loading UI
// Displayed automatically by Next.js while streaming / layout segments load
export default function Loading() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" aria-label="Loading" />
				<p className="text-sm text-muted-foreground">Loading interface…</p>
			</div>
		</div>
	)
}
