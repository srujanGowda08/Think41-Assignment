import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => setProducts(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2>All Products</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`}>{p.name}</Link> - ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ProductList;
