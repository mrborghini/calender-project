interface TaskData {
    id: bigint,
    currentStatus: string,
    dueTimestamp: bigint,
    title: string,
    description: string,
    username: string,
}

export type { TaskData }