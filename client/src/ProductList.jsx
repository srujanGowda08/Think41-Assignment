  import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchDepartments();
  }, []);

  const fetchProducts = () => {
    axios.get("http://localhost:5000/products")
      .then(res => setProducts(res.data));
  };

  const fetchDepartments = () => {
    axios.get("http://localhost:5000/departments")
      .then(res => setDepartments(res.data));
  };

  const handleFilterChange = (e) => {
    setSelectedDept(e.target.value);
  };

  const filteredProducts = selectedDept
    ? products.filter(p => p.department === selectedDept)
    : products;

  return (
    <div className="p-4">
      <h2>All Products</h2>

      <div className="mb-3">
        <label>Filter by Department:</label>
        <select onChange={handleFilterChange} value={selectedDept}>
          <option value="">All</option>
          {departments.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <ul>
        {filteredProducts.map(p => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`}>{p.name}</Link> - ₹{p.price} [{p.department}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
