interface Props {
    id: bigint,
    currentStatus: string,
    dueTimeStamp: bigint,
    title: string,
    description: string,
    username: string,
}

function Task(props: Props) {
    // Convert the dueTimeStamp to a Date object
    const dueDate = new Date(Number(props.dueTimeStamp));

    // Format the due date to a readable local time string
    const localDueTime = dueDate.toLocaleString();

    return (
        <div className="task">
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            <p>By {props.username}</p>
            <p>Due: {localDueTime}</p>
        </div>
    );
}

export default Task;
