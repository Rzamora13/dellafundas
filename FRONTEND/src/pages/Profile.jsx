import React, { useEffect, useState } from "react";
import { useUsers } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {

  const { users, loading, fetchUsers, updateUserRole, error } = useUsers();
  const { user } = useAuth();

  // Estado local para manejar cambios de roles antes de guardar
  // Se guarda como un objeto donde la clave es el id de usuario y el valor es un array con los roles
  const [editRoles, setEditRoles] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  // Actualiza el estado de roles editados cuando el usuario cambia el select de rol
  const handleRoleChange = (id, value) => {
    // Guardamos el nuevo rol dentro de un array asociado al id del usuario
    setEditRoles(prev => ({ ...prev, [id]: [value] }));
  };

  // Función para guardar los roles actualizados del usuario
  const handleUpdateRoles = async (id) => {
    const newRole = editRoles[id]?.[0]; // Extraemos el nuevo rol para ese usuario

    // Validamos que el rol sea uno de los permitidos
    if (!["ROLE_USER", "ROLE_ADMIN"].includes(newRole)) {
      toast.error(`❌ Rol inválido: ${newRole}`);
      return;
    }

    try {
      // Llamamos a la función del contexto para actualizar el rol del usuario
      await updateUserRole(id, editRoles[id]);
      toast.success(`✅ Rol actualizado para el usuario ${id}.`);
    } catch (err) {
      toast.error("❌ Error al actualizar el rol.", err);
    }
  };

  const isAdmin = user?.roles.includes("ROLE_ADMIN");
  const displayedUsers = isAdmin ? users : users.filter(u => u.id === user?.id);

  if (loading) return <LoadingSpinner className="flex justify-center items-center h-64"/>;
  if (error) return <p className="p-4 text-center text-red-500 w-full h-full">Error: {error}</p>;

  return (
    <div className="p-6 w-full bg-[#EBBDCA] min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl mx-auto">
        {/* Título cambia según si es admin o usuario normal */}
        <h1 className="text-xl font-semibold text-center mb-6">
          {isAdmin ? "Gestión de Usuarios" : "Mi Perfil"}
        </h1>

        {/* Contenedor scroll horizontal para pantallas pequeñas */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg overflow-hidden min-w-[320px]">
            <thead className="bg-gray-200">
              <tr className="text-left">
                <th className="border px-4 py-2">Email</th>
                {/* Solo mostrar columna de roles y acciones si es administrador */}
                {isAdmin && <th className="border px-4 py-2">Rol</th>}
                {isAdmin && <th className="border px-4 py-2 text-center">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {/* Mostrar cada usuario filtrado */}
              {displayedUsers.map(user => (
                <tr key={user.id} className="border-t">
                  {/* Mostrar email del usuario */}
                  <td className="px-4 py-2 break-words max-w-xs">{user.email}</td>

                  {/* Si es admin, mostrar selector para cambiar rol */}
                  {isAdmin && (
                    <td className="px-4 py-2">
                      <select
                        // Valor del select es el rol actual o el rol editado si existe y si no, por defecto ROLE_USER
                        value={editRoles[user.id]?.[0] || user.roles[0] || "ROLE_USER"} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border rounded px-2 py-1 bg-white w-full max-w-xs"
                      >
                        <option value="ROLE_USER">ROLE_USER</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                      </select>
                    </td>
                  )}

                  {/* Si es admin, mostrar botón para guardar cambios */}
                  {isAdmin && (
                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                      <button
                        onClick={() => handleUpdateRoles(user.id)}
                        className="text-[#4CAF50] font-semibold hover:text-green-700 whitespace-nowrap"
                      >
                        Guardar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
