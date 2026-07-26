export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-blue-600" />
        <p className="mt-3 text-sm text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}
