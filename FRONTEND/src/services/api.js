//---------- URL BASE DE LA API ----------\\
const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_PORT = import.meta.env.VITE_PORT;

//---------- FUNCIÓN GENERAL PARA CONECTARSE A LA API ----------\\
export const fetchFromAPI = async (endpoint, method = 'GET', body = null) => {
    try {
        const url = `${VITE_BASE_URL}:${VITE_PORT}/${endpoint}`;
        const options = { method, headers: { 'Accept': 'application/json' } };

        if (body) {
            if (body instanceof FormData) {
                // Si el body es un FormData (para subir archivos), no se define content-type para que el navegador lo gestione
                options.body = body;
            } else {
                // Si es un objeto JSON, se agrega content-type y se convierte a string
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
            }
        }

        // Se realiza la llamada fetch con la url y opciones definidas
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        // Para peticiones DELETE se devuelve true, para otras se devuelve el JSON recibido
        return method === 'DELETE' ? true : await response.json();
    } catch (error) {
        console.error(`Error en fetchFromAPI [${method} ${endpoint}]:`, error);
        throw error;
    }
};

//---------- OBJETOS CON FUNCIONES ESPECÍFICAS PARA CADA RECURSO DE LA API ----------\\

// Funciones para manejar los productos
export const productAPI = {
    getAll: () => fetchFromAPI('products/list'),
    get: (id) => fetchFromAPI(`products/${id}`),
    create: (data) => fetchFromAPI('products/create', 'POST', data),
    update: (id, data) => fetchFromAPI(`products/update/${id}`, 'POST', data),
    delete: (id) => fetchFromAPI(`products/delete/${id}`, 'DELETE'),
    importCSV: (formData) => fetchFromAPI('products/import', 'POST', formData),
};

// Funciones para manejar el carrito de compra
export const cartAPI = {
    get: (userId) => fetchFromAPI(`cart/list/${userId}`),
    add: (userId, productId, quantity) => fetchFromAPI('cart/add', 'POST', { user_id: userId, product_id: productId, quantity }),
    remove: (cartProductId) => fetchFromAPI(`cart/remove/${cartProductId}`, 'DELETE'),
    update: (cartProductId, quantity) => fetchFromAPI('cart/update', 'PUT', { cart_product_id: cartProductId, quantity }),
    clear: (userId) => fetchFromAPI(`cart/clear/${userId}`, 'DELETE'),
};

// Funciones para manejar órdenes
export const orderAPI = {
    get: (userId) => fetchFromAPI(`order/list/${userId}`),
    getAll: () => fetchFromAPI('order/list'),
    create: (userId, cartItems) => fetchFromAPI(`order/create/${userId}`, 'POST', { items: cartItems }),
    updateStatus: (orderId, status) => fetchFromAPI(`order/update-status/${orderId}`, 'PUT', { status }),
};

// Funciones para manejar categorías
export const categoryAPI = {
    getAll: () => fetchFromAPI('category/list'),
    get: (id) => fetchFromAPI(`category/${id}`),
    create: (data) => fetchFromAPI('category/create', 'POST', data),
    update: (id, data) => fetchFromAPI(`category/update/${id}`, 'PUT', data),
    delete: (id) => fetchFromAPI(`category/delete/${id}`, 'DELETE'),
};

// Funciones para manejar artistas
export const artistAPI = {
    getAll: () => fetchFromAPI('artist/list'),
    get: (id) => fetchFromAPI(`artist/${id}`),
    create: (data) => fetchFromAPI('artist/create', 'POST', data),
    update: (id, data) => fetchFromAPI(`artist/update/${id}`, 'PUT', data),
    delete: (id) => fetchFromAPI(`artist/delete/${id}`, 'DELETE'),
};

// Funciones para manejar usuarios
export const userAPI = {
    getAll: () => fetchFromAPI("users/"),
    get: (id) => fetchFromAPI(`users/${id}`),
    updateRole: (id, roles) => fetchFromAPI(`users/update/${id}/roles`, "PATCH", { roles }),
    delete: (id) => fetchFromAPI(`users/delete/${id}`, "DELETE"),
};
