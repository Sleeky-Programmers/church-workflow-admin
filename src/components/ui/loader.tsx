type LoaderProps = {
  className?: string;
};

export function Loader({ className = "h-5 w-5" }: LoaderProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      <span className="absolute inset-0 rounded-full border-2 border-current/25" />
      <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-current animate-spin" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
    </span>
  );
}
