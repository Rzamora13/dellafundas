import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

function Register() {
  const { register } = useAuth();

  // Estados para manejar los inputs del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Función para validar que la contraseña cumpla con requisitos:
  // al menos 8 caracteres, una mayúscula, un número y un carácter especial
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]{8,}$/.test(password);

  // Función para validar que el email tenga formato válido
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      toast.warning("❌ Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // Validar que la contraseña cumpla requisitos de seguridad
    if (!validatePassword(password)) {
      toast.warning("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
      setLoading(false);
      return;
    }

    // Validar formato del email
    if (!validateEmail(email)) {
      toast.warning("❌ Introduce un correo válido.");
      setLoading(false);
      return;
    }

    try {
      await register(email, password);
      toast.success("✅ Registro exitoso. Redirigiendo a login...");
      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      toast.error(`❌ ${error.message || "Error en el registro"}`);
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#EBBDCA] flex flex-col items-center px-4 py-6 min-h-screen">
      {/* Botón para volver a la página principal */}
      <button
        onClick={() => navigate("/")}
        className="text-white text-lg mb-6 flex items-center gap-2 self-start max-w-md w-full"
      >
        <span className="text-2xl">&laquo;</span> Back
      </button>

      {/* Contenedor del formulario */}
      <div className="w-full max-w-md bg-[#FF7BAB] border border-black rounded-sm p-6 md:p-8 shadow-md">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          ¡Join now!
        </h2>

        {/* Formulario con campos controlados */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Campo email */}
          <div>
            <label htmlFor="email" className="text-white block mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none bg-[#FFFFFF]"
              autoComplete="email"
            />
          </div>

          {/* Campo password */}
          <div>
            <label htmlFor="password" className="text-white block mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none bg-[#FFFFFF]"
              autoComplete="new-password"
            />
          </div>

          {/* Campo confirmación de password */}
          <div>
            <label htmlFor="confirmPassword" className="text-white block mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required
              className="w-full px-3 py-2 border-2 border-black rounded-none focus:outline-none bg-[#FFFFFF]"
              autoComplete="new-password"
            />
          </div>

          {/* Botón para enviar el formulario */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-[#FF4F78] text-white py-2 rounded-full border border-black hover:bg-[#D6406D] transition-colors duration-300"
          >
            {/* Texto cambia si está cargando o no */}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Enlace para redirigir a login si ya tiene cuenta */}
        <p className="text-white text-center mt-6 text-sm max-w-xs mx-auto">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer"
            role="button"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
