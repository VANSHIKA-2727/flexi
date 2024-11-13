import React, { useState, useEffect } from 'react';

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [newSubscription, setNewSubscription] = useState({ name: '', cost: '', dueDate: '' });
  const [editingIndex, setEditingIndex] = useState(null); // Track the index being edited

  useEffect(() => {
    const savedSubscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
    setSubscriptions(savedSubscriptions);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubscription(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddOrUpdateSubscription = () => {
    if (!newSubscription.name || !newSubscription.cost || !newSubscription.dueDate) return;

    const addedDate = new Date().toLocaleDateString(); // Current date for "added on"
    
    if (editingIndex !== null) {
      // Update the existing subscription at editingIndex
      const updatedSubscriptions = subscriptions.map((sub, index) =>
        index === editingIndex ? { ...newSubscription, addedDate } : sub
      );
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
      setEditingIndex(null); // Reset editing mode
    } else {
      // Add new subscription
      const newSub = { ...newSubscription, addedDate };
      const updatedSubscriptions = [...subscriptions, newSub];
      setSubscriptions(updatedSubscriptions);
      localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
    }

    setNewSubscription({ name: '', cost: '', dueDate: '' }); // Clear the form
  };

  const handleEditSubscription = (index) => {
    setNewSubscription(subscriptions[index]);
    setEditingIndex(index); // Set the editing index to the row being edited
  };

  const handleDeleteSubscription = (index) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
    localStorage.setItem('subscriptions', JSON.stringify(updatedSubscriptions));
  };

  return (
    <div className="subscription-manager">
      <h3>Subscription Manager</h3>
      <input 
        type="text" 
        name="name" 
        placeholder="Subscription Name" 
        value={newSubscription.name} 
        onChange={handleInputChange}
      />
      <input 
        type="number" 
        name="cost" 
        placeholder="Monthly Cost (₹)" 
        value={newSubscription.cost} 
        onChange={handleInputChange}
      />
      <input 
        type="date" 
        name="dueDate" 
        value={newSubscription.dueDate} 
        onChange={handleInputChange}
      />
      <button onClick={handleAddOrUpdateSubscription}>
        {editingIndex !== null ? 'Update Subscription' : 'Add Subscription'}
      </button>

      <h4>Your Subscriptions:</h4>
      <table className="subscription-table">
        <thead>
          <tr>
            <th>Subscription Name</th>
            <th>Cost (₹)</th>
            <th>Added On</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub, index) => (
            <tr key={index}>
              <td>{sub.name}</td>
              <td>₹{sub.cost}</td>
              <td>{sub.addedDate}</td>
              <td>{sub.dueDate}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditSubscription(index)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDeleteSubscription(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionManager;
