export function Card({ children }) {
  return (
    <div className="border border-gray-300 rounded shadow-sm p-4 bg-white">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="">{children}</div>;
}