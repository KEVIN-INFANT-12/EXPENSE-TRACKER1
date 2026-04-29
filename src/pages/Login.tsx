import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      // ❌ if login fails
      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ success
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };
return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-6 rounded shadow w-80">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-2 p-2 border rounded"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="mt-3 text-sm text-center">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500">
          Register
        </a>
      </p>
    </div>
  </div>
);
}