export default function PageSpinner({ minH = "60vh" }: { minH?: string }) {
  return (
    <div className={`flex items-center justify-center`} style={{ minHeight: minH }}>
      <div className="h-8 w-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  );
}
