const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-text">
          <span className="footer-flag"></span>
          <strong>NK Consulting S.A.R.L</strong> — République Démocratique du Congo
        </div>
        <div className="footer-text">
          © {currentYear} Tous droits réservés
        </div>
        <div className="footer-text">
          💱 Devises : FC / USD
        </div>
      </div>
    </footer>
  );
};

export default Footer;