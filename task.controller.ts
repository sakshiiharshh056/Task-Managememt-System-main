import { Request, Response } from "express";
import prisma from "../prisma/client";

// ✅ Create Task
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description } = req.body;

    const userId = req.user.userId; // from JWT middleware

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
};

// ✅ Get All Tasks (ONLY user’s tasks)
export const getTasks = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Optional formatting
    const formattedTasks = tasks.map(({ userId, ...task }) => ({
      ...task,
      status: task.status ? "completed" : "pending",
    }));

    res.json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

// ✅ Toggle Task Status
export const toggleTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        status: !task.status,
      },
    });

    res.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling task" });
  }
};

// ✅ Delete Task
export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
};