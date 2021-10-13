'use strict';

const line = require('@line/bot-sdk');
const express = require('express');  

// create LINE SDK config from env variables
const config = {
  channelAccessToken: "bsJfBSJqbrOIgo1Jba+3Vpp+FX/NRDArDKEyZRI9uQ2RvcoTVbyco8Q9ROdkyryDTm1hJjJcS8dcplspUSfoH9B48UC0A/KnlH4d/7MjFvpt7yRjKCm+86vR36LwBdd/PyuVLak3t2UivCJhFclCswdB04t89/1O/w1cDnyilFU=",
  channelSecret: "4cd9f15dc6a6688a6fe4ea0a0212108d",
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }else if(event.message.type === "message" || event.message.text === "Hello"){
    const payload ={
      "type": "template",
      "altText": "this is a carousel template",
      "template": {
        "type": "carousel",
        "columns": [
          {
            "title": "Title",
            "text": "Text",
            "actions": [
              {
                "type": "message",
                "label": "Action 1",
                "text": "test1"
              },
              {
                "type": "message",
                "label": "Action 2",
                "text": "test2"
              }
            ]
          },
          {
            "title": "Title",
            "text": "Text",
            "actions": [
              {
                "type": "message",
                "label": "Action 1",
                "text": "Action 1"
              },
              {
                "type": "message",
                "label": "Action 2",
                "text": "Action 2"
              }
            ]
          }
        ]
      }
    };
    return client.replyMessage(event.replyToken,payload);
  }else if(event.message.type === "message" || event.message.text === "test1"){
    const payload ={
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "title": "Web Order Campaign",
        "text": "Issue Campaign",
        "actions": [
          {
            "type": "message",
            "label": "See",
            "text": "Close"
          }
        ]
      }
    }
    return client.replyMessage(event.replyToken,payload);
  }else if(event.message.type === "message" || event.message.text === "test2"){
       const payload =  {
      "type": "text",
      "text": "Hello, world"
  }
  return client.replyMessage(event.replyToken,payload);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
