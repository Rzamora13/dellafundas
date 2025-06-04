<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\CartProduct;
use App\Entity\Product;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/cart')] // Prefijo de ruta común para todas las acciones relacionadas con el carrito
class CartController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        // Inyección del EntityManager para interactuar con la base de datos
        $this->entityManager = $entityManager;
    }

    #[Route('/add', methods: ['POST'])] // Ruta para agregar un producto al carrito vía POST
    public function addToCart(Request $request): JsonResponse
    {
        // Obtener y decodificar los datos JSON enviados en el cuerpo de la petición
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'] ?? null;       // ID del usuario
        $productId = $data['product_id'] ?? null; // ID del producto a agregar
        $quantity = $data['quantity'] ?? 1;       // Cantidad, por defecto 1

        // Validar que se hayan recibido los IDs necesarios
        if (!$userId || !$productId) {
            return new JsonResponse(['error' => 'Usuario y producto requeridos'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Validar que la cantidad sea al menos 1
        if ($quantity < 1) {
            return new JsonResponse(['error' => 'La cantidad debe ser al menos 1'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Buscar el usuario y el producto en la base de datos
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        // Validar existencia de usuario y producto
        if (!$user || !$product) {
            return new JsonResponse(['error' => 'Usuario o producto no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Obtener el carrito asociado al usuario, si no existe crear uno nuevo
        $cart = $user->getCart();
        if (!$cart) {
            $cart = new Cart();
            $cart->setUser($user);
            $this->entityManager->persist($cart); // Persistir el carrito nuevo
        }

        // Revisar si el producto ya está en el carrito para actualizar cantidad
        $cartProduct = null;
        foreach ($cart->getCartProducts() as $cp) {
            if ($cp->getProduct()->getId() === $product->getId()) {
                $cartProduct = $cp; // Producto ya en el carrito
                break;
            }
        }

        // Si el producto ya estaba en el carrito, incrementar cantidad
        if ($cartProduct) {
            $cartProduct->setQuantity($cartProduct->getQuantity() + $quantity);
        } else {
            // Si no estaba, crear nueva entrada de producto en el carrito
            $cartProduct = new CartProduct();
            $cartProduct->setCart($cart);
            $cartProduct->setProduct($product);
            $cartProduct->setQuantity($quantity);
            $this->entityManager->persist($cartProduct);
        }

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        // Responder con mensaje de éxito y código HTTP 201
        return new JsonResponse(['message' => 'Producto agregado al carrito'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/list/{userId}', methods: ['GET'])] // Ruta para listar los productos del carrito de un usuario
    public function listCart(int $userId): JsonResponse
    {
        // Buscar usuario por ID
        $user = $this->entityManager->getRepository(User::class)->find($userId);

        // Verificar que usuario y carrito existan
        if (!$user || !$user->getCart()) {
            return new JsonResponse(['error' => 'Carrito no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Obtener los productos del carrito
        $cartProducts = $user->getCart()->getCartProducts();
        $data = [];

        // Recorrer los productos para preparar respuesta detallada
        foreach ($cartProducts as $cartProduct) {
            $product = $cartProduct->getProduct();
            $data[] = [
                'cart_product_id' => $cartProduct->getId(),
                'product_id' => $product->getId(),
                'product' => [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'price' => $product->getPrice(),
                    'stock' => $product->getStock(),
                ],
                'quantity' => $cartProduct->getQuantity(),
                'total' => $cartProduct->getQuantity() * $product->getPrice(), // Precio total de este producto en el carrito
            ];
        }

        // Devolver la lista de productos con código HTTP 200
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    #[Route('/update', methods: ['PUT'])] // Ruta para actualizar la cantidad de un producto en el carrito
    public function updateQuantity(Request $request): JsonResponse
    {
        // Decodificar JSON enviado en la petición
        $data = json_decode($request->getContent(), true);
        $cartProductId = $data['cart_product_id'] ?? null; // ID del producto en carrito
        $quantity = $data['quantity'] ?? null;             // Nueva cantidad

        // Validar que se reciban datos válidos
        if (!$cartProductId || !$quantity || $quantity < 1) {
            return new JsonResponse(['error' => 'ID del producto en carrito y cantidad válidos son requeridos'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Buscar el producto en el carrito
        $cartProduct = $this->entityManager->getRepository(CartProduct::class)->find($cartProductId);
        if (!$cartProduct) {
            return new JsonResponse(['error' => 'Producto no encontrado en el carrito'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Actualizar la cantidad y guardar cambios
        $cartProduct->setQuantity($quantity);
        $this->entityManager->flush();

        // Confirmar actualización
        return new JsonResponse(['message' => 'Cantidad actualizada'], JsonResponse::HTTP_OK);
    }

    #[Route('/remove/{cartProductId}', methods: ['DELETE'])] // Ruta para eliminar un producto del carrito
    public function removeFromCart(int $cartProductId): JsonResponse
    {
        // Buscar el producto en el carrito por su ID
        $cartProduct = $this->entityManager->getRepository(CartProduct::class)->find($cartProductId);
        if (!$cartProduct) {
            return new JsonResponse(['error' => 'Producto no encontrado en el carrito'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Remover el producto del carrito y persistir cambios
        $this->entityManager->remove($cartProduct);
        $this->entityManager->flush();

        // Confirmar eliminación
        return new JsonResponse(['message' => 'Producto eliminado del carrito'], JsonResponse::HTTP_OK);
    }

    #[Route('/clear/{userId}', methods: ['DELETE'])] // Ruta para vaciar completamente el carrito de un usuario
    public function clearCart(int $userId): JsonResponse
    {
        // Buscar usuario
        $user = $this->entityManager->getRepository(User::class)->find($userId);

        // Validar existencia de usuario y carrito
        if (!$user || !$user->getCart()) {
            return new JsonResponse(['error' => 'Carrito no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Recorrer todos los productos del carrito y eliminarlos
        foreach ($user->getCart()->getCartProducts() as $cartProduct) {
            $this->entityManager->remove($cartProduct);
        }

        // Guardar los cambios
        $this->entityManager->flush();

        // Confirmar que el carrito quedó vacío
        return new JsonResponse(['message' => 'Carrito vaciado'], JsonResponse::HTTP_OK);
    }
}
