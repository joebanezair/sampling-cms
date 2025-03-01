import { useState, useEffect } from "react";
import { ref, get, set, remove, update, push } from "firebase/database";
import { database } from "../firebase/firebase";
import { useAuth } from "../authcontext/authContext";

const defaultProduct = {
    id: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    manufacturer: "",
    sku: "",
    createdAt: "",
    updatedAt: "",
};

const ProductCRUD = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [product, setProduct] = useState(defaultProduct);
    const [categories, setCategories] = useState([]); // Store unique categories
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    // Fetch products & categories
    useEffect(() => {
        if (!currentUser) return;

        const fetchProducts = async () => {
            try {
                const userProductsRef = ref(database, `users/${currentUser.uid}/products`);
                const snapshot = await get(userProductsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const productList = Object.entries(data).map(([id, item]) => ({ id, ...item }));

                    setProducts(productList);

                    // Extract unique categories
                    const uniqueCategories = [...new Set(productList.map((item) => item.category))];
                    setCategories(uniqueCategories);
                } else {
                    setProducts([]);
                    setCategories([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentUser]);

    // Handle input change
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Create or update a product
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        const userProductsRef = ref(database, `users/${currentUser.uid}/products`);

        try {
            if (editingId) {
                const productRef = ref(database, `users/${currentUser.uid}/products/${editingId}`);
                await update(productRef, {
                    ...product,
                    updatedAt: new Date().toISOString(),
                });

                setProducts((prev) =>
                    prev.map((p) => (p.id === editingId ? { ...p, ...product } : p))
                );

                setEditingId(null);
            } else {
                const newProductRef = push(userProductsRef);
                const newProduct = {
                    ...product,
                    id: newProductRef.key,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                await set(newProductRef, newProduct);
                setProducts((prev) => [...prev, newProduct]);

                // Add category if new
                if (!categories.includes(product.category)) {
                    setCategories([...categories, product.category]);
                }
            }

            setProduct(defaultProduct);
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    // Edit product
    const handleEdit = (product) => {
        setProduct(product);
        setEditingId(product.id);
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!currentUser) return;
        const productRef = ref(database, `users/${currentUser.uid}/products/${id}`);

        try {
            await remove(productRef);
            setProducts((prev) => prev.filter((p) => p.id !== id));

            // Update categories if the deleted product was the last one in its category
            const remainingProducts = products.filter((p) => p.id !== id);
            const updatedCategories = [...new Set(remainingProducts.map((p) => p.category))];
            setCategories(updatedCategories);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {editingId ? "Edit Product" : "Add New Product"}
            </h2>

            {/* Product Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={product.name}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 mb-2"
                />

                {/* Category Dropdown */}
                {/* <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border p-2 mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select> */}
                <select
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 h-10 overflow-y-auto"
                    style={{ maxHeight: "180px" }} // Limit dropdown height (approx 7 items)
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Allow manual category input */}
                <input
                    type="text"
                    name="category"
                    placeholder="Or enter new category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 mb-2"
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={product.stock}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 mb-2"
                />
                <input
                    type="text"
                    name="manufacturer"
                    placeholder="Manufacturer"
                    value={product.manufacturer}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={product.description}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2"
                ></textarea>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    {editingId ? "Update" : "Add"} Product
                </button>
            </form>

            {/* Products List */}
            {loading ? (
                <div>Loading products...</div>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Products</h3>
                    {products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        products.map((p) => (
                            <div key={p.id} className="border-b py-2 flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold">{p.name}</h4>
                                    <p className="text-gray-600">
                                        {p.category} - ${p.price}
                                    </p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductCRUD;
