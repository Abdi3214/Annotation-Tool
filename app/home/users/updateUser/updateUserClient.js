"use client";
import { useEffect, useState } from "react";

export default function UpdateUserClient({
  id,
  initialName,
  initialEmail,
  initialPassword,
  initialType,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    // initialize only when props change
    setName(initialName);
    setEmail(initialEmail);
    setPassword(initialPassword);
    setType(initialType);
  }, [initialName, initialEmail, initialPassword, initialType]);n

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, password, userType: type };

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/UpdateUsers/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 409) {
          alert("This user already exists. Please try a different one.");
        } else {
          console.error(`Save failed: ${res.status} – ${text}`);
          alert("Failed to save user.");
        }
        return;
      }

      await res.json();
      router.push('/home/users');
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <form
        className="flex flex-col space-y-3 border border-gray-200 shadow rounded p-4"
        onSubmit={handleSubmit}
      >
        <label>Name:</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
        />

        <label>Type:</label>
        <input
          type="text"
          value={type}
          required
          onChange={(e) => setType(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
        />

        <button type="submit" className="btn btn-primary w-24">
          Submit
        </button>
      </form>
    </div>
  );
}
