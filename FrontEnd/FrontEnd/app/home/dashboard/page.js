'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// Dashboard.jsx
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const annotationsData = [
  { name: "Mon", value: 300 },
  { name: "Tue", value: 500 },
  { name: "Wed", value: 700 },
  { name: "Thu", value: 500 },
];

const errorsData = [
  { name: "Mon", value: 100 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 250 },
  { name: "Thu", value: 450 },
];
// bg-[#0e2235]
export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
    } else {
      setToken(t);
    }
  }, []);
  const searchParamas = useSearchParams();
  const name = searchParamas.get('name')
  const [annotationIndex, setAnnotationIndex] = useState('');

  const [totalAnnotations, setTotalAnnotations] = useState(0);

  // useEffect(() => {
  //   const stored = localStorage.getItem('totalAnnotations');
  //   const parsed = stored ? parseInt(stored, 10) : 0;
  //   setTotalAnnotations(isNaN(parsed) ? 0 : parsed);
  // }, []);
  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span>{name}</span>
          <div className="bg-gray-500 w-8 h-8 rounded-full" />
        </div>
      </header>

      <section className="flex space-x-16">
        <div className="flex-1 p-6 rounded-lg border border-gray-200 shadow text-center">
          <p className="text-3xl font-bold">400</p>
          <p className="text-sm ">Total Annotations</p>
        </div>
        <div className="flex-1 p-6 rounded-lg border border-gray-200 shadow text-center">
          <p className="text-3xl font-bold">375</p>
          <p className="text-sm ">Annotations per user</p>
        </div>
        {/* <div className="p-6 rounded-lg border border-gray-200 shadow text-center">
          <p className="text-3xl font-bold">84</p>
          <p className="text-sm ">Completed</p>
        </div> */}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg mb-2">Annotations</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={annotationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#274967" />
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-lg mb-2">Errors</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={errorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#274967" />
              <XAxis dataKey="name" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded text-white">
          Submit
        </button>
      </div>
    </div>
  );
}
