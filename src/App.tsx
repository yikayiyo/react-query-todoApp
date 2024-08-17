import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Todos from "./Todos";
import NewTodo from "./NewTodo";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-[90%] mx-auto flex flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold self-start mb-10">Todo App</h1>
        <NewTodo />
        <Todos />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
