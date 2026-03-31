import * as Bun from "bun"

export async function runOpencode(prompt: string): Promise<void> {
  const proc = Bun.spawn(["opencode", "run", "--attach", "http://localhost:4096"], {
    stdio: ["pipe", "pipe", "pipe"],
  })

  proc.stdin.write(prompt)
  proc.stdin.end()

  await proc.exited
}
