export function KofiButton() {
  return (
    <div className="text-center mt-6">
      <p className="text-xs text-zoo-text/50 mb-2 leading-relaxed">
        このアプリが役に立ったら、<br />コーヒー1杯分の支援をいただけると嬉しいです☕
      </p>
      <a
        href="https://ko-fi.com/fu_ji_p"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Ko-fiでサポートする"
        className="inline-block active:scale-95 transition-transform"
      >
        <img
          src="https://ko-fi.com/img/githubbutton_sm.svg"
          alt="Ko-fi でサポートする"
          height="36"
          style={{ height: '36px', borderRadius: '6px' }}
        />
      </a>
    </div>
  );
}
