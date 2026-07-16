export function HoneypotField() {
  return (
    <input
      type="text"
      name="website"
      autoComplete="off"
      tabIndex={-1}
      aria-hidden="true"
      className="hidden"
    />
  );
}
