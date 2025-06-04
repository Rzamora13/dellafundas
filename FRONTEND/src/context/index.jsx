import { ProductProvider } from './ProductContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import { AuthProvider } from './AuthContext';
import { CategoryProvider } from './CategoryContext';
import { ArtistProvider } from './ArtistContext';
import { UserProvider } from './UserContext';

// Componente que agrupa todos los providers en un solo lugar
// Esto facilita envolver la aplicación con todos los contextos necesarios
export const Providers = ({ children }) => (
    <UserProvider>
        <AuthProvider>
            <CategoryProvider>
                <ArtistProvider>
                    <ProductProvider>
                        <CartProvider>
                            <OrderProvider>
                                {children}
                            </OrderProvider>
                        </CartProvider>
                    </ProductProvider>
                </ArtistProvider>
            </CategoryProvider>
        </AuthProvider>
    </UserProvider>
);
