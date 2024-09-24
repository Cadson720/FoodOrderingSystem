

export const addToCart = (cartItems, newItem) => {
    // Check if the item already exists in the cart
    const itemExists = cartItems.find(item => item.id === newItem.id);

    if (itemExists) {
        // If the item already exists, update the quantity
        return cartItems.map(item =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
    } else {
        // If it's a new item, add it to the cart
        return [...cartItems, { ...newItem, quantity: 1 }];
    }
};
