import { App } from '@slack/bolt';


export async function POST(request: Request) {

    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    const requestType = payload.type as "url_verification" | "event_callback";

    if (requestType === "url_verification") {
        return new Response(payload.challenge, { status: 200 });
    }

    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN,
    });

    app.command('/build', async ({ command, ack, say }) => {
        await ack();
        await say(`Hello ${command.user_name}!`);
    });

}



