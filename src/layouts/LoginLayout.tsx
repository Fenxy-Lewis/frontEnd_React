import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  return (
    <div className="login-layout">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #0a0a0f;
          --panel: #111118;
          --border: rgba(255,255,255,0.07);
          --accent: #c8f04a;
          --accent-dim: rgba(200,240,74,0.12);
          --text: #f0f0f0;
          --muted: rgba(240,240,240,0.4);
        }

        .login-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
        }

        /* ===== LEFT PANEL ===== */
        .left-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          overflow: hidden;
          background: var(--panel);
          border-right: 1px solid var(--border);
        }

        .left-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(200,240,74,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 10%, rgba(120,100,255,0.07) 0%, transparent 60%);
          pointer-events: none;
        }

        .left-panel::after {
          content: '';
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          border: 1px solid rgba(200,240,74,0.1);
          box-shadow: 0 0 0 60px rgba(200,240,74,0.03), 0 0 0 120px rgba(200,240,74,0.015);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: var(--accent);
          border-radius: 8px;
          display: grid;
          place-items: center;
        }

        .brand-icon svg {
          width: 20px;
          height: 20px;
          fill: var(--bg);
        }

        .brand-name {
          font-family: 'DM Serif Display', serif;
          font-size: 20px;
          letter-spacing: -0.3px;
        }

        .hero-text {
          position: relative;
          z-index: 1;
        }

        .hero-text h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4vw, 52px);
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 20px;
        }

        .hero-text h1 em {
          font-style: italic;
          color: var(--accent);
        }

        .hero-text p {
          font-size: 15px;
          line-height: 1.7;
          color: var(--muted);
          max-width: 360px;
        }

        .stats-row {
          display: flex;
          gap: 32px;
          position: relative;
          z-index: 1;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: var(--accent);
          letter-spacing: -0.5px;
        }

        .stat-label {
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ===== RIGHT PANEL ===== */
        .right-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 48px;
          position: relative;
        }

        .right-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,240,74,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          position: relative;
          z-index: 1;
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-header h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }

        .form-header p {
          font-size: 14px;
          color: var(--muted);
        }

        /* ===== FOOTER ===== */
        .layout-footer {
          position: absolute;
          bottom: 32px;
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.3px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
          .login-layout {
            grid-template-columns: 1fr;
          }
          .left-panel {
            display: none;
          }
          .right-panel {
            padding: 32px 24px;
          }
        }

        /* ===== FADE IN ===== */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-container {
          animation: fadeUp 0.5s ease both;
        }
        .left-panel .hero-text {
          animation: fadeUp 0.6s ease 0.1s both;
        }
      `}</style>

      {/* Left decorative panel */}
      <div className="left-panel">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="brand-name">YourApp</span>
        </div>

        <div className="hero-text">
          <h1>
            Welcome<br />
            <em>back</em> to<br />
            your space.
          </h1>
          <p>
            Sign in to continue managing your work,
            your team, and everything in between.
          </p>
        </div>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-value">12k+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat">
            <span className="stat-value">4.9★</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <h2>Sign in</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {/* Login form renders here */}
          <Outlet />
        </div>

        <div className="layout-footer">
          © {new Date().getFullYear()} YourApp. All rights reserved.
        </div>
      </div>
    </div>
  );
}