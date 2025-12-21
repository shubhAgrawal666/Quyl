import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseBySlug } from "../../api/courses";
import { updateCourse } from "../../api/admin";
import { v4 as uuidv4 } from "uuid";

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await getCourseBySlug(courseId);
        if (!res.data.success) {
          alert("Course not found");
          return;
        }

        const c = res.data.course;
        setCourse(c);

        setTitle(c.title);
        setCategory(c.category);
        setThumbnail(c.thumbnail);
        setDescription(c.description);

        setVideos(
          c.lessons.map((l) => ({
            id: uuidv4(),
            title: l.title,
            url: l.youtubeUrl,
            duration: l.duration,
          }))
        );
      } catch (err) {
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

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

  const handleSave = async (e) => {
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

      const res = await updateCourse(course.slug, payload);

      if (res?.data?.success) {
        alert("Course updated successfully!");
        navigate("/admin/courses");
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Server error updating course");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!course) return <p className="text-center mt-10">Course not found</p>;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>

      <form
        onSubmit={handleSave}
        className="space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow"
      >
        {/* Title */}
        <div>
          <label className="text-sm font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
          />
        </div>

        {/* Category + Thumbnail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Thumbnail</label>
            <input
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="mt-1 w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Lessons */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="font-semibold">Lessons / Videos</h2>
            <button
              type="button"
              onClick={addVideo}
              className="px-3 py-1 bg-blue-600 text-white rounded w-full sm:w-auto"
            >
              Add Video
            </button>
          </div>

          <div className="space-y-3">
            {videos.map((v, idx) => (
              <div
                key={v.id}
                className="p-3 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">
                    Lesson #{idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVideo(v.id)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    value={v.title}
                    onChange={(e) =>
                      updateVideo(v.id, "title", e.target.value)
                    }
                    placeholder="Lesson title"
                    className="border p-2 rounded"
                  />

                  <input
                    value={v.url}
                    onChange={(e) =>
                      updateVideo(v.id, "url", e.target.value)
                    }
                    placeholder="YouTube Video URL"
                    className="border p-2 rounded"
                  />

                  <input
                    value={v.duration}
                    onChange={(e) =>
                      updateVideo(v.id, "duration", e.target.value)
                    }
                    placeholder="Duration (e.g. 10:30)"
                    className="border p-2 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
