"use client";

import React from "react";

interface TaskCardProps {
  task: any;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggle }) => {
  return (
    <div className="p-4 mb-2 bg-white rounded shadow flex justify-between items-center">
      <div>
        <h2 className={`font-semibold ${task.status ? "line-through" : ""}`}>
          {task.title}
        </h2>
        {task.description && <p className="text-sm">{task.description}</p>}
      </div>
      <div className="flex gap-2">
        <button
          className={`px-2 py-1 rounded ${
            task.status ? "bg-yellow-500" : "bg-green-500"
          } text-white`}
          onClick={() => onToggle(task.id)}
        >
          {task.status ? "Pending" : "Done"}
        </button>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;