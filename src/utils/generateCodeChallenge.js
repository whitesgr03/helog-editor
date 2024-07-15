const sha256 = async str =>
	await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));

const base64URLEncode = arrayBuffer => {
	let binary = "";
	const bytes = new Uint8Array(arrayBuffer);
	const len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return window
		.btoa(binary)
		.replace(/\+/g, "-" )
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

const generateCodeChallenge = async str => base64URLEncode(await sha256(str));

export default generateCodeChallenge;
