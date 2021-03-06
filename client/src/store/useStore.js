// @ts-nocheck
import React, { createContext, useContext, useReducer, useEffect } from "react";
import isEmpty from "lodash/fp/isEmpty";
import axios from "axios";
// import action types
import { actionTypes_auth } from "./actions/auth";
import { actionTypes_users } from "./actions/users";
import { actionTypes_books } from "./actions/books";
import { actionTypes_errors } from "./actions/errors";

// reducer
const reducer = (state, action) => {
	switch (action.type) {
		// *** auth actions
		case actionTypes_auth.SAVE_ACCESS_TOKEN:
			return {
				...state,
				jwt_access: action.payload.jwt_access,
				jwt_access_expiry: action.payload.jwt_access_expiry,
			};
		// *** user actions
		case actionTypes_users.GET_USERS:
			return { ...state, users: action.payload };
		case actionTypes_users.GET_USER:
			return { ...state, user: action.payload };
		case actionTypes_users.SET_CURRENT_USER:
			return {
				...state,
				user_current: action.payload,
				isAuthenticated: !isEmpty(action.payload),
			};
		// *** book actions
		case actionTypes_books.GET_BOOKS_ALL:
			return { ...state, books_all: action.payload };
		case actionTypes_books.GET_BOOKS_AVAILABLE:
			return { ...state, books_available: action.payload };
		case actionTypes_books.GET_BOOKS_CHECKED_OUT:
			return { ...state, books_checked_out: action.payload };
		// *** error actions
		case actionTypes_errors.LOG_ERRORS:
			return {
				...state,
				errors: {
					...state.errors,
					...action.payload,
				},
			};
		case actionTypes_errors.CLEAR_ERRORS:
			return { ...state, errors: action.payload };
		default:
			return state;
	}
};

// initial state
const initState =
	typeof window !== "undefined"
		? {
				books_all: null,
				books_available: null,
				books_checked_out: null,
				book: null,
				users: null,
				user: null,
				user_current: null,
				isAuthenticated: false,
				jwt_access: null,
				jwt_access_expiry: null,
				errors: null,
		  }
		: {}; // fallback to {} so that sub states don't return null

// context that stores and shares data
const StoreContext = createContext();

// component to wrap upper level root component with Provider
export const StoreProvider = ({ children }) => {
	// ? consider localStorage for persisted state
	// const [state, dispatch] = useReducer(reducer, initState);

	// if persistedState available, load session state (previously saved store)
	const persistedState = JSON.parse(localStorage.getItem("persistedState"));
	// choose starting state (based on presence of persistedState)
	const startState = persistedState || initState;

	const [state, dispatch] = useReducer(reducer, {
		...initState,
		user_current: startState.user_current,
		isAuthenticated: startState.isAuthenticated,
	});

	// save store to localStorage
	useEffect(() => {
		localStorage.setItem(
			"persistedState",
			JSON.stringify({
				user_current: state.user_current,
				isAuthenticated: state.isAuthenticated,
			}),
		);
	}, [state.user_current, state.isAuthenticated]);

	return (
		<StoreContext.Provider value={{ state, dispatch }}>
			{children}
		</StoreContext.Provider>
	);
};

// useStore hook.  Acts as Consumer through useContext
export default () => {
	const { state, dispatch } = useContext(StoreContext);
	return { state, dispatch };
};
