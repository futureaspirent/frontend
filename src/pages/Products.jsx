

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import Sidebar from '../components/Sidebar';
import styles from '../styles/Products.module.css';

import image from '../assets/Upload.png';
import image1 from '../assets/Divider.png';
import action from '../assets/action.png';
import csv from '../assets/csv.png';

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState(''); // "csv" only for CSV modal

  const [csvFile, setCsvFile] = useState(null);
  const [showCsvConfirm, setShowCsvConfirm] = useState(false);
  const [csvStep, setCsvStep] = useState(1);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 10;

  /* BUY PRODUCT STATES */
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyQty, setBuyQty] = useState('');

  const [isBuying, setIsBuying] = useState(false);

  const [summary,setSummary]=useState("");


  /* Disable background scroll */
  useEffect(() => {
    document.body.style.overflow =
      showAddModal || addType || showBuyModal ? 'hidden' : 'auto';
  }, [showAddModal, addType, showBuyModal]);

  /* Fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?page=${page}`,
          { headers: { 'x-auth-token': token } }
        );
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [page]);

  /* CSV change */
  const handleCsvChange = (e) => {
    if (e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setShowCsvConfirm(true);
      setCsvStep(1);
    }
  };

  /* Upload CSV */
    const handleUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("csvFile", csvFile); // key must match multer in backend

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/bulk`,
        {
          method: "POST",
          headers: {
            "x-auth-token": token, // do NOT set Content-Type manually
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.errors || data);
        alert(data.msg || "Upload failed");
        return;
      }

      alert(`Bulk upload successful! Total products added: ${data.total}`);
      
      // reset modal
      setAddType('');
      setCsvFile(null);
      setShowCsvConfirm(false);
      setCsvStep(1);
      setShowAddModal(false);

      location.reload();
      // Optionally, refresh product list
   

    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };


  /* Search + Pagination */
  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.productId?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);





useEffect(() => {
  const getSummary = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/summary`,
        {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const data = await res.json();
      setSummary(data);
    
    } catch (err) {
      console.error(err);
    }
  };

  getSummary();
}, []); 


  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.head1}>
          <div className={styles.header}>
          <h1 className={styles.pageTitle}>Products</h1>
            <input
              className={styles.search}
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>


<div className={styles.inventoryCard}>
  <div className={styles.inventoryTitle}>Overall Inventory</div>
  <br />

  <div className={styles.inventoryStats}>

    {/* Categories */}
    <div className={styles.inventoryItem}>

      <h5 className={styles.heading}>Categories</h5>
      <div className={styles.row}>
          <p style={{fontWeight:"bolder"}}>{summary.totalCategories}</p>
      </div>
      <div className={styles.row}>
          <p>Last 7 days</p>
      </div>
    
    </div>

    {/* <div className={styles.divider}></div> */}

    {/* Total Products */}
    <div className={styles.inventoryItem}>
      <h5 className={styles.heading}>Total Products</h5>
      <div className={styles.row}>
        <p style={{fontWeight:"bolder"}}>{summary.totalProductsQuantity}</p>
        <p style={{fontWeight:"bolder"}} className={styles.amount}>₹{summary.totalProductsValue}</p>

      </div>

      <div className={styles.row}>
        
        <p>Last 7 days</p>
        <p>Amount</p>
      </div>
    </div>

    {/* <div className={styles.divider}></div> */}

    {/* Top Selling */}
    <div className={styles.inventoryItem}>
      <h5 className={styles.heading}>Top Selling</h5>
      <div className={styles.row}>
        <p style={{fontWeight:"bolder"}}>6</p>
        <p style={{fontWeight:"bolder"}} className={styles.amount}>₹{summary.top6TotalAmount}</p>
      </div>
      <div className={styles.row}>
        <p>Last 7 days</p>
        <p>Revenue</p>
      </div>
    </div>

    {/* <div className={styles.divider}></div> */}

    {/* Low Stocks */}
    <div className={styles.inventoryItem}>
      <h5 className={styles.heading}>Low Stocks</h5>
      <div className={styles.row}>
        <p style={{fontWeight:"bolder"}}>{summary.lowStockCount}</p>
        <p style={{fontWeight:"bolder"}}>{summary.outOfStockCount}</p>
      </div>
      <div className={styles.row}>
        <p>Low Stock</p>
        <p>Not in stock</p>
      </div>
    </div>

  </div>
</div>


        {/* TABLE */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3>Products</h3>
            <button
              className={styles.addBtn}
              onClick={() => setShowAddModal(true)}
            >
              Add Product
            </button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Products</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Threshold</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(p => (
                <tr
                  key={p._id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowBuyModal(true);
                  }}
                >
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.quantity} {p.unit}</td>
                  <td>{p.threshold}</td>
                  <td>{p.expiryDate || '-'}</td>
                  <td className={styles[p.status] || styles['in-stock']}>
                    {p.status}
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td colSpan="6" className={styles.noData}>
                    No products added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ADD PRODUCT MODAL (CHOOSE TYPE) */}
      {showAddModal && !addType && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowAddModal(false)}
        >
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => navigate('/products/new')}>
              Individual product
            </button>
            <button onClick={() => setAddType('csv')}>
              Multiple product
            </button>
          </div>
        </div>
      )}

      {/* CSV MODAL */}
      {/* CSV MODAL */}
      {addType === 'csv' && (
        <div className={styles.modalOverlay} onClick={() => setAddType('')}>
          <div className={styles.csvModal} onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className={styles.csvHeader}>
              <h3>CSV Upload</h3>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setAddType('');
                  setCsvFile(null);
                  setShowCsvConfirm(false);
                  setCsvStep(1);
                }}
              >
                ×
              </button>
            </div>

            {/* File input */}
            <input
              type="file"
              accept=".csv"
              hidden
              id="csvInput"
              onChange={handleCsvChange}
            />

            {/* Dropzone / Browse */}
            <label htmlFor="csvInput" className={styles.dropZone}>
              <div className={styles.csvIcon}><img src={image} /></div>
              <p>Drag your file(s) to start uploading</p>
              <span><img src={image1} /></span>
              <div type="button" style={{border:'1px solid black' ,borderRadius:'20px',width:'140px', marginLeft:'90px'}}>Browse files</div>
            </label>

            {/* File preview */}
            {showCsvConfirm && csvFile && (
              <div className={styles.filePreview}>
                <span><img src={csv} /></span>
                <div>
                  <strong>{csvFile.name}</strong>
                  <p>{(csvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <span onClick={() => setCsvFile(null)}>
                  <img src={action} />
                </span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className={styles.csvFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setAddType('');
                  setCsvFile(null);
                  setShowCsvConfirm(false);
                  setCsvStep(1);
                }}
              >
                Cancel
              </button>

              {csvStep === 1 && csvFile && (
                <button
                  className={styles.nextBtn}
                  onClick={() => setCsvStep(2)}
                >
                  Next
                </button>
              )}

              {csvStep === 2 && csvFile && (
                <button
                  className={styles.uploadBtn}
                  onClick={handleUpload}
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        </div>
      )}




      {showBuyModal && selectedProduct && (
        <div
          className={styles.modalOverlay}
          onClick={() => {
            setShowBuyModal(false);
            setBuyQty('');
          }}
        >
          <div
            className={styles.buyModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.simulateBtn}>
              Simulate Buy Product
            </button>
            <input
              type="number"
              placeholder="Enter quantity"
                disabled={isBuying}
              value={buyQty}
              onChange={(e) => setBuyQty(e.target.value)}
              className={styles.buyInput}
            />



              <button
                className={styles.buyBtn}
                disabled={isBuying}
                onClick={async () => {
                    try {
                          setIsBuying(true);

                          const token = localStorage.getItem("token");

                          const res = await fetch(
                            `${import.meta.env.VITE_API_URL}/api/sale/buy`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "x-auth-token": token
                              },
                              body: JSON.stringify({
                                productId: selectedProduct.productId,
                                quantity: Number(buyQty)
                              })
                            }
                          );

                          const data = await res.json();

                          if (!res.ok) {
                            // backend error
                            alert(data.msg || "Purchase failed");
                            return;
                          }

                          // success
                          alert("Purchase successful");
                          location.reload();
                          setShowBuyModal(false);
                          setBuyQty('');

                        } catch (err) {
                          alert("Network error. Please try again.");
                          console.error(err);
                        } finally {
                          setIsBuying(false);
                        }


                }}
              >
                {isBuying ? "Processing..." : "Buy"}
              </button>


              
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
