<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

// Definición de la ruta base para todas las acciones de este controlador
#[Route('/users')]
class UserController extends AbstractController
{
    // Ruta para obtener todos los usuarios (GET /users/)
    #[Route('/', name: 'getAllUsers', methods: ['GET'])]
    public function getAllUsers(UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Obtiene todos los usuarios desde la base de datos
        $users = $userRepository->findAll();
        
        // Serializa los usuarios a JSON usando el grupo de serialización 'user:read'
        $json = $serializer->serialize($users, 'json', ['groups' => 'user:read']);
        
        // Devuelve la respuesta JSON con código HTTP 200 y con el contenido ya serializado (el último true evita doble codificación)
        return new JsonResponse($json, 200, [], true);
    }

    // Ruta para obtener un usuario específico por su ID (GET /users/{id})
    #[Route('/{id}', name: 'getUser', methods: ['GET'])]
    public function get(User $user, SerializerInterface $serializer): JsonResponse
    {
        // Serializa el usuario recibido automáticamente por el parámetro $user (param converter)
        $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);
        
        // Devuelve la respuesta JSON con el usuario serializado
        return new JsonResponse($json, 200, [], true);
    }

    // Ruta para actualizar los roles de un usuario (PATCH /users/update/{id}/roles)
    #[Route('/update/{id}/roles', name: 'updateRoles', methods: ['PATCH'])]
    public function updateRoles(Request $request, User $user, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        // Decodifica el contenido JSON recibido en el cuerpo de la petición
        $data = json_decode($request->getContent(), true);

        // Valida que exista la clave 'roles' y que sea un arreglo
        if (!isset($data['roles']) || !is_array($data['roles'])) {
            return new JsonResponse(['error' => 'Roles must be an array'], 400);
        }

        // Define los roles permitidos para evitar roles no autorizados
        $allowedRoles = ['ROLE_USER', 'ROLE_ADMIN'];

        // Valida que cada rol enviado esté dentro de los roles permitidos
        foreach ($data['roles'] as $role) {
            if (!in_array($role, $allowedRoles)) {
                return new JsonResponse(['error' => "Invalid role: $role"], 400);
            }
        }

        // Asigna los roles al usuario y guarda los cambios en la base de datos
        $user->setRoles($data['roles']);
        $em->flush();

        // Serializa el usuario actualizado
        $json = $serializer->serialize($user, 'json', ['groups' => 'user:read']);

        // Devuelve un mensaje de éxito junto con los datos del usuario actualizado
        return new JsonResponse([
            'message' => 'Roles updated successfully',
            'user' => json_decode($json)
        ], 200);
    }

    // Ruta para eliminar un usuario (DELETE /users/delete/{id})
    #[Route('/delete/{id}', name: 'deleteUser', methods: ['DELETE'])]
    public function delete(User $user = null, EntityManagerInterface $em): JsonResponse
    {
        // Si el usuario no existe, retorna error 404
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        // Evita eliminar usuarios con rol administrador
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse(['error' => 'Cannot delete admin users'], 403);
        }

        // Elimina el usuario y guarda los cambios
        $em->remove($user);
        $em->flush();

        // Respuesta de éxito
        return new JsonResponse(['message' => 'User deleted successfully'], 200);
    }
}
