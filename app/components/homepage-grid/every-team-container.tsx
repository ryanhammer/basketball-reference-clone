export function EveryTeamContainer({ className }: { className?: string }): JSX.Element {
  return (
    <div className={`${className} border-2 border-gray-500`}>
      <h2>Every Team</h2>
      <p>Some text about every team</p>
    </div>
  );
}
