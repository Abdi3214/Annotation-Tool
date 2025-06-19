"use client";
import { Trash } from "phosphor-react";
import { useEffect, useState } from "react";

export default function SavedAnnotations() {
  const [annotations, setAnnotations] = useState([]);

  useEffect(() => {
    fetchAnnotations();
  }, []);

  const fetchAnnotations = async () => {
    const res = await fetch(
      "http://localhost:5000/api/annotation/rebortAnnotation"
    );
    const data = await res.json();
    setAnnotations(data);
  };

  const handleDeleteAll = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete all annotations?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/annotation/deleteAll",
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Delete failed: ${res.status} - ${errorText}`);
        alert("Failed to delete annotations.");
        return;
      }
      fetchAnnotations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting annotations:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = confirm(
      "Are you sure you want to delete this annotation?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/annotation/rebortAnnotationDelete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Delete failed: ${res.status} - ${errorText}`);
        alert("Failed to delete annotation.");
        return;
      }
      fetchAnnotations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting annotation:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        {annotations.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Delete All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {annotations.map((item) => (
          <div
            key={item._id}
            className="border p-4 flex items-center justify-between border-gray-200 shadow-md rounded-sm"
          >
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 w-8 flex items-center justify-center h-8 rounded-full">{item.Annotator_ID + 1}</div>
              {item.Src_Text} - Score: {item.Score}
            </div>
            <Trash
                className="cursor-pointer"
                onClick={() => handleDelete(item._id)}
                size={24}
                color="#ff0000"
              />
          </div>
        ))}
        {annotations.length === 0 && (
          <p className="text-gray-500">No saved annotations.</p>
        )}
      </div>
    </div>
  );
}
