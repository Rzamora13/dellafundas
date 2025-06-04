<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController] // Marca esta clase como un controlador de Symfony para rutas personalizadas
class AuthController
{
    #[Route('/login', name: 'api_login', methods: ['POST'])] // Endpoint para iniciar sesión
    public function login(Security $security): JsonResponse
    {
        $user = $security->getUser(); // Obtiene el usuario autenticado

        if (!$user) {
            // Si no hay usuario autenticado, se devuelve un error 401
            return new JsonResponse(['error' => 'No se ha autenticado correctamente'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$user instanceof User) {
            // Verifica que el usuario autenticado sea una instancia válida de User
            return new JsonResponse(['error' => 'El usuario autenticado no es válido'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Devuelve los datos básicos del usuario autenticado
        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles()
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])] // Endpoint para registrar un nuevo usuario
    public function register(Request $request, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true); // Decodifica el JSON recibido en el cuerpo

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            // Valida que ambos campos estén presentes
            return new JsonResponse(['error' => 'Email y contraseña son obligatorios'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Verifica si ya existe un usuario con ese email
        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'El email ya está registrado'], JsonResponse::HTTP_CONFLICT);
        }

        // Crea el nuevo usuario
        $user = new User();
        $user->setEmail($email);

        // Hashea la contraseña antes de guardarla
        $hashedPassword = $passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        // Guarda el usuario en la base de datos
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Usuario registrado con éxito'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/logout', name: 'api_logout', methods: ['POST'])] // Endpoint para cerrar sesión
    public function logout(): void
    {
        // Symfony maneja automáticamente el logout con la configuración de seguridad,
        // por lo tanto este método puede permanecer vacío.
    }
}