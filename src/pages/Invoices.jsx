import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import styles from '../styles/Invoices.module.css';
import images from'../assets/icon.png';
import cancelImage from'../assets/material-symbols_close.png';
import downloadImage from'../assets/material-symbols_download-rounded.png';
import printImage from'../assets/print.png';
import bill from'../assets/bill paid.png';
import view from '../assets/view.png';
import delet from '../assets/delete.png';

const Invoices = () => {
  const token = localStorage.getItem('token');

  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteInvoice, setDeleteInvoice] = useState(null);

  const itemsPerPage = 10;

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoice`, {
          headers: { 'x-auth-token': token },
        });
        const data = await res.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error('Failed to fetch invoices', err);
      }
    };
    fetchInvoices();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, '-');
  };



  // Stats
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = invoices.filter(inv => new Date(inv.date || inv.createdAt) >= last7Days).length;
  const totalCount = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'paid');
  const unpaidInvoices = invoices.filter(inv => inv.status?.toLowerCase() === 'unpaid');
  const paidAmount = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const paidCount = paidInvoices.length;
  const unpaidCount = unpaidInvoices.length;

  const filtered = invoices.filter(
    inv =>
      inv.invoiceId?.toLowerCase().includes(search.toLowerCase()) ||
      inv._id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDelete = async () => {
    if (!deleteInvoice) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/invoice/${deleteInvoice._id}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token ,"Content-Type": "application/json"},
      });
      setInvoices(prev => prev.filter(inv => inv._id !== deleteInvoice._id));
    } catch (err) {
      console.error('Delete failed', err);
    }
    setShowConfirm(false);
    setDeleteInvoice(null);
  };

  const markInvoicePaid = async (invoice) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoice/${invoice._id}/status`, {
      method: 'PUT',
       headers: { 'x-auth-token': token ,"Content-Type": "application/json" },
      body: JSON.stringify({ status: 'paid' })
    });

    if (!res.ok) throw new Error('Failed to update');

    setInvoices(prev =>
      prev.map(inv =>
        inv._id === invoice._id
          ? { ...inv, status: 'paid' }
          : inv
      )
    );
  } catch (err) {
    console.error(err);
    alert('Failed to mark invoice as paid');
  }
};

const markInvoiceUnpaid = async (invoice) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoice/${invoice._id}/status`, {
      method: 'PUT',
       headers: { 'x-auth-token': token ,"Content-Type": "application/json"},
      body: JSON.stringify({ status: 'unpaid' })
    });

    if (!res.ok) throw new Error('Failed to update');

    setInvoices(prev =>
      prev.map(inv =>
        inv._id === invoice._id
          ? { ...inv, status: 'unpaid' }
          : inv
      )
    );
  } catch (err) {
    console.error(err);
    alert('Failed to mark invoice as unpaid');
  }
};


const openInvoice = async (inv) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/invoice/${inv._id}/details`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!res.ok) throw new Error("Failed");

    const data = await res.json();
    setViewInvoice(data);
  } catch (err) {
    console.error(err);
    alert("Failed to load invoice");
  }
};
const handlePrint = () => {
  const invoice = document.querySelector(`.${styles.invoice}`);
  if (!invoice) return;

  const css = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join("");
      } catch {
        return "";
      }
    })
    .join("");

  const win = window.open("", "", "width=900,height=650");

  win.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          ${css}
          @media print {
            body { margin: 0; }
            .${styles.icon} { display: none; }
          }
        </style>
      </head>
      <body>
        ${invoice.outerHTML}
      </body>
    </html>
  `);

  win.document.close();
  win.focus();
  win.print();
};
const handleDownload = () => {
  handlePrint();
 
};

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Invoices</h1>
          <input
            className={styles.search}
            placeholder="Search here..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div> 

        <div className={styles.card}>
          <h3 className={styles.listTitle}>Overall Invoice</h3>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h5 className={styles.statLabel}>Recent Transactions</h5>
             
             
              <div className={styles.row}>

                <div style={{fontWeight:"bolder"}} className={styles.statValue}>{recentCount}</div>
              </div>
              <div className={styles.row}>

                <p className={styles.statSub}>Last 7 days</p>
              </div>

            </div>
            <div className={styles.statItem}>
              <h5 className={styles.statLabel}>Total Invoices</h5>
              <div className={styles.row}>
                <div style={{fontWeight:"bolder"}} className={styles.statValue}>{totalCount}</div>
                <div style={{fontWeight:"bolder"}} className={styles.statValue}>{paidCount}</div>

              </div>
              <div className={styles.row}>
                <p className={styles.statSub}>Total Till Date</p>
                <p className={styles.statSub}>Processed</p>
              </div>
            </div>
            <div className={styles.statItem}>
              <h5 className={styles.statLabel}>paid Amount</h5>
              <div className={styles.row}>
                <div style={{fontWeight:"bolder"}} className={styles.statValue}>₹{paidAmount.toLocaleString('en-IN')}</div>
                <div style={{fontWeight:"bolder"}} className={styles.statValue}>{paidCount}</div>
              </div>
              <div className={styles.row}>
                <p className={styles.statSub}>Processed</p>

                <p className={styles.statSub}>Customers</p>
              </div>
            </div>

            <div className={styles.statItem}>
              <h5 className={styles.statLabel}>Unpaid Amount</h5>
              <div className={styles.row}>
                  <div style={{fontWeight:"bolder"}} className={styles.statValue}>₹{unpaidAmount.toLocaleString('en-IN')}</div>
                  <div style={{fontWeight:"bolder"}} className={styles.statValue}>{unpaidCount}</div>
              </div>
              <div className={styles.row}>
                  <p className={styles.statSub}>Total pending</p>
                  <p className={styles.statSub}>Customers</p>
              </div>
            </div>
          </div>
        </div>




        <div className={styles.card}>
          <h3 className={styles.listTitle}>Invoices List</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Reference Number</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                <th>Due Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(inv => (
                <tr key={inv._id} className={menuOpen === inv._id ? styles.highlighted : ''}>
                  <td>{inv.invoiceId}</td>
                  <td>{inv._id}</td>
                  <td>₹{Number(inv.amount || 0).toLocaleString('en-IN')}</td>
                  <td>
                    <span className={inv.status?.toLowerCase() === 'paid' ? styles.paid : styles.unpaid}>
                      {inv.status ? inv.status.charAt(0).toUpperCase() + inv.status.slice(1) : '-'}
                    </span>
                  </td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td className={styles.menuCell}>
                    <button
                      className={styles.dots}
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === inv._id ? null : inv._id); }}
                    >
                      ⋮
                    </button>
                   {menuOpen === inv._id && (
                      <div
                        className={styles.menu}
                        onClick={e => e.stopPropagation()}
                      >
                        {inv.status?.toLowerCase() === 'paid' && (
                          <>
                            <button
                              onClick={() => {
                                openInvoice(inv);
                                setMenuOpen(null);
                              }}
                            >
                            <img src={view}></img> View Invoice
                            </button>

                            <button
                              className={styles.delete}
                              onClick={() => {
                                setDeleteInvoice(inv);
                                setShowConfirm(true);
                                setMenuOpen(null);
                              }}
                            >
                              <img src={delet}></img>Delete
                            </button>
                          </>
                        )}

                        {inv.status?.toLowerCase() === 'unpaid' && (
                          <>
                            <div style={{textAlign:'center',backgroundColor:'green'}}
                              className={styles.paid}
                              onClick={() => {
                                markInvoicePaid(inv);
                                setMenuOpen(null);
                              }}
                            >
                              <img src={bill} style={{backgroundColor:'#0BF4C8'}}></img>Paid
                            </div>

                            <div style={{textAlign:'center',backgroundColor:'red'}}
                              className={styles.unpaid}
                              onClick={() => {
                                markInvoiceUnpaid(inv);
                                setMenuOpen(null);
                              }}
                            >
                             <img src={bill}style={{backgroundColor:'#0BF4C8'}}></img> Unpaid
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
            <span>Page {page} of {totalPages || 1}</span>
            <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </main>

     {viewInvoice && (
  <div className={styles.overlay} onClick={() => setViewInvoice(null)}>
    <div className={styles.invoice} onClick={e => e.stopPropagation()}>

    
        

        
      <header className={styles.invoiceHeader}>
        <h2>INVOICE<br /></h2><br />
        <div className={styles.head}>
          <div>
            <h4>Billed To</h4>
            <p>{viewInvoice.customerName || 'Company Name'}</p>
            <p>{viewInvoice.customerAddress || 'Company Address'}</p>
            <p>{viewInvoice.customerCity || 'City, Country - 000000'}</p>
          </div>

          <div className={styles.meta}>
            <p>{viewInvoice.businessAddress || 'Business Address'}</p>
            <p>{viewInvoice.businessCity || 'City, State, IN - 000 000'}</p>
            <p>{viewInvoice.taxId || 'TAX ID 00XXXXXXXXXX'}</p>
          </div>
        </div>
      </header>

      <main className={styles.invoiceMain}>

        <div className={styles.invoiceLeft}>
          <p><strong>Invoice #</strong> {viewInvoice.invoiceId}</p>
          <p><strong>Invoice Date</strong> {formatDate(viewInvoice.createdAt)}</p>
          <p><strong>Reference</strong> {viewInvoice.referenceNumber}</p>
          <p><strong>Due Date</strong> {formatDate(viewInvoice.dueDate)}</p>
        </div>

        <div className={styles.invoiceRight}>
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {(viewInvoice.items && viewInvoice.items.length > 0) ? (
                viewInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{Number(item.price).toLocaleString('en-IN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '12px' }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              {(() => {
                const items = viewInvoice.items || [];
                const subtotal = items.reduce((sum, item) => sum + (item.price), 0);
                const tax = subtotal * 0.1;
                const total = subtotal + tax;

                return (
                  <>
                    <tr>
                      <td colSpan="2">Subtotal</td>
                      <td>₹{subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Tax (10%)</td>
                      <td>₹{tax.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr className={styles.totalRow}>
                      <td colSpan="2">Total Due</td>
                      <td>₹{total.toLocaleString('en-IN')}</td>
                    </tr>
                  </>
                );
              })()}
            </tfoot>
          </table>
          <p><img src={images}  style={{ width: "10px" }}
></img>
please pay within 7 days of receving this invoice</p>
        </div>
      </main>

      <footer className={styles.invoiceFooter}>
        <span>{viewInvoice.website || 'www.website.com'}</span>
        <span>{viewInvoice.phone || '+91 90000 00000'}</span>
        <span>{viewInvoice.email || 'hello@email.com'}</span>
      </footer>

    </div>
    
    <div className={styles.icon}>
         <img  src={cancelImage} className={styles.image+" "+styles.cancel}></img>
         <img onClick={handleDownload} src={downloadImage} className={styles.download}></img>
          <img  onClick={handlePrint} src={printImage} className={styles.images+" "+styles.print}></img>
     </div>
  </div>
)}

      {showConfirm && (
        <div className={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
            <p>this invoice will be deleted.</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setShowConfirm(false)}>Cancel</button>
              <button onClick={handleDelete}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
