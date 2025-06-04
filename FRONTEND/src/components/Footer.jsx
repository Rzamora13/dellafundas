const Footer = () => {
  return (
    <footer className="bg-[#642A4D] text-white px-6 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          
          {/* Sección de texto invitando a seguir en redes sociales */}
          <div className="text-white italic text-center md:text-left w-full md:w-auto">
            Entra en el mundo de DELLAFUNDAS y síguenos en nuestras redes sociales para estar al tanto de las últimas novedades y ofertas exclusivas.
          </div>

          {/* Enlaces a redes sociales, con flex para ajustar en varias líneas y estilos responsivos */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-white italic text-lg w-full md:w-auto">
            {/* Cada enlace tiene su propia URL, abre en pestaña nueva y cambia color al pasar el mouse */}
            <a
              href="https://www.instagram.com/dellafundas/?igsh=ZXhpaHlnYzBkNHJl&utm_source=qr#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-400 whitespace-nowrap"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@dellafundas?_t=8niYdSHRkKO&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black whitespace-nowrap"
            >
              TikTok
            </a>
            <a
              href="https://www.vinted.es/member/169766644-dellafuendas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 whitespace-nowrap"
            >
              Vinted
            </a>
            <a
              href="https://es.wallapop.com/user/juanma-68517306"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 whitespace-nowrap"
            >
              Wallapop
            </a>
          </div>
        </div>

        {/* Línea divisoria blanca con margen arriba y padding para separar contenido */}
        <div className="border-t border-[#FFFFFF] mt-6 pt-6">
          {/* Contenedor flex similar al anterior para texto de copyright y enlaces legales */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <p className="text-gray-300 text-sm text-center md:text-left w-full md:w-auto">
              © 2025 DELLAFUNDAS. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-4 text-gray-300 text-sm w-full md:w-auto">
              <a href="#" className="hover:text-blue-300 whitespace-nowrap">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-blue-300 whitespace-nowrap">
                Términos de Servicio
              </a>
              <a href="#" className="hover:text-blue-300 whitespace-nowrap">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
