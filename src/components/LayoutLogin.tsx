import React, { useState } from "react";

interface LayoutLoginProps {
  children: React.ReactNode;
  wide?: boolean; // <-- NEW FLAG
}

export default function LayoutLogin({
  children,
  wide = false,
}: LayoutLoginProps) {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  return (
    <div>
      <header className="topbar">
        <div className="d-flex align-items-center">
          <div className="brand me-4">HMS</div>
          <nav className="mainmenu" style={{ position: "relative" }}></nav>
        </div>
      </header>

      <div className="app-shell">
        <aside className="left-submenu"></aside>

        <main
          className={`content d-flex align-items-start justify-content-center`}
          style={{ paddingTop: "30px" }}
        >
          <div className="container-fluid">
            <div className="row justify-content-center">
              {/* 🔥 FULL-WIDTH MODE FOR LARGE FORMS */}
              {wide ? (
                <div className="col-12 col-md-10 col-lg-8">
                  <div className="card shadow-lg border-0">
                    <div className="card-body p-4">{children}</div>
                  </div>
                </div>
              ) : (
                /* Normal login width */
                <div className="col-md-6 col-lg-4">
                  <div className="card shadow-lg border-0">
                    <div className="card-body p-5">{children}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
