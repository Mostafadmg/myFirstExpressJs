export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>Marketspace<span className="brand-period">.</span></strong>
          <p>A home for thoughtfully made things and the people behind them.</p>
        </div>
        <div className="footer-meta">
          <span>Independent by nature. Better together.</span>
          <span>© {new Date().getFullYear()} Marketspace</span>
        </div>
      </div>
    </footer>
  );
}
