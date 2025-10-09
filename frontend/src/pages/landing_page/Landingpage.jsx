import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="landing__header">
        <h1 className="landing__logo">MiMarca</h1>
        <nav className="landing__nav">
          <a href="#features">Características</a>
          <a href="#about">Nosotros</a>
          <a href="#contact">Contacto</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing__hero">
        <h2>Haz crecer tu negocio con facilidad</h2>
        <p>Una landing page simple creada con React y CSS puro.</p>
        <button className="btn">Comenzar</button>
      </section>

      {/* Features */}
      <section id="features" className="landing__features">
        <div className="feature">
          <h3>Rápido</h3>
          <p>Carga ultrarrápida gracias a Vite y React.</p>
        </div>
        <div className="feature">
          <h3>Simple</h3>
          <p>Diseño limpio, directo y fácil de editar.</p>
        </div>
        <div className="feature">
          <h3>Moderno</h3>
          <p>Tecnologías web actuales y eficientes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing__footer">
        <p>© 2025 MiMarca. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
