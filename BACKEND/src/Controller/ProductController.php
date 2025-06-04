<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use App\Entity\Artist;
use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/products')]
class ProductController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;

    // Constructor que inyecta EntityManager para acceso a BD y Serializer para convertir objetos a JSON
    public function __construct(EntityManagerInterface $entityManager, SerializerInterface $serializer)
    {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    // Listar todos los productos disponibles (GET /products/list)
    #[Route('/list', methods: ['GET'])]
    public function listProducts(): JsonResponse
    {
        $products = $this->entityManager->getRepository(Product::class)->findAll();  // Obtener todos los productos
        // Serializar productos a JSON usando grupo 'product:read'
        $json = $this->serializer->serialize($products, 'json', ['groups' => ['product:read']]);
        return new JsonResponse(json_decode($json), JsonResponse::HTTP_OK);  // Retornar JSON con código 200
    }

    // Obtener detalle de un producto por ID (GET /products/{id})
    #[Route('/{id}', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getProduct(int $id): JsonResponse
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);  // Buscar producto por ID

        if (!$product) {
            // Si no existe el producto, devolver error 404
            return new JsonResponse(['error' => 'Producto no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Serializar producto y devolverlo
        $json = $this->serializer->serialize($product, 'json', ['groups' => ['product:read']]);
        return new JsonResponse(json_decode($json), JsonResponse::HTTP_OK);
    }

    // Crear un nuevo producto (POST /products/create)
    #[Route('/create', methods: ['POST'])]
    public function createProduct(Request $request): JsonResponse
    {
        // Recoger datos enviados en el request
        $name = $request->request->get('name');
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $stock = $request->request->get('stock');
        $categoryId = $request->request->get('category');
        $artistId = $request->request->get('artist');

        // Validar datos obligatorios
        if (!$name || !$price || !$stock) {
            return new JsonResponse(['error' => 'Nombre, precio y stock son requeridos'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Validar que precio sea numérico y positivo
        if ($price !== null && (!is_numeric($price) || $price < 0)) {
            return new JsonResponse(['error' => 'Precio inválido'], JsonResponse::HTTP_BAD_REQUEST);
        }
        // Validar que stock sea numérico y positivo
        if ($stock !== null && (!is_numeric($stock) || $stock < 0)) {
            return new JsonResponse(['error' => 'Stock inválido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear instancia de Product y asignar valores
        $product = new Product();
        $product->setName($name);
        $product->setDescription($description);
        $product->setPrice((float)$price);
        $product->setStock((int)$stock);

        // Si se recibe categoría, se busca en BD y se asigna
        if ($categoryId) {
            $category = $this->entityManager->getRepository(Category::class)->find($categoryId);
            if ($category) {
                $product->setCategory($category);
            }
        }

        // Si se recibe artista, se busca en BD y se asigna
        if ($artistId) {
            $artist = $this->entityManager->getRepository(Artist::class)->find($artistId);
            if ($artist) {
                $product->setArtist($artist);
            }
        }

        // Persistir producto en base de datos
        $this->entityManager->persist($product);
        $this->entityManager->flush();

        // Procesar imágenes subidas en el request (campo 'images')
        foreach ($request->files->all('images') as $file) {
            // Generar nombre único y mover archivo a carpeta de uploads
            $filename = uniqid() . '.' . $file->guessExtension();
            $file->move($this->getParameter('uploads_directory'), $filename);

            // Crear entidad Image relacionada al producto y persistirla
            $image = new Image();
            $image->setPath('/uploads/' . $filename);
            $image->setProduct($product);
            $this->entityManager->persist($image);
        }

        $this->entityManager->flush();  // Guardar imágenes

        // Serializar producto creado y devolver respuesta 201 (creado)
        $json = $this->serializer->serialize($product, 'json', ['groups' => ['product:read']]);
        return new JsonResponse(json_decode($json), JsonResponse::HTTP_CREATED);
    }

    // Actualizar producto existente (POST /products/update/{id})
    #[Route('/update/{id}', methods: ['POST'])]
    public function updateProduct(int $id, Request $request): JsonResponse
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);
        if (!$product) {
            return new JsonResponse(['error' => 'Producto no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Obtener posibles campos a actualizar
        $name = $request->request->get('name');
        $description = $request->request->get('description');
        $price = $request->request->get('price');
        $stock = $request->request->get('stock');
        $categoryId = $request->request->get('categoryId');
        $artistId = $request->request->get('artistId');

        // Actualizar solo campos que no sean null
        if ($name !== null) {
            $product->setName($name);
        }
        if ($description !== null) {
            $product->setDescription($description);
        }
        if ($price !== null) {
            $product->setPrice((float)$price);
        }
        if ($stock !== null) {
            $product->setStock((int)$stock);
        }

        // Actualizar categoría si fue enviada
        if ($categoryId !== null) {
            $category = $this->entityManager->getRepository(Category::class)->find($categoryId);
            $product->setCategory($category);
        }

        // Actualizar artista si fue enviado
        if ($artistId !== null) {
            $artist = $this->entityManager->getRepository(Artist::class)->find($artistId);
            $product->setArtist($artist);
        }

        // Procesar nuevas imágenes (si hay)
        foreach ($request->files->all('images') as $file) {
            $filename = uniqid() . '.' . $file->guessExtension();
            $file->move($this->getParameter('uploads_directory'), $filename);

            $image = new Image();
            $image->setPath('/uploads/' . $filename);
            $image->setProduct($product);
            $this->entityManager->persist($image);
        }

        $this->entityManager->flush();

        // Devolver producto actualizado
        $json = $this->serializer->serialize($product, 'json', ['groups' => ['product:read']]);
        return new JsonResponse(json_decode($json), JsonResponse::HTTP_OK);
    }

    // Eliminar un producto (DELETE /products/delete/{id})
    #[Route('/delete/{id}', methods: ['DELETE'])]
    public function deleteProduct(int $id): JsonResponse
    {
        $product = $this->entityManager->getRepository(Product::class)->find($id);
        if (!$product) {
            return new JsonResponse(['error' => 'Producto no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Eliminar todas las imágenes asociadas al producto, borrando también archivos físicos
        $images = $this->entityManager->getRepository(Image::class)->findBy(['product' => $product]);
        foreach ($images as $image) {
            $filePath = $this->getParameter('kernel.project_dir') . '/public' . $image->getPath();
            if (file_exists($filePath)) {
                unlink($filePath);  // Borrar archivo del sistema
            }
            $this->entityManager->remove($image);  // Eliminar entidad imagen
        }

        // Eliminar producto de la base de datos
        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Producto eliminado correctamente'], JsonResponse::HTTP_OK);
    }

    // Importar productos desde un archivo CSV (POST /products/import)
    #[Route('/import', methods: ['POST'])]
    public function importProducts(Request $request): JsonResponse
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('csv');

        // Validar archivo CSV válido
        if (!$file || $file->getClientOriginalExtension() !== 'csv') {
            return new JsonResponse(['error' => 'Archivo CSV inválido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Abrir archivo para lectura
        $handle = fopen($file->getPathname(), 'r');
        if (!$handle) {
            return new JsonResponse(['error' => 'No se pudo leer el archivo'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        $header = fgetcsv($handle);  // Leer fila de encabezados (nombres columnas)
        $count = 0;  // Contador de productos importados
        $errors = [];  // Almacena errores de filas inválidas

        // Leer fila por fila hasta el final
        while (($data = fgetcsv($handle)) !== false) {
            $row = array_combine($header, $data);  // Asociar datos con encabezados
            if (!$row) continue;

            // Extraer campos esperados
            $name = $row['name'] ?? null;
            $description = $row['description'] ?? '';
            $price = isset($row['price']) ? (float)$row['price'] : null;
            $stock = isset($row['stock']) ? (int)$row['stock'] : 0;
            $categoryName = trim($row['category'] ?? '');
            $artistName = trim($row['artist'] ?? '');
            $imagePaths = $row['image_paths'] ?? '';

            // Validar datos mínimos
            if (!$name || $price === null || $price < 0) {
                $errors[] = "Producto inválido en fila $count: nombre requerido y precio debe ser positivo.";
                continue;
            }

            // Crear producto y asignar datos
            $product = new Product();
            $product->setName($name);
            $product->setDescription($description);
            $product->setPrice($price);
            $product->setStock($stock);

            // Buscar o crear categoría según nombre
            if ($categoryName) {
                $category = $this->entityManager->getRepository(Category::class)->findOneBy(['name' => $categoryName]);
                if (!$category) {
                    $category = new Category();
                    $category->setName($categoryName);
                    $this->entityManager->persist($category);
                }
                $product->setCategory($category);
            }

            // Buscar o crear artista según nombre
            if ($artistName) {
                $artist = $this->entityManager->getRepository(Artist::class)->findOneBy(['name' => $artistName]);
                if (!$artist) {
                    $artist = new Artist();
                    $artist->setName($artistName);
                    $this->entityManager->persist($artist);
                }
                $product->setArtist($artist);
            }

            $this->entityManager->persist($product);
            $this->entityManager->flush();

            // Asociar imágenes indicadas en el CSV separadas por ";"
            if (!empty($imagePaths)) {
                $paths = explode(';', $imagePaths);
                foreach ($paths as $path) {
                    $path = trim($path);
                    if ($path) {
                        $image = new Image();
                        $image->setPath($path);
                        $image->setProduct($product);
                        $this->entityManager->persist($image);
                    }
                }
            }

            $this->entityManager->flush();
            $count++;
        }

        fclose($handle);

        // Retornar resultado con número de productos importados y errores encontrados
        return new JsonResponse([
            'message' => "$count productos importados correctamente",
            'errores' => $errors,
        ], JsonResponse::HTTP_OK);
    }
}
