"use client";

import { useState, useEffect } from "react";
import api from "../../services/api";
import TaskCard from "../../components/TaskCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const query = `?${search ? "search=" + search : ""}${
        filter !== "all" ? "&status=" + (filter === "done") : ""
      }`;
      const res = await api.get("/tasks" + query);
      setTasks(res.data.data);
    } catch (err: any) {
      toast.error("Failed to fetch tasks");
    }
  };

  const createTask = async () => {
    if (!title) return toast.error("Title required");
    try {
      await api.post("/tasks", { title });
      setTitle("");
      toast.success("Task Added!");
      fetchTasks();
    } catch (err: any) {
      toast.error("Failed to add task");
    }
  };

  const deleteTask = async (id: string) => {
    await api.delete(`/tasks/${id}`);
    toast.success("Task Deleted!");
    fetchTasks();
  };

  const toggleTask = async (id: string) => {
    await api.patch(`/tasks/${id}/toggle`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [search, filter]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Task Dashboard</h1>

        {/* Add Task */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border p-2 rounded"
            placeholder="New Task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded"
            onClick={createTask}
          >
            Add
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-1 border p-2 rounded"
            placeholder="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="done">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Task List */}
        {tasks.length === 0 && <p>No tasks found.</p>}
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onToggle={toggleTask}
          />
        ))}
      </div>
    </div>
  );
}