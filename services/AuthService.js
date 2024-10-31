import axios from "../utils/axios";
import { setToken } from "./TokenService";

export async function login(credentials) {
	const { data } = await axios.post("/petowner/login", credentials);
	await setToken(data.api_token);
}

export async function register(credentials) {
	const { data } = await axios.post("/petowner/register", credentials);
	await setToken(data.api_token);
}

export async function loadUser() {
	const { data: user } = await axios.post("/petowner/profile");
	return user;
}

export async function logout() {
	await axios.post("/logout");

	await setToken(null);
}
