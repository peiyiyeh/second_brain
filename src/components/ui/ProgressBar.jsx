const ProgressBar = ({ current, target, label, prefix }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full space-y-2 group">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-2">
          {prefix && <span className="text-[#888888] text-sm">{prefix}</span>}
          <span className="text-[#e5e5e5] text-base font-light tracking-wide">{label}</span>
        </div>
        <div className="text-[#888888] text-xs font-mono tracking-wider">
          {current} / {target}
        </div>
      </div>
      <div className="h-[2px] w-full bg-[#222222] overflow-hidden">
        <div 
          className="h-full bg-[#bbbbbb] transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
export default ProgressBar;
