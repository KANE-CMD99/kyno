export default function Logo() {
  return (
    <div className="select-none">
      <span className="text-2xl font-black tracking-tight text-white">
        <span
          className="text-transparent"
          style={{
            background: "linear-gradient(to bottom right, #c084fc, #22d3ee)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          K
        </span>
        YNO
      </span>
      <span className="ml-1 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">
        Technology
      </span>
    </div>
  );
}
