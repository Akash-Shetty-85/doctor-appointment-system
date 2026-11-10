import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/api";

interface HealthResponse {
  success: boolean;
  message: string;
  data: {
    api: string;
    database: string;
    environment: string;
  };
}

function App() {
  const healthQuery = useQuery({
    queryKey: ["api-health"],

    queryFn: async () => {
      const response = await api.get<HealthResponse>("/health");
      return response.data;
    },

    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-bold text-blue-700">
            MediBook
          </a>

          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium hover:text-blue-700"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Healthcare made simpler
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Find the right doctor.
          <span className="block text-blue-600">Book with confidence.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Discover doctors, explore available appointments, and manage your
          healthcare bookings in one place.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/doctors"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Find a Doctor
          </a>

          <a
            href="/register"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-100"
          >
            Create Account
          </a>
        </div>

        <div className="mt-12 rounded-xl border border-slate-200 bg-white px-6 py-4 text-left shadow-sm">
          <p className="font-semibold">Backend connection</p>

          {healthQuery.isPending && (
            <p className="mt-2 text-sm text-slate-500">
              Checking API status...
            </p>
          )}

          {healthQuery.isSuccess && (
            <div className="mt-2 text-sm">
              <p className="text-green-700">{healthQuery.data.message}</p>

              <p className="mt-1 text-slate-500">
                Database: {healthQuery.data.data.database}
              </p>
            </div>
          )}

          {healthQuery.isError && (
            <p className="mt-2 text-sm text-red-600">
              Unable to connect to the backend.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
