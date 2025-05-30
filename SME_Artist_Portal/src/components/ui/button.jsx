export function Button({ children, onClick, disabled, className }) {
  return (
    <button
      className={"wire-btn " + (className || "")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}