const { App } = require("@slack/bolt");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: {
    events: "/slack/events",
    commands: "/slack/commands"
  }
});
// console.log(process.env);

app.event("app_home_opened", ({ event, say }) => {
  say(`Hello world, <@${event.user}>!`);
});

app.message("badger", ({ say }) => {
  console.log("badger");
  say("Badgers? BADGERS? WE DON’T NEED NO STINKIN BADGERS");
});

app.message("hello", async ({ message, say }) => {
  console.log("message", message);
  console.log("hello");
  // say() sends a message to the channel where the event was triggered

  try {
    await say(`Hey there <@${message.user}>!`);
  } catch (err) {
    console.log(err);
  }
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  try {
    await ack();
    await say(`<@${body.user.id}> удалил все данные с сервера Jira`);
  } catch (err) {
    console.log(err);
  }
});

app.message("hy", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "удалить всё нахер с сервера"
          },
          action_id: "button_click"
        }
      }
    ]
  });
});

app.command("/echo", async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  await say(`${command.text}`);
});

app.command("/new1234", async ({ command, ack, say }) => {
  console.log(command);
  // Acknowledge command request
  await ack();

  await say(`${command.text}`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
