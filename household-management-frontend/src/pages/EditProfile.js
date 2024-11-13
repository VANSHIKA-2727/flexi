import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditProfile({ userId }) {
  const [newUsername, setUsername] = useState('');
  const [userIds, oldUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [Password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // Handle username change
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    console.log(userIds);
    console.log("****");
    console.log(newUsername);

    try {
      const response = await axios.post('http://localhost:8080/edit-username', {
        userIds,
        newUsername,
      });

      if (response.status === 200) {
        alert('user updated successfully.');
        setTimeout(() => {
          navigate('/'); // Redirect to login or home after password update
        }, 2000);
      } else {
        alert(response.data.message || 'Error updating password.');
      }
    } catch (error) {
      alert('Error updating password: ' + error.response?.data?.message || error.message);
    }
  };

  // Handle password change
  const handlePasswordChange = async(e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/edit-password', {
        newUsername,
        currentPassword,
        newPassword,
        confirmPassword,
      });
      alert(response.data.message);
    } catch (error) {
      alert('Error updating password: ' + error.response?.data?.message || error.message);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/delete-account', {
        newUsername,
        Password,
      });

      if (response.status === 200) {
        alert('Account deleted successfully.');
        setTimeout(() => {
          navigate('/'); // Redirect to home or login page after account deletion
        }, 2000);
      } else {
        alert(response.data.message || 'Error deleting account.');
      }
    } catch (error) {
      alert('Error deleting account: ' + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>

      {/* Change Username Section */}
      <div className="edit-profile-section">
        <h3>Change Username</h3>
        <input
          type="text"
          placeholder="old Username"
          name = "userId"
          onChange={(e) => oldUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Username"
          name = "newUsername"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleUsernameChange}>Save Username</button>
      </div>

      {/* Change Password Section */}
      <div className="edit-profile-section">
        <h3>Change Password</h3>
        <input
          type="username"
          placeholder="enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handlePasswordChange}>Save Password</button>
      </div>

      {/* Delete Account Section */}
      <div className="edit-profile-section">
        <h3>Delete Account</h3>
        <input
          type="username"
          placeholder="enter username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleDeleteAccount} className="delete-account-button">Delete Account</button>
      </div>
    </div>
  );
}

export default EditProfile;
