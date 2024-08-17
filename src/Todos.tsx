import { useQuery } from "@tanstack/react-query";
import { getTodos } from "./utils/api";
import TodoItem from "./TodoItem";

export default function Todos() {
  const query = useQuery({ queryKey: ["todos"], queryFn: getTodos });
  const totalNumOfTodos = query.data?.length || 0;
  const finishedNumOfTodos = query.data?.filter((todo) => todo.finished).length;

  if (query.isLoading)
    return <div className="text-center py-4">Loading...</div>;
  if (query.isError)
    return (
      <div className="text-center py-4 text-red-600">
        Error: {query.error.message}
      </div>
    );
  return (
    <div className="w-full mx-auto py-8">
      <div className="mx-auto">
        {query.data?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
      <div className="mx-auto">{`${finishedNumOfTodos} of ${totalNumOfTodos} finished.`}</div>
    </div>
  );
}
