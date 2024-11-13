import React, { useState, useEffect } from 'react';
import '../styles.css'; // Ensure this import links to the CSS file

const BillTracker = () => {
  const [bills, setBills] = useState([]);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });
  const [editingIndex, setEditingIndex] = useState(null); // To track which bill is being edited

  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem('bills')) || [];
    setBills(savedBills);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddBill = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;

    // Automatically set the entry date to today's date
    const entryDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    const updatedBill = { ...newBill, entryDate };
    const updatedBills = [...bills, updatedBill];
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    setBills(updatedBills);
    setNewBill({ name: '', amount: '', dueDate: '' }); // Clear form
  };

  const handleDeleteBill = (index) => {
    const updatedBills = bills.filter((_, i) => i !== index);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    setBills(updatedBills);
  };

  const handleEditBill = (index) => {
    const billToEdit = bills[index];
    setNewBill({ name: billToEdit.name, amount: billToEdit.amount, dueDate: billToEdit.dueDate });
    setEditingIndex(index); // Set the index of the bill being edited
  };

  const handleSaveEdit = () => {
    if (!newBill.name || !newBill.amount || !newBill.dueDate) return;

    const updatedBills = [...bills];
    updatedBills[editingIndex] = { ...newBill, entryDate: updatedBills[editingIndex].entryDate }; // Update the bill at editingIndex
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    setBills(updatedBills);
    setNewBill({ name: '', amount: '', dueDate: '' }); // Clear form
    setEditingIndex(null); // Reset editing state
  };

  return (
    <div className="bill-tracker">
      <h3>Bill Tracker</h3>
      <input 
        type="text" 
        name="name" 
        placeholder="Bill Name" 
        value={newBill.name} 
        onChange={handleInputChange}
      />
      <input 
        type="number" 
        name="amount" 
        placeholder="Amount (₹)" 
        value={newBill.amount} 
        onChange={handleInputChange}
      />
      <div className="form-row">
        <label htmlFor="dueDate" className="due-date-label">Due Date</label>
        <input 
          type="date" 
          name="dueDate" 
          value={newBill.dueDate} 
          onChange={handleInputChange}
        />
        <button 
          className="add-bill-btn" 
          onClick={editingIndex !== null ? handleSaveEdit : handleAddBill}>
          {editingIndex !== null ? 'Save Changes' : 'Add Bill'}
        </button>
      </div>

      <h4>Your Bills:</h4>
      <table className="bills-table">
        <thead>
          <tr>
            <th>Bill Name</th>
            <th>Amount (₹)</th>
            <th>Entry Date</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={index}>
              <td>{bill.name}</td>
              <td>₹{bill.amount}</td>
              <td>{bill.entryDate}</td>
              <td>{bill.dueDate}</td>
              <td>
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditBill(index)}>
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteBill(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTracker;
