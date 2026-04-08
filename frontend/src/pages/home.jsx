import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>Unauthorized</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
