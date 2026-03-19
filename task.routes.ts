import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import * as task from "../controllers/task.controller";
import { validate } from "../middleware/validate.middleware";
import { taskSchema } from "../validators/task.validator";

const router = express.Router();

router.get("/", authenticate, task.getTasks);
router.post("/", authenticate, validate(taskSchema), task.createTask);
router.delete("/:id", authenticate, task.deleteTask);
router.patch("/:id/toggle", authenticate, task.toggleTask);

export default router;