import Link from "next/link";
import Image from "next/image";
import Logo from "../public/Logo.svg";

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
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand" className="align-middle" href="#">
          <Image
            src={Logo}
            alt="Ment-Tix Logo"
            height="280"
            alt="Ment-Tix Logo"
          />
        </a>
      </Link>
      <small className="navbar-text">Edu-commerce Platform</small>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
