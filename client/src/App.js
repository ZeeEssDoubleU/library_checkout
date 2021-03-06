import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
// import components
import Nav from "./components/Nav";
import Landing from "./components/Landing";
import Login from "./components/Auths/Login/Login.js";
import Register from "./components/Auths/Register.js";
import AllBooks from "./components/Books/AllBooks.js";
import AvailableBooks from "./components/Books/AvailableBooks.js";
import CheckedOutBooks from "./components/Books/CheckedOutBooks.js";
import Users from "./components/Users/Users.js";
import PrivateRoute from "./components/Auths/PrivateRoute";
// import store/actions
import useStore from "./store/useStore";
import { accessToken_get } from "./store/actions/auth";
import { getUser_current } from "./store/actions/users";
import OAuthCallback from "./components/Auths/OAuthCallback";

function App() {
	const { state, dispatch } = useStore();
	const history = useHistory();

	// checks if user already logged into client
	// if jwt already in memory, check expiration
	useEffect(() => {
		if (
			history.location.pathname !== "/oauth/callback" &&
			!localStorage.logout
		) {
			state.user_current
				? accessToken_get(history, state, dispatch)
				: getUser_current(history, state, dispatch);
		}
	}, [state.user_current, history, localStorage]);

	return (
		<>
			<Nav />
			<Switch>
				<Route exact path="/" component={Landing} />
				<Route exact path="/login" component={Login} />
				<Route exact path="/register" component={Register} />
				<Route exact path="/books/all" component={AllBooks} />
				<Route exact path="/books/available" component={AvailableBooks} />
				<PrivateRoute
					exact
					path="/books/checked-out"
					component={CheckedOutBooks}
				/>
				<Route exact path="/users" component={Users} />
				{/* for social authorization */}
				<Route exact path="/oauth/callback" component={OAuthCallback} />
			</Switch>
		</>
	);
}

export default App;
