export function Button({ children, onClick, disabled, className }) {
  return (
    <button
      className={
        "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 " +
        (className || "")
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}