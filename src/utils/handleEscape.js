export const escaping = str =>
	str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
