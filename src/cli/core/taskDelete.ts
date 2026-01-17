import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"

export function taskDelete(id: string): boolean {
	const tasks = tasksRead()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return false
	}
	tasks.splice(index, 1)
	tasksWrite(tasks)
	return true
}
