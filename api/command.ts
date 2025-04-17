import { App } from '@slack/bolt';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});


app.command('/build', async ({ command, ack, say }) => {
  await ack();
  await say(`Hello ${command.user_name}!`);
});



