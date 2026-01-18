import { tasksRead } from "@/cli/core/tasksRead"
import { tasksWrite } from "@/cli/core/tasksWrite"

export async function taskDelete(id: string): Promise<boolean> {
	const tasks = await tasksRead()
	const index = tasks.findIndex((t) => t.id === id)
	if (index === -1) {
		return false
	}
	tasks.splice(index, 1)
	await tasksWrite(tasks)
	return true
}
