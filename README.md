# Cloudflare Email Worker

## Overview

The Cloudflare Email Worker is an automated script that processes incoming emails to your domain in real-time.

Once deployed on Cloudflare network, it intercepts emails, extracts the required information, and then sends this data
to an external HTTP API or services like [Zapier](https://zapier.com/) for further actions.

Here’s a simple diagram of the workflow:

1. **Email Received**: Your domain receives an email.
2. **Email Routed**: Cloudflare routes the email to the Email Worker.
3. **Worker Parses Email**: The Worker parses the email, extracting necessary information.
4. **Data Posted to API**: The Worker makes an HTTP POST request to your API with the parsed data.

With this Worker, you can efficiently transform emails into actionable data without managing server infrastructure.

## Cloudflare Email Worker Setup

Follow these steps to set up your Cloudflare Email Worker, including creating and storing your API token:

### 1. Create a Cloudflare API Token

- **Access Cloudflare Dashboard**: Navigate to
	the [Cloudflare Dashboard API Tokens section](https://dash.cloudflare.com/profile/api-tokens).
- **Token Creation**: Locate and click on the "Create Token" button.
- **Configuration**: Follow the on-screen prompts to define the new API token's permissions, ensuring you include those
	necessary for your Email Worker to function correctly.

Below is an example image showing where to create API tokens in the Cloudflare dashboard:
![Cloudflare Email API tokens](docs/images/cloudflare_api_tokens.png)

![Cloudflare Email API token Permisson](docs/images/cloudflare_api_tokens_permission.png)

### 2. Save the API Token Locally

- **Copy API Token**: After creating the token, copy it to your clipboard.
- **Create `.env` File**: In the root directory of your project where the Cloudflare Email Worker is set up, create
	a `.env` file.
- **Store API Token**: Inside the `.env` file, add your API token in the format:
	```bash
	CLOUDFLARE_API_TOKEN=your_api_token_here
	```

### 3. Configure Environment Variables

- **Prepare Configuration File**: Copy `wrangler.toml.example` to `wrangler.toml` in your project directory.
- **Add Variables**: Insert the following environment variables into the `wrangler.toml` file:
	```toml
	[vars]
	EMAIL_API_URL = "https://your-api-endpoint-url.com"
	```
	Replace `"https://your-api-endpoint-url.com"` with your actual API endpoint URL.

### 4. Deploy the Worker

- **Publish with Wrangler**: To deploy your worker to Cloudflare, use the Wrangler CLI with the command:
	```bash
	make wrangler_deploy
	```

### 5. Set Up Cloudflare Email Worker Routing

Choose your domain and set up the email routing as follows:

- **Navigate to Email Routing**: In your Cloudflare dashboard, select the appropriate domain. Then, click on the "Email"
	tab, and go to the "Email Routing" section.
- **Configure Catch-All Email**: Set a catch-all rule to forward all emails to your Cloudflare Worker.

- **Save the Rule**: Once you have configured the rule, click "Save" to activate the email routing to your worker.

Below is an example image showing the Email Routing setup in the Cloudflare dashboard:

![Cloudflare Email Routing Setup](docs/images/email_routing.png)

