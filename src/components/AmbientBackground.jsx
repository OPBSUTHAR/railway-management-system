export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="ambient-bg pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="ambient-wash absolute inset-0" />
      <div className="ambient-grid absolute inset-0" />
      <span className="ambient-blob ambient-blob-a" />
      <span className="ambient-blob ambient-blob-b" />
      <span className="ambient-blob ambient-blob-c" />
      <span className="ambient-ring ambient-ring-a" />
      <span className="ambient-ring ambient-ring-b" />
      <span className="ambient-bubble ambient-bubble-a" />
      <span className="ambient-bubble ambient-bubble-b" />
      <span className="ambient-bubble ambient-bubble-c" />
      <span className="ambient-bubble ambient-bubble-d" />
      <span className="ambient-bubble ambient-bubble-e" />
      <span className="ambient-bubble ambient-bubble-f" />
      <span className="ambient-bubble ambient-bubble-g" />
      <span className="ambient-bubble ambient-bubble-h" />
      <div className="ambient-track" />
      <span className="ambient-spark ambient-spark-a" />
      <span className="ambient-spark ambient-spark-b" />
      <span className="ambient-spark ambient-spark-c" />
      <span className="ambient-spark ambient-spark-d" />
    </div>
  );
}
