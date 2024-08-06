import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Todos from "./Todos";
import NewTodo from "./NewTodo";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <h1>Todo App</h1>
        <NewTodo />
        <Todos />
      </div>
    </QueryClientProvider>
  );
}
