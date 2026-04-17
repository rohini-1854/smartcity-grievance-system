// import React, { useState } from 'react';
// import './AuthForm.css';
// import { useNavigate } from 'react-router-dom';

// const AuthForm = () => {
//   const [isRightPanelActive, setIsRightPanelActive] = useState(false);
//   const [role, setRole] = useState('user');
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleAdminLogin = (e) => {
//     e.preventDefault();
//     const { email, password } = formData;
//     if (email === 'admin@collegeproject.com' && password === 'Secure@123') {
//       navigate('/admin');
//     } else {
//       alert('❌ Invalid admin credentials');
//     }
//   };

//   // const handleSignup = async (e) => {
//   //   e.preventDefault();
//   //   try {
//   //     const endpoint =
//   //       role === 'worker' 
//   //       ? 'http://localhost:5000/api/worker/signup' 
//   //       : 'http://localhost:5000/signup';
//   //     const res = await fetch(endpoint, {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify(formData),
//   //     });

//   //     if (res.ok) {
//   //       alert('✅ Signup successful!');
//   //       setIsRightPanelActive(false);
//   //       setFormData({ name: '', email: '', password: '' });
//   //     } else {
//   //       const errorData = await res.json();
//   //       alert(errorData.message || 'Signup failed');
//   //     }
//   //   } catch (err) {
//   //     console.error('Signup failed:', err);
//   //   }
//   // };
//   const handleSignup = async (e) => {
//   e.preventDefault();
//   try {
//     // ✅ Only user signup (worker signup removed)
//     const res = await fetch('http://localhost:5000/signup', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     });

//     if (res.ok) {
//       alert('✅ Signup successful!');
//       setIsRightPanelActive(false);
//       setFormData({ name: '', email: '', password: '' });
//     } else {
//       const errorData = await res.json();
//       alert(errorData.message || 'Signup failed');
//     }
//   } catch (err) {
//     console.error('Signup failed:', err);
//   }
// };

// const handleSignin = async (e) => {
//   e.preventDefault();
//   try {
//     const endpoint =
//       role === 'worker' 
//       ? 'http://localhost:5000/api/worker/login' 
//       : 'http://localhost:5000/login';
//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         email: formData.email,
//         password: formData.password,
//       }),
//     });
//     const data = await res.json();

//     if (res.ok && data.success) {
//       if (role === 'worker') {
//         localStorage.setItem('worker', JSON.stringify(data.worker)); // full worker object
//         navigate('/servicepage');
//       } else if (role === 'user') {
//         localStorage.setItem('userEmail', data.user.email); // full user object
//         navigate('/home'); // go to user history page
//       }
//     } else {
  
//       alert(data.message || 'Login failed');
//     }
//   } catch (err) {
//     console.error('Login failed:', err);
//   }
// };


//   return (
//     <div className="auth-wrapper">
//       <div className="top-toggle">
//         <div className="toggle-selector" onClick={() => setShowDropdown(!showDropdown)}>
//           {role.charAt(0).toUpperCase() + role.slice(1)} ⬇️
//         </div>
//         {showDropdown && (
//           <div className="dropdown-menu">
//             <div onClick={() => { setRole('admin'); setShowDropdown(false); }}>Admin</div>
//             <div onClick={() => { setRole('user'); setShowDropdown(false); }}>User</div>
//             <div onClick={() => { setRole('worker'); setShowDropdown(false); }}>Worker</div>
//           </div>
//         )}
//       </div>

//       {role === 'admin' ? (
//         <div className="form-container admin-container">
//           <div className="admin-left">
//             <form onSubmit={handleAdminLogin} className="admin-form">
//               <h1>Admin Login</h1>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Admin Email"
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Login</button>
//             </form>
//           </div>
//           <div className="admin-right">
//             <img src="/admin.webp" alt="Admin Visual" />
//             <h2>Welcome, Admin</h2>
//             <p>Manage users and settings securely</p>
//           </div>
//         </div>
//       ) : (
//         <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>

//           {/* User can signup */}
//           {role === 'user' && (
//             <div className="form-container sign-up-container">
//               <form onSubmit={handleSignup}>
//                 <h1>Create User Account</h1>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//                 <input
//                   type="password"
//                   name="password"
//                   placeholder="Password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//                 <button type="submit">Sign Up</button>
//               </form>
//             </div>
//           )}

//           {/* Everyone (User, Worker, Admin) can sign in */}
//           <div className={`form-container sign-in-container ${role === 'worker' ? 'worker-signin' : ''}`}>
//             <form onSubmit={role === 'admin' ? handleAdminLogin : handleSignin}>
//               <h1>Sign in as {role}</h1>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Sign In</button>
//             </form>
//           </div>

//           {/* Overlay only for user */}
//           {role === 'user' && (
//             <div className="overlay-container">
//               <div className="overlay">
//                 <div className="overlay-panel overlay-left">
//                   <h1>Welcome Back!</h1>
//                   <p>To keep connected, please login</p>
//                   <button className="ghost" onClick={() => setIsRightPanelActive(false)}>
//                     Sign In
//                   </button>
//                 </div>
//                 <div className="overlay-panel overlay-right">
//                   <h1>Hello, Friend!</h1>
//                   <p>Enter your details and start your journey</p>
//                   <button className="ghost" onClick={() => setIsRightPanelActive(true)}>
//                     Sign Up
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>   {/* ✅ closes the : (...) container */}
//       )}       {/* ✅ closes the ternary */}
//     </div>       {/* ✅ closes auth-wrapper */}
//   );
// };

// export default AuthForm;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./AuthForm.css";

// const AuthForm = () => {
//   const [role, setRole] = useState("user"); // default role
//   const [isRightPanelActive, setIsRightPanelActive] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const navigate = useNavigate();

//   // handle input change
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // ✅ User Signup only
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch("http://localhost:5000/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert("✅ Signup successful!");
//         localStorage.setItem("userEmail", data.user.email);
//         navigate("/home"); // go to user homepage
//       } else {
//         alert(data.message || "Signup failed");
//       }
//     } catch (err) {
//       console.error("Signup failed:", err);
//       alert("Signup failed. Try again!");
//     }
//   };

//   // ✅ All roles Signin
//   const handleSignin = async (e) => {
//     e.preventDefault();

//     // Admin fixed credentials
//     if (role === "admin") {
//       if (formData.email === "admin@collegeproject.com" && formData.password === "Secure@123") {
//         alert("✅ Admin Login Success");
//         navigate("/admin");
//       } else {
//         alert("❌ Invalid Admin Credentials");
//       }
//       return;
//     }

//     try {
//       const endpoint =
//         role === "worker"
//           ? "http://localhost:5000/api/worker/login"
//           : "http://localhost:5000/login";

//       const res = await fetch(endpoint, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         if (role === "worker") {
//           localStorage.setItem("worker", JSON.stringify(data.worker));
//           navigate("/servicepage");
//         } else if (role === "user") {
//           localStorage.setItem("userEmail", data.user.email);
//           navigate("/home");
//         }
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (err) {
//       console.error("Login failed:", err);
//       alert("Login failed. Try again!");
//     }
//   };

//   return (
//     <div className="auth-wrapper">
//       {/* Role Switch */}
//       <div className="role-switch">
//         <button
//           className={role === "user" ? "active" : ""}
//           onClick={() => {
//             setRole("user");
//             setIsRightPanelActive(false);
//           }}
//         >
//           User
//         </button>
//         <button
//           className={role === "worker" ? "active" : ""}
//           onClick={() => {
//             setRole("worker");
//             setIsRightPanelActive(false);
//           }}
//         >
//           Worker
//         </button>
//         <button
//           className={role === "admin" ? "active" : ""}
//           onClick={() => {
//             setRole("admin");
//             setIsRightPanelActive(false);
//           }}
//         >
//           Admin
//         </button>
//       </div>

//       {/* Conditional Rendering */}
//       {role === "admin" ? (
//         // Admin Login
//         <div className="admin-container">
//           {/* Left Side - Admin Login Form */}
//           <div className="admin-left">
//             <form className="admin-form" onSubmit={handleSignin}>
//               <h1>Admin Login</h1>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Login</button>
//             </form>
//           </div>

//           {/* Right Side - Image + Welcome Msg */}
//           <div className="admin-right">
//             <img src="admin.webp" alt="Admin"  style={{width: '480px', height: '230px'}}  />
//             <h2>Welcome Back, Admin!</h2>
//             <p>Login to manage users, complaints and workers effectively.</p>
//           </div>
//         </div>
//       ) : role === "worker" ? (
//         // Worker Login
//         <div className="worker-container">
//           <div className="worker-left">
//             <form className="worker-form" onSubmit={handleSignin}>
//               <h1>Worker Login</h1>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Sign In</button>
//             </form>
//           </div>
//           <div className="worker-right">
//             <img src="worker.jpg" alt="Worker" />
//             <h2>Welcome Back, Worker!</h2>
//             <p>Login to manage and complete your assigned tasks.</p>
//           </div>
//         </div>
//       ) : (
//         // User Signup + Login
//         <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
//           {/* Sign Up */}
//           <div className="form-container sign-up-container">
//             <form onSubmit={handleSignup}>
//               <h1>Create User Account</h1>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Sign Up</button>
//             </form>
//           </div>

//           {/* Sign In */}
//           <div className="form-container sign-in-container">
//             <form onSubmit={handleSignin}>
//               <h1>User Login</h1>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//               <button type="submit">Sign In</button>
//             </form>
//           </div>

//           {/* Overlay */}
//           <div className="overlay-container">
//             <div className="overlay">
//               <div className="overlay-panel overlay-left">
//                 <h1>Welcome Back!</h1>
//                 <p>To keep connected, please login</p>
//                 <button className="ghost" onClick={() => setIsRightPanelActive(false)}>
//                   Sign In
//                 </button>
//               </div>
//               <div className="overlay-panel overlay-right">
//                 <h1>Hello, Friend!</h1>
//                 <p>Enter your details and start your journey</p>
//                 <button className="ghost" onClick={() => setIsRightPanelActive(true)}>
//                   Sign Up
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthForm;



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "./api_config";
import "./AuthForm.css";

// /* ------------------- Reusable Components ------------------- */
// const BackButton = ({ onClick }) => (
//   <button className="back-btn" onClick={onClick}>
//     Back
//   </button>
// );

const InputField = ({ type, name, value, onChange, placeholder, required = true }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
  />
);

/* ------------------- Main AuthForm ------------------- */
const AuthForm = () => {
  const [role, setRole] = useState("user"); // default role
  const [showRoleTabs, setShowRoleTabs] = useState(true);
  const [isRightPanelActive, setIsRightPanelActive] = useState(true); // 👈 show signup by default
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectPath = params.get("redirect") || "/home"; // default fallback

  /* Detect query params & switch role */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    const roleParam = params.get("role");

    if (mode === "user") {
      setRole("user");
      // setShowRoleTabs(false);
      setIsRightPanelActive(true);
    } else if (roleParam) {
      setRole(roleParam);
      // setShowRoleTabs(false);
      setIsRightPanelActive(false);
    } else {
      setShowRoleTabs(true);
    }
  }, [location]);

  /* Update panel when role changes */
  useEffect(() => {
    setIsRightPanelActive(role === "user");
  }, [role]);

  /* Handle input change */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      alert("Please fill all fields including phone!");
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Signup successful:", data);
        alert("✅ Signup successful!");

        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userPhone", data.user.phone);

        navigate("/home"); // or redirectPath
      } else {
        console.error("Signup failed:", data);
        alert("Signup failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Signup failed: " + err.message);
    }
  };



  /* ---------------- Signin (All Roles) ---------------- */
  const handleSignin = async (e) => {
    e.preventDefault();

    if (role === "admin") {
      if (formData.email === "admin@collegeproject.com" && formData.password === "Secure@123") {
        alert("✅ Admin Login Success");
        window.open(`${window.location.origin}/admin`, "_blank");
      } else {
        alert("❌ Invalid Admin Credentials");
      }
      return;
    }

    try {
      const endpoint =
        role === "worker"
          ? API_ENDPOINTS.WORKERS.LOGIN
          : API_ENDPOINTS.AUTH.SIGNIN;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (role === "worker") {
          localStorage.setItem("worker", JSON.stringify(data.worker));
          window.open(`${window.location.origin}/servicepage`, "_blank");
        } else if (role === "user") {
          localStorage.setItem("userEmail", data.user.email);
          navigate(redirectPath);
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Try again!");
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Role Switch Tabs */}
      {showRoleTabs && (
        <div className="role-switch">
          <button onClick={() => setRole("user")} className={role === "user" ? "active" : ""}>User</button>
          <button onClick={() => setRole("worker")} className={role === "worker" ? "active" : ""}>Worker</button>
          <button onClick={() => setRole("admin")} className={role === "admin" ? "active" : ""}>Admin</button>
        </div>
      )}

      {/* ---------------- Admin Login ---------------- */}
      {role === "admin" ? (
        <div className="admin-container">
          {/* <BackButton onClick={() => navigate("/home")} /> */}
          <div className="admin-left">
            <form onSubmit={handleSignin}>
              <h1>Admin Login</h1>
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <button type="submit">Login</button>
            </form>
          </div>
          <div className="admin-right">
            <img src="admin.webp" alt="Admin" />
            <h2>Welcome Back, Admin!</h2>
            <p>Login to manage users, complaints and workers effectively.</p>
          </div>
        </div>
      ) : role === "worker" ? (
        /* ---------------- Worker Login ---------------- */
        <div className="worker-container">
          {/* <BackButton onClick={() => navigate("/home")} /> */}
          <div className="worker-left">
            <form onSubmit={handleSignin}>
              <h1>Worker Login</h1>
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <button type="submit">Sign In</button>
            </form>
          </div>
          <div className="worker-right">
            <img src="worker.jpg" alt="Worker" />
            <h2>Welcome Back, Worker!</h2>
            <p>Login to manage and complete your assigned tasks.</p>
          </div>
        </div>
      ) : (
        /* ---------------- User Login & Signup ---------------- */
        <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
          {/* <BackButton onClick={() => navigate("/home")} /> */}

          {/* Sign Up */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleSignup}>
              <h1>Create User Account</h1>
              <InputField type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <InputField type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
              <button type="submit">Sign Up</button>
            </form>
          </div>

          {/* Sign In */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleSignin}>
              <h1>User Login</h1>
              <InputField type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <InputField type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
              <button type="submit">Sign In</button>
            </form>
          </div>

          {/* Overlay */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <button className="ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
