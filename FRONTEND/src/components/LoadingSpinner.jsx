const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-[100px]">     
      {/* Contenedor relativo que define el tamaño del spinner,
          con tamaños responsivos para diferentes dispositivos */}
      <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16">
        <div className="absolute w-full h-full rounded-full border-4 border-gray-200"></div>
        <div className="absolute w-full h-full rounded-full animate-spin border-4 border-[#FF7BAB] border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
