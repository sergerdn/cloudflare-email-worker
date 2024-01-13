import PostalMime from "postal-mime";

/**
 * Converts a ReadableStream into a Uint8Array.
 *
 * @param {ReadableStream} stream - The input stream from the email event.
 * @param {number} streamSize - The size of the stream to be read.
 * @return {Promise<Uint8Array>} The resulting Uint8Array after reading the stream.
 */
async function streamToArrayBuffer(stream, streamSize) {
	let result = new Uint8Array(streamSize);
	let bytesRead = 0;
	const reader = stream.getReader();
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		result.set(value, bytesRead);
		bytesRead += value.length;
	}
	return result;
}

/**
 * Parses the email from the given event using the PostalMime library.
 *
 * @param {object} event - The event object containing the email data.
 * @return {Promise<object>} The parsed email data.
 */
async function parseEmail(event) {
	const rawEmail = await streamToArrayBuffer(event.raw, event.rawSize);
	const parser = new PostalMime();
	return parser.parse(rawEmail);
}

/**
 * Sends the parsed email data to a specified API endpoint.
 *
 * @param {object} parsedData - The parsed email data.
 * @param {string} emailApiUrl - The API endpoint URL.
 * @return {Promise<object>} The response from the API endpoint.
 */
async function sendParsedData(parsedData, emailApiUrl) {
	const response = await fetch(emailApiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(parsedData),
	});

	if (!response.ok) {
		throw new Error(`Failed to post parsed email data: ${response.statusText}`);
	}

	return response.json();
}

/**
 * The main function executed by Cloudflare Email Worker.
 * It processes incoming emails, parses them, and sends the data to an API endpoint.
 *
 * @param {object} event - The event object from Cloudflare.
 * @param {object} env - The environment variables.
 * @param {object} ctx - The execution context.
 */
export default {
	async email(event, env, ctx) {
		try {
			const parsedData = await parseEmail(event);
			console.log('Parsed Email Data:', parsedData);

			const emailApiUrl = `${env.EMAIL_API_URL}`.trim();
			if (!emailApiUrl) {
				throw new Error("EMAIL_API_URL environment variable is not set");
			}

			const postResponse = await sendParsedData(parsedData, emailApiUrl);
			console.log('Data posted successfully:', postResponse);
		} catch (error) {
			console.error('Error in email worker:', error);
			throw error;
		}
	},
}
