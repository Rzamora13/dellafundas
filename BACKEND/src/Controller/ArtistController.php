<?php

namespace App\Controller;

use App\Entity\Artist;
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/artist')] // Ruta base para todas las acciones de este controlador
class ArtistController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/create', methods: ['POST'])] // Endpoint para crear un artista
    public function createArtist(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true); // Decodificamos el cuerpo de la solicitud
        $name = $data['name'] ?? null; // Obtenemos el nombre o null si no está definido

        if (!$name) {
            // Si no se proporciona el nombre, retornamos error
            return new JsonResponse(['error' => 'Nombre del artista requerido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Creamos y persistimos un nuevo artista
        $artist = new Artist();
        $artist->setName($name);

        $this->entityManager->persist($artist);
        $this->entityManager->flush();

        // Devolvemos una respuesta con el nuevo artista
        return new JsonResponse([
            'message' => 'Artista creado con éxito',
            'artist' => [
                'id' => $artist->getId(),
                'name' => $artist->getName()
            ]
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/list', methods: ['GET'])] // Endpoint para listar todos los artistas
    public function listArtists(): JsonResponse
    {
        $artists = $this->entityManager->getRepository(Artist::class)->findAll(); // Obtenemos todos los artistas

        // Transformamos los objetos en arrays
        $data = [];
        foreach ($artists as $artist) {
            $data[] = [
                'id' => $artist->getId(),
                'name' => $artist->getName(),
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK); // Retornamos la lista en formato JSON
    }

    #[Route('/update/{id}', methods: ['PUT'])] // Endpoint para actualizar un artista
    public function updateArtist(int $id, Request $request): JsonResponse
    {
        // Buscamos el artista por ID
        $artist = $this->entityManager->getRepository(Artist::class)->find($id);

        if (!$artist) {
            return new JsonResponse(['error' => 'Artista no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        $name = $data['name'] ?? null;

        if (!$name) {
            return new JsonResponse(['error' => 'Nombre del artista requerido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Actualizamos el nombre y persistimos el cambio
        $artist->setName($name);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Artista actualizado con éxito',
            'artist' => [
                'id' => $artist->getId(),
                'name' => $artist->getName()
            ]
        ]);
    }

    #[Route('/delete/{id}', methods: ['DELETE'])] // Endpoint para eliminar un artista
    public function deleteArtist(int $id): JsonResponse
    {
        // Buscamos el artista por ID
        $artist = $this->entityManager->getRepository(Artist::class)->find($id);

        if (!$artist) {
            return new JsonResponse(['error' => 'Artista no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Validar que no tenga productos asociados
        $productRepository = $this->entityManager->getRepository(Product::class);
        $productsCount = $productRepository->count(['artist' => $artist]);

        // Si existen productos asociados, impedir la eliminación y devolver error 400
        if ($productsCount > 0) {
            return new JsonResponse([
                'error' => 'No se puede eliminar el artista porque tiene productos asociados.'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $this->entityManager->remove($artist);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Artista eliminado con éxito']);
    }
}
