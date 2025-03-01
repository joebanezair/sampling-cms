import React, { useState, useEffect } from "react";
import { ref, set, get, remove } from "firebase/database";
import { database } from "../firebase/firebase"; // Firebase import
import { useAuth } from "../authcontext/authContext"; // Auth context
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { currentUser } = useAuth(); // Get authenticated user
  const navigateTo = useNavigate();
  const defaultProfile = {
    uid: currentUser?.uid || "",
    name: "",
    middlename: "",
    lastname: "",
    age: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    baranggay: "",
    postalCode: "",
    employeeCode: "",
  };

  const [profile, setProfile] = useState(defaultProfile);

  // Fetch user data from Firebase on component mount
  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setProfile(snapshot.val());
      } else {
        setProfile((prev) => ({ ...prev, uid: currentUser.uid }));
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile.uid) {
      alert("User not authenticated! ❌");
      return;
    }

    try {
      await set(ref(database, `users/${profile.uid}`), profile);
      alert("Profile Updated! ✅");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (!profile.uid) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? 🚨"
    );
    if (!confirmDelete) return;

    try {
      await remove(ref(database, `users/${profile.uid}`));
      setProfile(defaultProfile);
      alert("Profile Deleted! 🗑️");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const inputFields = [
    { name: "name", placeholder: "First Name", type: "text" },
    { name: "middlename", placeholder: "Middle Name", type: "text" },
    { name: "lastname", placeholder: "Last Name", type: "text" },
    { name: "age", placeholder: "Age", type: "number" },
    { name: "phone", placeholder: "Phone Number", type: "tel" },
    { name: "dob", placeholder: "Date of Birth", type: "date" },
    { name: "city", placeholder: "City", type: "text" },
    { name: "baranggay", placeholder: "Barangay", type: "text" },
    { name: "postalCode", placeholder: "Postal Code", type: "text" },
    { name: "address", placeholder: "Address", type: "text" },
    { name: "employeeCode", placeholder: "Employee Code", type: "text" },
  ];

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <div className="font-semibold text-gray-700 text-left mb-4">
        <div>
         {profile.name ? `${profile.name} ${profile.lastname}` : "Username"}
        </div>
        <div style={{fontSize: 12}}>
         User ID :  {profile.uid ? `${profile.uid}` : "Username"}
        </div>
        <div>
         <button onClick={()=>{navigateTo('/dashboard')}}>Dashboard</button>
        </div>
      </div>
      <form onSubmit={handleSave} className="space-y-4">
        {/* UID Field (Disabled) */}

        
        {/* Name Fields in 3-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {inputFields.slice(0, 3).map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={profile[name]}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ))}
        </div>

        {/* Second Row Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {inputFields.slice(3, 6).map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={profile[name]}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ))}
        </div>

        {/* Third Row Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {inputFields.slice(6, 9).map(({ name, placeholder, type }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={profile[name]}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          ))}
        </div>

        {/* Remaining Fields in Full Width Layout */}
        {inputFields.slice(9).map(({ name, placeholder, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={profile[name]}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        ))}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary w-full">
            Save Profile
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-danger w-full"
          >
            Delete Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
