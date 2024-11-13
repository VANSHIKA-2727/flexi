import React, { useState, useEffect } from 'react';

const Lists = () => {
  const [activeSection, setActiveSection] = useState('shopping');
  const [shoppingList, setShoppingList] = useState([]);
  const [toDoList, setToDoList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [editIndex, setEditIndex] = useState(null); // Track index of item being edited

  // Load lists from local storage on component mount
  useEffect(() => {
    setShoppingList(JSON.parse(localStorage.getItem('shoppingList')) || []);
    setToDoList(JSON.parse(localStorage.getItem('toDoList')) || []);
    setWishlist(JSON.parse(localStorage.getItem('wishlist')) || []);
  }, []);

  // Handle input changes for new items
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({ ...prevState, [name]: value }));
  };

  // Add or update an item in the active list (shopping, todo, wishlist)
  const handleAddItem = () => {
    if (!newItem.name) return; // Prevent empty items

    let updatedList;
    if (editIndex !== null) {
      // If editing, update the item in the list
      switch (activeSection) {
        case 'shopping':
          updatedList = [...shoppingList];
          updatedList[editIndex] = newItem;
          setShoppingList(updatedList);
          localStorage.setItem('shoppingList', JSON.stringify(updatedList));
          break;
        case 'to-do':
          updatedList = [...toDoList];
          updatedList[editIndex] = newItem;
          setToDoList(updatedList);
          localStorage.setItem('toDoList', JSON.stringify(updatedList));
          break;
        case 'wishlist':
          updatedList = [...wishlist];
          updatedList[editIndex] = newItem;
          setWishlist(updatedList);
          localStorage.setItem('wishlist', JSON.stringify(updatedList));
          break;
        default:
          break;
      }
      setEditIndex(null); // Reset edit mode after saving
    } else {
      // If adding, just add a new item
      switch (activeSection) {
        case 'shopping':
          updatedList = [...shoppingList, newItem];
          setShoppingList(updatedList);
          localStorage.setItem('shoppingList', JSON.stringify(updatedList));
          break;
        case 'to-do':
          updatedList = [...toDoList, newItem];
          setToDoList(updatedList);
          localStorage.setItem('toDoList', JSON.stringify(updatedList));
          break;
        case 'wishlist':
          updatedList = [...wishlist, newItem];
          setWishlist(updatedList);
          localStorage.setItem('wishlist', JSON.stringify(updatedList));
          break;
        default:
          break;
      }
    }
    setNewItem({ name: '', quantity: '' }); // Clear input fields after adding/updating
  };

  // Delete an item from the active list
  const handleDeleteItem = (index) => {
    let updatedList;
    switch (activeSection) {
      case 'shopping':
        updatedList = shoppingList.filter((_, i) => i !== index);
        setShoppingList(updatedList);
        localStorage.setItem('shoppingList', JSON.stringify(updatedList));
        break;
      case 'to-do':
        updatedList = toDoList.filter((_, i) => i !== index);
        setToDoList(updatedList);
        localStorage.setItem('toDoList', JSON.stringify(updatedList));
        break;
      case 'wishlist':
        updatedList = wishlist.filter((_, i) => i !== index);
        setWishlist(updatedList);
        localStorage.setItem('wishlist', JSON.stringify(updatedList));
        break;
      default:
        break;
    }
  };

  // Set the form fields for editing an item
  const handleEditItem = (index) => {
    let itemToEdit;
    switch (activeSection) {
      case 'shopping':
        itemToEdit = shoppingList[index];
        break;
      case 'to-do':
        itemToEdit = toDoList[index];
        break;
      case 'wishlist':
        itemToEdit = wishlist[index];
        break;
      default:
        break;
    }
    setNewItem({ name: itemToEdit.name, quantity: itemToEdit.quantity });
    setEditIndex(index); // Track the item being edited
  };

  // Render the active list
  const renderList = (list) => (
    <>
      <div className="list-header">
        <span className="item-name">Item</span>
        <span className="item-quantity">Quantity</span>
        <span className="item-action">Actions</span>
      </div>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            <span className="item-name">{item.name}</span>
            <span className="item-quantity">{item.quantity || '-'}</span>
            <span className="item-action">
              <button onClick={() => handleEditItem(index)}>Edit</button>
              <button onClick={() => handleDeleteItem(index)}>Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="lists-container">
      <h2>My Lists</h2>
      <div className="lists-tabs">
        <button
          className={`lists-tab ${activeSection === 'shopping' ? 'active' : ''}`}
          onClick={() => setActiveSection('shopping')}
        >
          Shopping List
        </button>
        <button
          className={`lists-tab ${activeSection === 'to-do' ? 'active' : ''}`}
          onClick={() => setActiveSection('to-do')}
        >
          To-Do List
        </button>
        <button
          className={`lists-tab ${activeSection === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveSection('wishlist')}
        >
          Wishlist
        </button>
      </div>

      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={newItem.name}
        onChange={handleInputChange}
      />
      {activeSection === 'shopping' && (
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newItem.quantity}
          onChange={handleInputChange}
        />
      )}
      <div className="button-container">
        <button onClick={handleAddItem}>
          {editIndex !== null ? 'Update Item' : 'Add'}
        </button>
      </div>

      <h4>Your {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h4>
      {activeSection === 'shopping' && renderList(shoppingList)}
      {activeSection === 'to-do' && renderList(toDoList)}
      {activeSection === 'wishlist' && renderList(wishlist)}
    </div>
  );
};

export default Lists;
