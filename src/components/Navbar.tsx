import { Link, useLocation } from "react-router-dom";


export const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path: string) => {
    const baseClass = "px-3 py-1 rounded-md transition font-medium";
    const activeClass = `${baseClass} text-[#5B8DB8]`;
    const inactiveClass = `${baseClass} text-black hover:text-[#5B8DB8]`;

    return currentPath === path ? activeClass : inactiveClass;
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow">
      <h1 className="text-2xl font-bold text-[#5B8DB8] flex items-center gap-2">
        🛒 Supermarket Path Planner
      </h1>
      <nav className="space-x-2">
        <Link to="/" className={getLinkClass("/")}>Home</Link>
        <Link to="/about" className={getLinkClass("/about")}>About</Link>
        <Link to="/goal" className={getLinkClass("/goal")}>Goal</Link>
        <Link to="/docs" className={getLinkClass("/docs")}>Docs</Link>
        <Link to="/signin" className={getLinkClass("/signin")}>Sign In</Link>
      </nav>
    </header>
  );
};