import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find((i) => i.id === item.id);

                if (existingItem) {
                    if (existingItem.quantity >= item.stock) {
                        return; // Cannot add more than stock
                    }
                    set({
                        items: items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                } else {
                    set({ items: [...items, { ...item, quantity: 1 }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                const items = get().items;
                const item = items.find((i) => i.id === id);

                if (!item) return;

                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                if (quantity > item.stock) {
                    return; // Cannot exist stock
                }

                set({
                    items: items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);

// Wishlist Store
export interface WishlistItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

interface WishlistStore {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    toggleItem: (item: WishlistItem) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            toggleItem: (item) => {
                const items = get().items;
                const exists = items.find((i) => i.id === item.id);
                if (exists) {
                    set({ items: items.filter((i) => i.id !== item.id) });
                } else {
                    set({ items: [...items, item] });
                }
            },

            isInWishlist: (id) => {
                return get().items.some((i) => i.id === id);
            },

            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'wishlist-storage',
        }
    )
);

// Search History Store
interface SearchHistoryStore {
    searches: string[];
    addSearch: (query: string) => void;
    removeSearch: (query: string) => void;
    clearHistory: () => void;
}

const MAX_SEARCH_HISTORY = 10;

export const useSearchHistoryStore = create<SearchHistoryStore>()(
    persist(
        (set, get) => ({
            searches: [],

            addSearch: (query) => {
                const trimmed = query.trim().toLowerCase();
                if (!trimmed) return;

                const searches = get().searches.filter(s => s !== trimmed);
                searches.unshift(trimmed);
                set({ searches: searches.slice(0, MAX_SEARCH_HISTORY) });
            },

            removeSearch: (query) => {
                set({ searches: get().searches.filter(s => s !== query) });
            },

            clearHistory: () => set({ searches: [] }),
        }),
        {
            name: 'search-history-storage',
        }
    )
);

// Compare Store
export interface CompareItem {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    avgRating?: number;
    soldCount?: number;
    brand?: string | null;
}

interface CompareStore {
    items: CompareItem[];
    addItem: (item: CompareItem) => void;
    removeItem: (id: string) => void;
    clearCompare: () => void;
    isInCompare: (id: string) => boolean;
}

export const useCompareStore = create<CompareStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                if (items.length >= 3) return; // Limit 3
                if (!items.find((i) => i.id === item.id)) {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
            clearCompare: () => set({ items: [] }),
            isInCompare: (id) => !!get().items.find((i) => i.id === id),
        }),
        { name: 'compare-storage' }
    )
);
