interface Task {
    id: BigInt,
    currentStatus: string,
    dueTimestamp: BigInt,
    title: string,
    description: string,
    username: string,
}

export type { Task }