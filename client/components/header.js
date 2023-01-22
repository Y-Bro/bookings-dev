import Link from "next/link";

const Header = ({ currentUser }) => {
	const links = [
		!currentUser && { label: "Sign Up", href: "/auth/signup" },
		currentUser && { label: "Sell Tickets", href: "/tickets/new" },
		currentUser && { label: "My Orders", href: "/orders" },
		!currentUser && {
			label: "Sign In",
			href: "/auth/signin"
		},
		currentUser && {
			label: "Sign Out",
			href: "/auth/signout"
		}
	]
		.filter((linkItem) => linkItem)
		.map(({ label, href }, index) => {
			return (
				<li key={index}>
					<Link legacyBehavior className="nav-item" href={href}>
						<a className="nav-link">{label}</a>
					</Link>
				</li>
			);
		});

	return (
		<nav className="navbar navbar-light bg-light">
			<Link legacyBehavior href="/" className="navbar-bra">
				<a className="navbar-brand">Bookings.dev</a>
			</Link>
			<div className="d-flex justify-content-end">
				<ul className="nav d-flex align-items-center">{links}</ul>
			</div>
		</nav>
	);
};

export default Header;
