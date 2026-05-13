"use client";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      className="h-10 rounded-md border bg-white px-3 text-sm font-medium"
      onClick={() => window.print()}
    >
      {label}
    </button>
  );
}

