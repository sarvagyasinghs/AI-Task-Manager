"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  // ====================
  // State & Setup
  // ====================
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // For searching tasks
  const [searchQuery, setSearchQuery] = useState("");

  // For new task creation
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssigned, setNewAssigned] = useState("");

  // For AI suggestions
  const [aiSuggestion, setAISuggestion] = useState("");
  const [taskBreakdownInput, setTaskBreakdownInput] = useState("");
  const [aiBreakdown, setAIBreakdown] = useState("");

  // For tasks & filtering
  const [tasks, setTasks] = useState<any[]>([]);
  // For sidebar filters
  const [filterToday, setFilterToday] = useState(false);
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterAssignedToMe, setFilterAssignedToMe] = useState(false);
  const [filterHighPriority, setFilterHighPriority] = useState(false);
  const [sortNewest, setSortNewest] = useState(true); // vs oldest

  // Affirmations to show on completion
  const AFFIRMATIONS = [
    "Great work! Keep going!",
    "You did it! Awesome job!",
    "Another task bites the dust!",
    "Fantastic! You're on a roll!",
    "Bravo! Keep crushing those tasks!",
  ];

  // ====================
  // On mount: load token & email, fetch tasks
  // ====================
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setToken(storedToken);
    setUserEmail(storedEmail);

    if (storedToken) {
      fetchTasks(storedToken);
      // WebSocket for real-time updates
      const ws = new WebSocket("ws://localhost:8080/api/ws");
      ws.onmessage = () => fetchTasks(storedToken);
      return () => {
        ws.close();
      };
    }
  }, []);

  // ====================
  // Fetch Tasks
  // ====================
  const fetchTasks = (jwt: string) => {
    axios
      .get("http://localhost:8080/api/tasks", {
        headers: { Authorization: jwt },
      })
      .then((res) => setTasks(res.data))
      .catch(console.error);
  };

  // ====================
  // Create a new Task
  // ====================
  const createTask = () => {
    if (!newTitle.trim()) return;
    axios
      .post(
        "http://localhost:8080/api/tasks",
        { title: newTitle, description: newDesc, assigned_to: newAssigned },
        { headers: { Authorization: token } }
      )
      .then((res) => {
        setTasks((prev) => [...prev, res.data]);
        // Clear inputs
        setNewTitle("");
        setNewDesc("");
        setNewAssigned("");
      })
      .catch(console.error);
  };

  // ====================
  // Complete (Delete) Task => words of affirmation
  // ====================
  const handleCompleteTask = (taskId: number) => {
    axios
      .delete(`http://localhost:8080/api/tasks/${taskId}`, {
        headers: { Authorization: token },
      })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        // pick a random affirmation
        const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
        alert(AFFIRMATIONS[randomIndex]);
      })
      .catch(console.error);
  };

  // ====================
  // AI Endpoints
  // ====================
  const getAISuggestion = () => {
    axios
      .get("http://localhost:8080/api/ai/suggestions", {
        headers: { Authorization: token },
      })
      .then((res) => setAISuggestion(res.data.suggestions))
      .catch(console.error);
  };

  const getAIBreakdown = () => {
    if (!taskBreakdownInput.trim()) return;
    axios
      .get(`http://localhost:8080/api/ai/suggestions?task=${encodeURIComponent(taskBreakdownInput)}`, {
        headers: { Authorization: token },
      })
      .then((res) => setAIBreakdown(res.data.suggestions))
      .catch(console.error);
  };

  // ====================
  // If not logged in
  // ====================
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        <h2 className="text-2xl font-semibold">You are not logged in.</h2>
        <p className="mt-2">
          Please{" "}
          <a href="/login" className="underline text-blue-600">
            login
          </a>{" "}
          or{" "}
          <a href="/register" className="underline text-blue-600">
            register
          </a>.
        </p>
      </div>
    );
  }

  // ====================
  // Filter + Search + Sort Tasks
  // ====================
  const filteredTasks = tasks
    .filter((task) => {
      // search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
      );
    })
    .filter((task) => {
      // "Today"
      if (filterToday) {
        const taskDate = new Date(task.created_at).toLocaleDateString();
        const today = new Date().toLocaleDateString();
        if (taskDate !== today) return false;
      }
      // "Completed" - tasks are deleted on completion, so skip them
      if (filterCompleted) {
        return false; 
      }
      // "Assigned to me"
      if (filterAssignedToMe) {
        if (task.assigned_to !== userEmail) return false;
      }
      // "High Priority" (placeholder logic)
      if (filterHighPriority) {
        if (!task.title.toLowerCase().includes("priority")) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // sort by newest vs oldest
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortNewest ? dateB - dateA : dateA - dateB;
    });

  // ====================
  // Render
  // ====================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Top Nav */}
      <header className="w-full bg-white shadow p-4 flex items-center justify-between">
        {/* Right side: search input + user info */}
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
          <div className="text-sm text-gray-600">
            Logged in as <span className="font-semibold">{userEmail}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4 space-y-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="space-y-2 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={filterToday}
                onChange={(e) => setFilterToday(e.target.checked)}
              />
              <span>Today</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={filterCompleted}
                onChange={(e) => setFilterCompleted(e.target.checked)}
              />
              <span>Completed</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={filterAssignedToMe}
                onChange={(e) => setFilterAssignedToMe(e.target.checked)}
              />
              <span>Assigned to me</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                checked={filterHighPriority}
                onChange={(e) => setFilterHighPriority(e.target.checked)}
              />
              <span>High Priority</span>
            </label>
          </div>
          <hr />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Sort by</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sort"
                className="cursor-pointer"
                checked={sortNewest}
                onChange={() => setSortNewest(true)}
              />
              <span>Newest first</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="sort"
                className="cursor-pointer"
                checked={!sortNewest}
                onChange={() => setSortNewest(false)}
              />
              <span>Oldest first</span>
            </label>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 overflow-auto">
          {/* Task Creation */}
          <div className="mb-4 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Create a Task</h2>
            <div className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={newAssigned}
                onChange={(e) => setNewAssigned(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <button
              onClick={createTask}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors text-sm mt-2"
            >
              Add Task
            </button>
          </div>

          {/* AI Features Card */}
          <div className="mb-4 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">AI Features</h2>
            {/* Generic Suggestion */}
            <div className="mb-2">
              <button
                onClick={getAISuggestion}
                className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                Get Generic Suggestion
              </button>
              {aiSuggestion && (
                <div className="mt-2 bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                  {aiSuggestion}
                </div>
              )}
            </div>
            {/* Task Breakdown */}
            <div className="flex flex-col md:flex-row gap-2 items-start">
              <input
                type="text"
                placeholder="Break down a task..."
                value={taskBreakdownInput}
                onChange={(e) => setTaskBreakdownInput(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full md:w-1/2 text-sm"
              />
              <button
                onClick={getAIBreakdown}
                className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                Break Down
              </button>
            </div>
            {aiBreakdown && (
              <div className="mt-2 bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                {aiBreakdown}
              </div>
            )}
          </div>

          {/* Recommended Tasks header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recommended Tasks</h2>
            <p className="text-sm text-gray-500">
              Showing {filteredTasks.length} tasks
            </p>
          </div>

          {/* Grid of tasks */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded shadow p-4 flex flex-col space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                  <span>ID: {task.id}</span>
                </div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600 flex-1">{task.description}</p>
                <p className="text-sm text-gray-500">Assigned: {task.assigned_to}</p>
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleCompleteTask(task.id)}
                    className="text-sm bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
