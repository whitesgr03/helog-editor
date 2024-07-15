const characters =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateRandomString = (length = 32) =>
	Array.from(window.crypto.getRandomValues(new Uint32Array(length)), value =>
		characters.charAt(value % characters.length)
	).join("");

export default generateRandomString;
