// src/components/admin/CreateCourse.jsx
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // optional - install uuid or replace with Date.now()

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([
    { id: uuidv4(), title: "", url: "", thumbnail: "", creator: "", duration: "" }
  ]);

  const addVideo = () => setVideos(prev => [...prev, { id: uuidv4(), title: "", url: "", thumbnail: "", creator: "", duration: "" }]);
  const removeVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));
  const updateVideo = (id, field, value) => setVideos(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));

  const handleSubmit = (e) => {
    e.preventDefault();
    // dummy action: show preview
    const payload = { title, category, thumbnail, description, lessons: videos };
    alert("Dummy create: " + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full border p-2 rounded" placeholder="React Mastery Bootcamp" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <input value={category} onChange={e=>setCategory(e.target.value)} className="mt-1 w-full border p-2 rounded" placeholder="Frontend" />
          </div>
          <div>
            <label className="block text-sm font-medium">Thumbnail URL</label>
            <input value={thumbnail} onChange={e=>setThumbnail(e.target.value)} className="mt-1 w-full border p-2 rounded" placeholder="https://..." />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 w-full border p-2 rounded" rows={4}/>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Videos / Lessons</h2>
            <button type="button" onClick={addVideo} className="px-3 py-1 bg-blue-600 text-white rounded">Add Video</button>
          </div>

          <div className="mt-3 space-y-3">
            {videos.map((v, idx) => (
              <div key={v.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium">Video #{idx+1}</div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => removeVideo(v.id)} className="text-red-600 text-sm">Remove</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input placeholder="Video title" value={v.title} onChange={e=>updateVideo(v.id,'title',e.target.value)} className="border p-2 rounded"/>
                  <input placeholder="Video URL" value={v.url} onChange={e=>updateVideo(v.id,'url',e.target.value)} className="border p-2 rounded"/>
                  <input placeholder="Thumbnail URL" value={v.thumbnail} onChange={e=>updateVideo(v.id,'thumbnail',e.target.value)} className="border p-2 rounded"/>
                  <input placeholder="Creator name" value={v.creator} onChange={e=>updateVideo(v.id,'creator',e.target.value)} className="border p-2 rounded"/>
                  <input placeholder="Duration (e.g. 12:34)" value={v.duration} onChange={e=>updateVideo(v.id,'duration',e.target.value)} className="border p-2 rounded"/>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">Create Course</button>
        </div>
      </form>
    </div>
  );
}
