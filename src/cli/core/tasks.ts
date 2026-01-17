import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { getTasksFilePath } from "@/cli/core/config"
import { parseTask } from "@/cli/data/validators"
import { validateTask } from "@/cli/data/schema"
import type { Task } from "@/cli/data/types"

export function readTasks(): Task[] {
	const tasksPath = getTasksFilePath()
	if (!existsSync(tasksPath)) {
		return []
	}
	const content = readFileSync(tasksPath, "utf-8")
	const parsed = JSON.parse(content)
	if (!Array.isArray(parsed)) {
		throw new Error("tasks.json must contain an array")
	}
	return parsed.map((task, index) => {
		const result = parseTask(task)
		if (!result.success) {
			throw new Error(`Invalid task at index ${index}: ${result.issues}`)
		}
		return result.data
	})
}

export function createTask(task: Task): Task {
	const tasks = readTasks()
	const newTask = validateTask(task)
	tasks.push(newTask)
	writeTasks(tasks)
	return newTask
}

export function updateTask(id: string, updates: Partial<Task>): Task {
	const tasks = readTasks()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		throw new Error(`Task with id "${id}" not found`)
	}
	const updatedTask = validateTask({ ...tasks[index], ...updates })
	tasks[index] = updatedTask
	writeTasks(tasks)
	return updatedTask
}

export function findNextTask(): Task | undefined {
	const tasks = readTasks()
	return tasks.find((task) => task.passes === false)
}

export function deleteTask(id: string): boolean {
	const tasks = readTasks()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return false
	}
	tasks.splice(index, 1)
	writeTasks(tasks)
	return true
}

function writeTasks(tasks: Task[]): void {
	const tasksPath = getTasksFilePath()
	writeFileSync(tasksPath, JSON.stringify(tasks, null, 2))
}
