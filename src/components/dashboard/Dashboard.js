import { useState, useEffect } from "react";
import { ref, push, onValue, off, update, get, remove } from "firebase/database";
import { useAuth } from "../authcontext/authContext";
import { database } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import UserProfile from "../user_data_components/user_profile";
import ProductDetails from "../user_data_components/products_page";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const { logout, currentUser } = useAuth();
  
  const navigate = useNavigate();

  // render-name
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
  // render-name

  document.title = "Dashboard : " + currentUser.email;
  useEffect(() => {
    const articlesRef = ref(database, "articles/");
    const unsubscribe = onValue(articlesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setArticles(
          Object.entries(data).map(([id, values]) => ({ id, ...values }))
        );
      } else {
        setArticles([]);
      }
    });
    return () => off(articlesRef);
  }, []);

  const handleCreateOrUpdateArticle = async () => {
    if (!currentUser) {
      alert("You must be logged in to post an article.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      alert("Title and Content cannot be empty!");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await update(ref(database, `articles/${editId}`), {
          title,
          content,
          updatedAt: new Date().toISOString(),
        });
        alert("✅ Article updated successfully!");
        setEditId(null);
      } else {
        await push(ref(database, "articles/"), {
          title,
          content,
          authorId: currentUser?.uid,
          authorEmail: currentUser?.email,
          createdAt: new Date().toISOString(),
        });
        alert("✅ Article posted successfully!");
      }
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("❌ Error saving article:", error);
      alert("Failed to save article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditId(article.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        await remove(ref(database, `articles/${id}`));
        alert("🗑️ Article deleted successfully!");
      } catch (error) {
        console.error("❌ Error deleting article:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout failed:", error.message);
    }
  };

  const userDashboard = (<>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-0 sm:p-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-none p-4 sm:p-4">
        {/*<div className="flex flex-col sm:flex-row justify-end items-center mb-4 gap-2">*/}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-4 gap-2">
          <div style={{fontStyle:"italic"}}>{currentUser?.email}</div>
          <button
            onClick={handleLogout} style={{ fontSize: 12 }}
            className="px-3 py-1 bg-[#17A9FD] text-white rounded-lg hover:bg-[#0165E1] transition"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-row gap-2 mb-2">
          <div>{profile.name ? `${profile.name} ${profile.lastname}` : "Username"}</div>
          <button
            onClick={()=>{navigate('/profile')}} style={{ fontSize: 12 }}
            className="px-2 py-0.5 bg-[#17A9FD] text-white rounded-full hover:bg-[#0165E1] transition"
          >
            Profile
          </button>
        </div>

        <div className="flex flex-row gap-2 text-left" style={{fontSize: 10}}>
          <div>{profile.name ? `${profile.phone}` : "Username"}</div>
          <div>{profile.name ? `${profile.address}` : "Username"}</div>
        </div>

        <h3 className="text-xl font-semibold mb-2">{editId ? "Edit" : "Create"} Article</h3>
        <div className="space-y-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded-none dark:bg-gray-700 dark:border-gray-600" required />
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" className="w-full p-2 border rounded-none dark:bg-gray-700 dark:border-gray-600 resize-none" rows="6" required />
          <button onClick={handleCreateOrUpdateArticle} className="w-full px-4 py-2 bg-blue-500 text-white rounded-none hover:bg-blue-600 transition disabled:opacity-50" disabled={loading}>{loading ? "Saving..." : editId ? "Update Article" : "Post Article"}</button>
        </div>

        <h3 className="text-xl font-semibold mt-6">Posted Articles</h3>
        <div className="mt-4 space-y-4">
          {articles.length > 0 ? (
            articles
              .filter((article) => article.authorId === currentUser.uid) // Only show articles that match currentUser.uid
              .map((article) => (
                <div key={article.id} className="p-4 border rounded-none bg-gray-50 dark:bg-gray-700">
                  <h4 className="text-lg font-semibold">{article.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">By: {article.authorEmail}</p>
                  <p className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleString()}</p>
                  <p className="mt-2">{article.content}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(article)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-none hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-none hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-gray-500">No articles posted yet.</p>
          )}

        </div>
      </div>
    </div>
  </>);
  return (<>
  <ProductDetails />
    {userDashboard}
  </>);
};

export default Dashboard;
