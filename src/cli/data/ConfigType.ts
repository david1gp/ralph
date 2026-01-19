export type ConfigType = {
  tasksFile: string
  tasksArchivedDir: string
  storiesFolder: string
  projectTaskPrefix: Record<string, string>
  projectTaskIdNumber: Record<string, number>
  storyIdNumber: number
  projectStoryIdNumber: Record<string, number>
  testing?: boolean
}
