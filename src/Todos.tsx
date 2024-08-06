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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
      <div className="max-w-md mx-auto">
        {query.data?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
      <div className="max-w-md mx-auto">{`${finishedNumOfTodos} of ${totalNumOfTodos} finished.`}</div>
    </div>
  );
}
