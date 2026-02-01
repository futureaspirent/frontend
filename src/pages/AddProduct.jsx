

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Products.module.css";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    productId: "",
    category: "",
    price: "",
    quantity: "",
    unit: "",
    expiryDate: "",
    threshold: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (image) {
        data.append("image", image);
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "x-auth-token": token,
          },
          body: data,
        }
      );

      if (!res.ok) throw new Error("Failed");

      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  return (
    <div className={styles.AddProductcontainer}>
      <Sidebar />

      <main className={styles.AddProductmain}>
        <header >        
          <h1 style={{color:'white',borderBottom:'2px solid white',marginTop:'19px'}}>Products</h1>
</header>
        <p className={styles.pagesub}>AddProduct &gt;IndividualProduct</p>

        <div className={styles.formFields}>
          
         <h5>New Product</h5><br/>
          <div className={styles.formRow}>
            <div className={styles.image}>           
               <input type="file" accept="image/*" onChange={handleImageChange}  
/><p>Drag image here <br/>or <br/><spam style={{ color: "blue" }}>Browser image</spam></p>
              </div>
          </div>

          <div className={styles.formRow}>
            <label>Product Name</label>
            <input name="name" onChange={handleChange} placeholder="Enter product name" />
          </div>

          <div className={styles.formRow}>
            <label>Product ID</label>
            <input name="productId" onChange={handleChange} placeholder="Enter product id" />
          </div>

          <div className={styles.formRow}>
            <label>Category</label>
            <input name="category" onChange={handleChange} placeholder="Enter category"/>
          </div>

          <div className={styles.formRow}>
            <label>Price</label>
            <input name="price" type="number" onChange={handleChange} placeholder="Enter price" />
          </div>

          <div className={styles.formRow}>
            <label>Quantity</label>
            <input name="quantity" type="number" onChange={handleChange} placeholder="Enter Quantity"/>
          </div>

          <div className={styles.formRow}>
            <label>Unit</label>
            <input name="unit" onChange={handleChange} placeholder="Enter unit"/>
          </div>

          <div className={styles.formRow}>
            <label>Expire Date</label>
            <input name="expiryDate" type="date" onChange={handleChange} placeholder="Enter expire date" />
          </div>

          <div className={styles.formRow}>
            <label>Threshold</label>
            <input name="threshold" type="number" onChange={handleChange} placeholder="Enter threshold" />
          </div>

        <div className={styles.modalActions}>
          <button onClick={() => navigate("/products")}>Cancel</button>
          <button onClick={handleSubmit}>Add Product</button>
        </div>
         </div>
      </main>
    </div>
  );
};

export default AddProduct;
