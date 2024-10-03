import { createClient } from '@supabase/auth-helpers-sveltekit';

export const supabaseClient = createClient(
	'https://hljlpuipsmbrognugxmp.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsamxwdWlwc21icm9nbnVneG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjEyMzE5MDUsImV4cCI6MTk3NjgwNzkwNX0.6Zo_gmcQgkSJ-gsxSw65RZ2Qa0IF_qGH46DiBPI-wac'
);

const main = async () => {
	const user = await supabaseClient
		.from('profiles')
		.select()
		.eq('email', 'keithlang75@gmail.com')
		.single();
	console.log(user);
};

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
