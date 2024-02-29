export function EveryPlayerContainer({ className }: { className?: string }): JSX.Element {
  return (
    <div className={`${className} border-2 border-gray-500`}>
      <h2>Every Player</h2>
      <p>Some text about every player</p>
    </div>
  );
}
