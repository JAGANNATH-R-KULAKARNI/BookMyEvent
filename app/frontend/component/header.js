import Link from 'next/link';

const NavHeader=({ currentUser }) => {

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul>
              {!currentUser && <li><Link href='/auth/signup'><a>SignUp</a></Link></li>}
          {!currentUser && <li><Link href='/auth/signin'><a>SignIn</a></Link></li>}
          {currentUser && <li><Link href='/auth/signout'><a>SignOut</a></Link></li>}
        </ul>
      </div>
    </nav>
  );
};

export default NavHeader;