import Link from "next/link";

const Header = ({ activeUser }) => {
  const links = [
    !activeUser && { label: "Sign Up", href: "/auth/signup" },
    !activeUser && { label: "Log In", href: "/auth/login" },
    activeUser && { label: "Log Out", href: "/auth/logout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">
          <h1>Ment-Tix </h1>{" "}
          <small class="text-muted">Edu-commerce Platform</small>
        </a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav nav-tabs badge badge-info">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
