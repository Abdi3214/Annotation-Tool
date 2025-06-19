'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";

function UpdateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('');
  const router = useRouter();
  const searchParamas = useSearchParams();
  
  // Get search params
  const id = searchParamas.get('id');
  const initialName = searchParamas.get('name') || '';
  const initialEmail = searchParamas.get('email') || '';
  const initialPassword = searchParamas.get('password') || '';
  const initialType = searchParamas.get('type') || '';

  useEffect(() => {
    // Set initial values when component mounts
    setName(initialName);
    setEmail(initialEmail);
    setPassword(initialPassword);
    setType(initialType);
  }, [searchParamas]); // Re-run if search params change

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, password, userType: type };

    try {
      const res = await fetch(`http://localhost:5000/api/users/UpdateUsers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 409) {
          alert("This user already exists. Please try a different one.");
        } else {
          console.error(`Save failed: ${res.status} ${res.statusText} - ${text}`);
          alert("Failed to save user.");
        }
        return;
      }

      const result = await res.json();
      console.log("Saved user:", result);
      router.push('/home/users');
    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while updating the user.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <form className="flex flex-col space-y-3 border border-gray-200 shadow rounded p-4" onSubmit={handleSubmit}>
        <label>Name:</label>
        <input
          onChange={(e) => setName(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
          type="text"
          value={name}
          required
        />
        
        <label>Email:</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
          type="text"
          value={email}
          required
        />

        <label>Password:</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
          type="text"
          value={password}
          required
        />

        <label>Type:</label>
        <input
          onChange={(e) => setType(e.target.value)}
          className="border focus:outline-none border-gray-200 p-2 rounded-lg"
          type="text"
          value={type}
          required
        />

        <button type="submit" className="btn btn-primary w-24">
          Submit
        </button>
      </form>
    </div>
  );
}

export default UpdateUser;
