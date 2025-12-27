import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { getRandomEmoji, DiscordRequest } from './utils.js';

import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();
const session = wrapper(axios.create({ jar, withCredentials: true }));

const app = express();
const PORT = process.env.PORT || 3000;


app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  const { id, type, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    if (name === 'bonjour') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              content: `BONJOUR!!`
            }
          ]
        },
      });
    }
    if (name === 'show_all_gommettes') {
      res.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
      });

      await session.get(process.env.BACKEND_URL + "/auth/power_user", {
          params: { pass: process.env.POWER_USER_PASS }
      });

      const result = await session.get(
          process.env.BACKEND_URL + "/check_users"
      ).data;

      if(!result?.success || !result?.data){
        console.error(`Could not get result`);
        await axios.patch(
          `https://discord.com/api/v10/webhooks/${process.env.DISCORD_ID}/${id}/messages/@original`,
          { content: `Internal Error` }
        );
        return;
      }

      if(!result.data?.success || !result.data?.data){
        console.error(`Could not get result of result`);
        await axios.patch(
          `https://discord.com/api/v10/webhooks/${process.env.DISCORD_ID}/${id}/messages/@original`,
          { content: `Internal Error` }
        );
        return;
      }

      const results_array = result.data.data;
      
      let end_string = "";

      results_array.forEach(result => {
        end_string += result.user?.username + " -> " + ((result.gommette == "red") ? "🔴" : "🟢" + "\n");
      });

      await axios.patch(
        `https://discord.com/api/v10/webhooks/${process.env.DISCORD_ID}/${id}/messages/@original`,
        { content: end_string }
      );

      return;
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.get('/health', async (req, res) => {
    res.status(200).json({
        "success": true,
        "message": "The API is healthy",
        "error_code": null,
    });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
