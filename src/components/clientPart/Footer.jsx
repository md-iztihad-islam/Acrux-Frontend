const Footer = () => {
  return (
    <footer className="py-8 px-4 border-t border-border">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Refund Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms & Conditions</a>
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            © 2024 <span className="text-gold">ACRUX</span> | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;