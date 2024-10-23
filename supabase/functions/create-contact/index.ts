// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// This is needed if you're planning to invoke your function from a browser.
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const options = {
	method: 'POST',
	headers: {
		Authorization: 'Bearer e9f893acb7b7f2fb521d2b49c3cc2213',
		'Content-Type': 'application/json'
	}
};

Deno.serve(async (req) => {
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}
	const { email } = await req.json();
	fetch('https://app.loops.so/api/v1/contacts/create', {
		...options,
		body: JSON.stringify({ email })
	})
		.then((response) => response.json())
		.then((response) => console.log(response))
		.catch((err) => console.error(err));

	return new Response(JSON.stringify({ message: 'Contact created' }), {
		headers: { 'Content-Type': 'application/json' }
	});
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/hello-world' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
// supabase functions deploy create-contact --project-ref hljlpuipsmbrognugxmp
