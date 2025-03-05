import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import LandingPage from "./LandingPage";
import AboutPage from "./pages/AboutPage";
import GoalPage from "./pages/GoalPage";
import DocsPage from "./pages/DocsPage";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    if (!client.models?.Todo) {
      console.error("❌ Error: Todo model is undefined");
      return;
    }

    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
      error: (err) => console.error("❌ Subscription error:", err),
    });

    return () => subscription.unsubscribe(); // ביטול המנוי בעת יציאה מהעמוד
  }, []);

  function createTodo() {
    const content = window.prompt("Enter your Todo:");
    if (content) {
      client.models.Todo.create({ content }).catch((err) =>
        console.error("❌ Error creating todo:", err)
      );
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id }).catch((err) =>
      console.error("❌ Error deleting todo:", err)
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/goal" element={<GoalPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route
          path="/todos"
          element={
            user ? (
              <main className="flex flex-col items-center p-6">
                <h1 className="text-3xl font-bold">
                  {user?.signInDetails?.loginId || "User"}'s Todos
                </h1>
                <button
                  className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-800"
                  onClick={createTodo}
                >
                  + Add New Todo
                </button>
                <ul className="mt-4 w-80">
                  {todos.map((todo) => (
                    <li
                      key={todo.id}
                      className="p-2 border-b cursor-pointer hover:bg-gray-200 text-center"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      {todo.content}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800"
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </main>
            ) : (
              <h1 className="text-center text-2xl mt-10">
                Please Sign In to View Todos
              </h1>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
