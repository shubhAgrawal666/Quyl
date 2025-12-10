// src/components/admin/EditCourse.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import dummyCourses from "../../data/dummyCourses";
import { v4 as uuidv4 } from "uuid";

export default function EditCourse() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const c = dummyCourses.find(x => x._id === courseId);
    if (c) {
      setCourse(c);
      setTitle(c.title);
      setCategory(c.category);
      setThumbnail(c.thumbnail);
      setDescription(c.description || "");
      setVideos(c.lessons.map(l => ({ ...l })));
    }
  }, [courseId]);

  const addVideo = () => setVideos(prev => [...prev, { id: uuidv4(), title: "", url: "", thumbnail: "", creator: "", duration: "" }]);
  const removeVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));
  const updateVideo = (id, field, value) => setVideos(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));

  const handleSave = (e) => {
    e.preventDefault();
    // dummy: show updated course
    alert("Dummy save: " + JSON.stringify({ _id: courseId, title, category, thumbnail, description, lessons: videos }, null, 2));
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full border p-2 rounded"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Thumbnail URL</label>
            <input value={thumbnail} onChange={e=>setThumbnail(e.target.value)} className="mt-1 w-full border p-2 rounded" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 w-full border p-2 rounded" rows={4}></textarea>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">Lessons / Videos</h2>
            <button type="button" onClick={addVideo} className="px-3 py-1 bg-blue-600 text-white rounded">Add video</button>
          </div>

          <div className="space-y-3">
            {videos.map((v, idx) => (
              <div key={v.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">Lesson #{idx+1}</div>
                  <button type="button" onClick={()=>removeVideo(v.id)} className="text-red-600 text-sm">Remove</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input value={v.title} onChange={e=>updateVideo(v.id,'title',e.target.value)} placeholder="Title" className="border p-2 rounded"/>
                  <input value={v.url} onChange={e=>updateVideo(v.id,'url',e.target.value)} placeholder="Video URL" className="border p-2 rounded"/>
                  <input value={v.thumbnail} onChange={e=>updateVideo(v.id,'thumbnail',e.target.value)} placeholder="Thumbnail URL" className="border p-2 rounded"/>
                  <input value={v.creator} onChange={e=>updateVideo(v.id,'creator',e.target.value)} placeholder="Creator name" className="border p-2 rounded"/>
                  <input value={v.duration} onChange={e=>updateVideo(v.id,'duration',e.target.value)} placeholder="Duration" className="border p-2 rounded"/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded">Save changes</button>
        </div>
      </form>
    </div>
  );
}
