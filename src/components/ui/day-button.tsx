type DayButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function DayButton({ selected, onClick, children, ...props }: DayButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex-1 h-10 rounded-md border border-gray-300 transition-colors" 
      style={{ backgroundColor: selected ? '#2563eb' : 'white', color: selected ? 'white' : 'black' }} 
      {...props}
    >
      {children}
    </button>
  );
}