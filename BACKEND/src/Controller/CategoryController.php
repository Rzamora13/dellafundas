<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/category')] // Prefijo común para rutas relacionadas con categorías
class CategoryController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        // Inyecta el EntityManager para manejar operaciones con la base de datos
        $this->entityManager = $entityManager;
    }

    // Crear una nueva categoría a partir de datos JSON enviados en la petición POST
    #[Route('/create', methods: ['POST'])]
    public function createCategory(Request $request): JsonResponse
    {
        // Decodifica el JSON recibido en el cuerpo de la petición
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null; // Obtener nombre de la categoría

        // Validar que se haya enviado el nombre
        if (!$name) {
            return new JsonResponse(['error' => 'Nombre de la categoría requerido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear nueva instancia de Category y asignar el nombre
        $category = new Category();
        $category->setName($name);

        // Persistir la nueva categoría en la base de datos
        $this->entityManager->persist($category);
        $this->entityManager->flush();

        // Responder con mensaje y datos de la categoría creada, con código 201
        return new JsonResponse([
            'message' => 'Categoría creada con éxito',
            'category' => [
                'id' => $category->getId(),
                'name' => $category->getName()
            ]
        ], JsonResponse::HTTP_CREATED);
    }

    // Listar todas las categorías existentes (GET)
    #[Route('/list', methods: ['GET'])]
    public function listCategories(): JsonResponse
    {
        // Obtener todas las categorías desde la base de datos
        $categories = $this->entityManager->getRepository(Category::class)->findAll();

        $data = [];
        // Recorrer las categorías para preparar el array de respuesta
        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        // Devolver la lista de categorías con código 200 OK
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    // Actualizar el nombre de una categoría específica vía PUT
    #[Route('/update/{id}', methods: ['PUT'])]
    public function updateCategory(int $id, Request $request): JsonResponse
    {
        // Buscar la categoría por su ID
        $category = $this->entityManager->getRepository(Category::class)->find($id);

        // Si no se encuentra, responder con error 404
        if (!$category) {
            return new JsonResponse(['error' => 'Categoría no encontrada'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Obtener datos JSON enviados en la petición
        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;

        // Validar que se envíe el nombre
        if (!$name) {
            return new JsonResponse(['error' => 'Nombre de la categoría requerido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Actualizar el nombre de la categoría
        $category->setName($name);
        $this->entityManager->flush(); // Guardar cambios

        // Responder con mensaje y datos actualizados
        return new JsonResponse([
            'message' => 'Categoría actualizada con éxito',
            'category' => [
                'id' => $category->getId(),
                'name' => $category->getName()
            ]
        ]);
    }

    // Eliminar una categoría solo si no tiene productos asociados
    #[Route('/delete/{id}', methods: ['DELETE'])]
    public function deleteCategory(int $id): JsonResponse
    {
        // Buscar la categoría por ID
        $category = $this->entityManager->getRepository(Category::class)->find($id);

        // Si no existe, devolver error 404
        if (!$category) {
            return new JsonResponse(['error' => 'Categoría no encontrada'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Contar productos que tengan esta categoría asignada
        $productRepository = $this->entityManager->getRepository(Product::class);
        $productsCount = $productRepository->count(['category' => $category]);

        // Si existen productos asociados, impedir la eliminación y devolver error 400
        if ($productsCount > 0) {
            return new JsonResponse([
                'error' => 'No se puede eliminar la categoría porque tiene productos asociados.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Remover la categoría y guardar cambios
        $this->entityManager->remove($category);
        $this->entityManager->flush();

        // Confirmar eliminación exitosa
        return new JsonResponse(['message' => 'Categoría eliminada con éxito']);
    }
}
