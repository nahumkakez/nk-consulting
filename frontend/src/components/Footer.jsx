const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span>🇨🇩 NK Consulting S.A.R.L</span>
      <span>|</span>
      <span>© {year} Tous droits réservés</span>
      <span>|</span>
      <span>Devises: FC / USD</span>
      <span>|</span>
      <span>République Démocratique du Congo</span>
    </footer>
  );
};

export default Footer;