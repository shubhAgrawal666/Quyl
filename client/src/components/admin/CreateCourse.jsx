
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createCourse } from "../../api/admin";
import { useNavigate } from "react-router-dom";

export default function CreateCourse() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");

  
  const [videos, setVideos] = useState([
    {
      id: uuidv4(),
      title: "",
      url: "",
      duration: "",
    },
  ]);

  const addVideo = () =>
    setVideos((prev) => [
      ...prev,
      { id: uuidv4(), title: "", url: "", duration: "" },
    ]);

  const removeVideo = (id) =>
    setVideos((prev) => prev.filter((v) => v.id !== id));

  const updateVideo = (id, field, value) =>
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title,
        category,
        thumbnail,
        description,
        lessons: videos.map((v) => ({
          title: v.title,
          youtubeUrl: v.url,
          duration: v.duration || "0:00",
        })),
      };

      const res = await createCourse(payload);

      if (res.data.success) {
        alert("Course created successfully!");
        navigate("/admin/courses");
      } else {
        alert(res.data.message || "Failed to create course");
      }
    } catch (err) {
      console.error("Create course error:", err);
      alert("Server error while creating course");
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
            required
            placeholder="Java Programming"
          />
        </div>

        {/* Category + Thumbnail */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border p-2 rounded"
              placeholder="Programming"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Thumbnail URL</label>
            <input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="mt-1 w-full border p-2 rounded"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Lessons Section */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Lessons / Videos</h2>
            <button
              type="button"
              onClick={addVideo}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add Lesson
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {videos.map((v, idx) => (
              <div key={v.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">Lesson #{idx + 1}</div>

                  <button
                    type="button"
                    onClick={() => removeVideo(v.id)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* Lesson Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    placeholder="Lesson Title"
                    value={v.title}
                    onChange={(e) =>
                      updateVideo(v.id, "title", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="YouTube Video URL"
                    value={v.url}
                    onChange={(e) => updateVideo(v.id, "url", e.target.value)}
                    className="border p-2 rounded"
                  />

                  <input
                    placeholder="Duration (e.g. 12:34)"
                    value={v.duration}
                    onChange={(e) =>
                      updateVideo(v.id, "duration", e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  );
}
