import { createContext, useState, useEffect, useContext } from 'react';
import { productAPI } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  // Estado para almacenar la lista de productos
  const [products, setProducts] = useState([]);

  // Estado para indicar si se están cargando datos
  const [loading, setLoading] = useState(false);

  // Función para obtener todos los productos desde la API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();

      // Almacena los productos asegurando que cada uno tenga un array de imágenes
      setProducts(data.map(product => ({
        ...product,
        images: product.images || []
      })));
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Ejecuta la carga de productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para crear un nuevo producto
  const createProduct = async (productData) => {
    try {
      const formData = new FormData();

      // Agrega los campos del producto al FormData
      formData.append("name", productData.name);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("stock", productData.stock);
      formData.append("category", productData.categoryId);
      formData.append("artist", productData.artistId);

      // Agrega imágenes si existen
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach(image => formData.append("images[]", image));
      }

      const newProduct = await productAPI.create(formData);
      setProducts(prev => [...prev, { ...newProduct, images: newProduct.images || [] }]);
      return true;
    } catch (error) {
      console.error("Error al crear producto:", error);
      return false;
    }
  };

  // Función para actualizar un producto existente
  const updateProduct = async (productId, updatedData) => {
    try {
      const formData = new FormData();

      // Convierte el objeto en una lista de clave-valor y los recorre
      // Si la clave es "images" y el valor es un array, añade cada imagen individualmente con la clave "images[]"
      Object.entries(updatedData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach(image => formData.append("images[]", image));
        } else {
          formData.append(key, value);
        }
      });

      const updatedProduct = await productAPI.update(productId, formData);
      setProducts(prev =>
        prev.map(p => (p.id === productId ? { ...updatedProduct, images: updatedProduct.images || [] } : p))
      );
      return true;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      return false;
    }
  };

  // Función para eliminar un producto
  const deleteProduct = async (productId) => {
    try {
      await productAPI.delete(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  };

  // Función para obtener un producto por ID
  const getProductById = async (id) => {
    try {
      const product = await productAPI.get(id);
      // Devuelve el producto asegurando el array de imágenes
      return { ...product, images: product.images || [] };
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
  };

  // Función para importar productos desde un archivo CSV
  const importProductsFromCSV = async (csvFile) => {
    try {
      // Crea un FormData para enviar el archivo CSV
      // Como si fuera un formulario HTML
      const formData = new FormData();
      formData.append('csv', csvFile);

      const importedProducts = await productAPI.importCSV(formData);
      await fetchProducts();
      return { success: true, count: importedProducts.length };
    } catch (error) {
      console.error("Error al importar productos desde CSV:", error);
      return { success: false };
    }
  };

  // Proporciona el contexto a los componentes hijos
  return (
    <ProductContext.Provider value={{ products, loading, createProduct, updateProduct, deleteProduct, getProductById, fetchProducts, importProductsFromCSV, }}>
      {children}
    </ProductContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useProducts = () => useContext(ProductContext);
