import { useEffect } from "react";
import { getAllProducts } from "../services/product";
import { useParams } from "react-router-dom";

function ViewProduct() {
  const { id } = useParams();
  useEffect(() => {
    // Fetch product details using the id
    try {
        const response = getAllProducts(id);
    }
    catch (error) {
        console.error("Error fetching product details:", error);
    }
  }, [id]);
  return (
    <div>
      <h1>View Product</h1>
    </div>
  );
}

export default ViewProduct;