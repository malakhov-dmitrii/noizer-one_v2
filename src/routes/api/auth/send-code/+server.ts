import { SMTP_PASSWORD } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';
import sgMail from '@sendgrid/mail';
import { prisma } from '@/lib/prisma';

sgMail.setApiKey(SMTP_PASSWORD);

/**
 * Generate a 4-digit verification token for the user
 * This token will be sent to the user's email address
 * and will be used to verify the user's email address
 *
 * Token expires after 15 minutes
 *
 * @returns {string} 4-digit verification token
 */
const generateVerificationToken = () => {
	const token = Math.floor(1000 + Math.random() * 9000);
	return token.toString();
};

/**
 * Handler for GET requests to /api/playlist
 * Returns a list of user playlists
 */
export const POST = (async ({ request }) => {
	const { email } = await request.json();

	// Generate a 4-digit verification token
	const token = generateVerificationToken();

	// Delete any existing verification tokens for the user
	await prisma.verificationToken.deleteMany({
		where: {
			identifier: email
		}
	});

	// Save the token to the database
	await prisma.verificationToken.create({
		data: {
			expires: new Date(Date.now() + 15 * 60 * 1000),
			identifier: email,
			token
		}
	});

	const templateId = 'd-4005f293ce234587855bd5372fbfee61';
	// Send the token to the user's email address

	await sgMail.send({
		from: 'auth@noizer.one',
		to: email,
		templateId,
		dynamicTemplateData: {
			code: token
		}
	});

	return json({
		ok: true
	});
}) satisfies RequestHandler;
