<?php

namespace App\Controller;

use App\Entity\Order;
use App\Entity\User;
use App\Entity\OrderProduct;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/order')] // Ruta base para todas las acciones relacionadas con pedidos (orders)
class OrderController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        // Inyección del EntityManager para acceso a base de datos
        $this->entityManager = $entityManager;
    }

    // Crear un pedido para un usuario específico basado en su carrito actual
    #[Route('/create/{userId}', methods: ['POST'])]
    public function createOrder(int $userId): JsonResponse
    {
        // Buscar el usuario por su ID
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        if (!$user) {
            // Usuario no encontrado, devolver error 404
            return new JsonResponse(['error' => 'Usuario no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Obtener el carrito del usuario
        $cart = $user->getCart();
        // Verificar que exista carrito y que no esté vacío
        if (!$cart || $cart->getCartProducts()->isEmpty()) {
            return new JsonResponse(['error' => 'Carrito vacío o no encontrado'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Crear nueva entidad Order
        $order = new Order();
        $order->setUser($user); // Asociar usuario al pedido
        $order->setCreatedAt(new \DateTimeImmutable()); // Fecha de creación actual

        // Recorrer los productos del carrito para agregarlos al pedido
        foreach ($cart->getCartProducts() as $cartProduct) {
            $product = $cartProduct->getProduct();
            $quantity = $cartProduct->getQuantity();

            // Verificar que el stock disponible sea suficiente para la cantidad pedida
            if ($product->getStock() < $quantity) {
                return new JsonResponse([
                    'error' => 'Stock insuficiente para el producto: ' . $product->getName()
                ], JsonResponse::HTTP_BAD_REQUEST);
            }

            // Actualizar stock restando la cantidad pedida
            $product->setStock($product->getStock() - $quantity);
            $this->entityManager->persist($product);

            // Crear una entidad OrderProduct para guardar detalles del producto en el pedido
            $subtotal = $product->getPrice() * $quantity;
            $orderProduct = new OrderProduct();
            $orderProduct->setProductName($product->getName());
            $orderProduct->setProductPrice($product->getPrice());
            $orderProduct->setQuantity($quantity);
            $orderProduct->setSubtotal($subtotal);
            // Asociar el producto al pedido
            $order->addOrderProduct($orderProduct);
        }

        // Calcular el total sumando subtotales de cada producto en el pedido
        $total = array_reduce(
            $order->getOrderProducts()->toArray(),
            fn($sum, OrderProduct $op) => $sum + $op->getSubtotal(),
            0
        );
        $order->setTotal($total); // Asignar total al pedido

        // Persistir el pedido y sus cambios en la base de datos
        $this->entityManager->persist($order);
        $this->entityManager->flush();

        // Devolver respuesta indicando éxito con código 201 Created
        return new JsonResponse(['message' => 'Compra realizada con éxito'], JsonResponse::HTTP_CREATED);
    }

    // Listar todos los pedidos de un usuario dado
    #[Route('/list/{userId}', methods: ['GET'])]
    public function listOrders(int $userId): JsonResponse
    {
        // Buscar usuario por ID
        $user = $this->entityManager->getRepository(User::class)->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Buscar todos los pedidos asociados a este usuario
        $orders = $this->entityManager->getRepository(Order::class)->findBy(['user' => $user]);
        $data = [];

        // Preparar datos para la respuesta JSON
        foreach ($orders as $order) {
            $products = [];
            // Recopilar detalles de los productos de cada pedido
            foreach ($order->getOrderProducts() as $orderProduct) {
                $products[] = [
                    'name' => $orderProduct->getProductName(),
                    'price' => $orderProduct->getProductPrice(),
                    'quantity' => $orderProduct->getQuantity(),
                ];
            }

            $data[] = [
                'id' => $order->getId(),
                'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
                'status' => $order->getStatus(),
                'products' => $products,
                'total' => $order->getTotal(),
            ];
        }

        // Devolver la lista de pedidos del usuario con código 200 OK
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    // Listar todos los pedidos de todos los usuarios (administración)
    #[Route('/list', methods: ['GET'])]
    public function listAllOrders(): JsonResponse
    {
        // Obtener todos los pedidos
        $orders = $this->entityManager->getRepository(Order::class)->findAll();
        $data = [];

        // Preparar datos para la respuesta
        foreach ($orders as $order) {
            $products = [];
            foreach ($order->getOrderProducts() as $orderProduct) {
                $products[] = [
                    'name' => $orderProduct->getProductName(),
                    'price' => $orderProduct->getProductPrice(),
                    'quantity' => $orderProduct->getQuantity(),
                ];
            }

            $data[] = [
                'id' => $order->getId(),
                'user' => [
                    'id' => $order->getUser()->getId(),
                    'email' => $order->getUser()->getEmail(),
                ],
                'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
                'status' => $order->getStatus(),
                'products' => $products,
                'total' => $order->getTotal(),
            ];
        }

        // Responder con todos los pedidos y código 200 OK
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }

    // Actualizar el estado de un pedido específico
    #[Route('/update-status/{orderId}', methods: ['PUT'])]
    public function updateOrderStatus(int $orderId, Request $request): JsonResponse
    {
        // Obtener datos JSON enviados en la petición
        $content = json_decode($request->getContent(), true);
        $status = $content['status'] ?? null;

        // Validar que se haya enviado estado
        if (!$status) {
            return new JsonResponse(['error' => 'Estado requerido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Validar que el estado sea uno de los permitidos
        $validStatuses = ['pendiente', 'en_camino', 'entregado'];
        if (!in_array($status, $validStatuses, true)) {
            return new JsonResponse(['error' => 'Estado inválido'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Buscar pedido por ID
        $order = $this->entityManager->getRepository(Order::class)->find($orderId);
        if (!$order) {
            return new JsonResponse(['error' => 'Pedido no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }

        // No permitir modificar un pedido que ya esté entregado
        if ($order->getStatus() === 'entregado') {
            return new JsonResponse(['error' => 'No se puede modificar un pedido entregado'], JsonResponse::HTTP_FORBIDDEN);
        }

        // Actualizar estado y guardar cambios
        $order->setStatus($status);
        $this->entityManager->flush();

        // Responder confirmando la actualización
        return new JsonResponse(['message' => 'Estado del pedido actualizado'], JsonResponse::HTTP_OK);
    }
}
