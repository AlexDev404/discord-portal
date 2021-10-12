let token = "";
let raw;
let msgList;
let tenorID;
let chan_id = "";
const common_img_formats = [".png", ".gif", ".jpg", ".jpeg", ".bmp"];
const tenorBase = ["https://tenor.com/view/", "http://tenor.com/view/"];
let lastpost;
let me = "";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.onload = function () {
  let DMName = document.getElementById("DMName");
  let DMName__side = document.getElementById("DMName__side");
  let DMIcon__side = document.getElementById("DMIcon__side");
  let preview_message = document.getElementById("preview-message");
  let preview_date = document.getElementById("preview-date");
  // let DMIcon = document.getElementById("DMIcon");
  let msgBody = document.getElementById("chat-message-list");
  // let sendBtn = document.getElementById("sendBtn");
  let size = 512;
  let rootAvatarURL = "https://cdn.discordapp.com/avatars/";
  let msgBox = document.getElementById("msgBox");
  let clear = document.getElementById("clear");
  let latest_TS = `${
    monthNames[new Date().getMonth()]
  } ${new Date().getDate()}`;

  var id_generator = function (pow) {
    return Math.floor(Math.random() * pow);
  };

  msgBox.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      if (
        msgBox.value === null ||
        msgBox.value === undefined ||
        msgBox.value === ""
      ) {
        return;
      }
      sendMsg(msgBox.value);
      msgBox.value = null;
    }
  });

  clear.addEventListener("click", (event) => {
    msgBody.innerHTML = "";
    preview_message.innerHTML = "<i>Conversation was cleared.</i>";
    preview_date.innerText = latest_TS;
  });

  async function getMsgList(limit) {
    fetch(
      `https://discord.com/api/v9/channels/${chan_id}/messages?limit=${limit}`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-US",
          authorization: `${token}`,
          "content-type": "application/json",
          "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
        },
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((json) => {
        raw = json;
        // console.log(raw); -- DEBUG
        if (raw[0].content != lastpost) {
          setContent();
        }
      });
  }
  (async () => {
    await getMsgList(95); // MAX: 100; MIN: 1 - If over MAX or under MIN, server returns a 400: Bad Request
    // await clickHandler();
  })();

  function setContent() {
    let x = raw.length - 1;

    let avatarURL;
    let timestamp;

    let latest_TS = `${
      monthNames[new Date(raw[0].timestamp).getMonth()]
    } ${new Date(raw[0].timestamp).getDate()}`;

    // Start Loop Message List
    while (x > -1) {
      // Reset Counter

      let y = 0;
      let z = 0;

      // Set Avatar
      if (raw[x].author.avatar === null) {
        avatarURL = "placeholder.png";
      } else {
        avatarURL = `${rootAvatarURL}${raw[x].author.id}/${raw[x].author.avatar}.png?size=${size}`;
      }

      if (raw[0].author.id === me) {
        preview_message.innerHTML = `<b>You:</b> ${raw[0].content}`;
        preview_date.innerText = latest_TS;
      } else {
        preview_message.innerText = `${raw[0].content}`;
        preview_date.innerText = latest_TS;
      }
      timestamp = new Date(raw[x].timestamp).toGMTString();
      // DMIcon.src = avatarURL;

      // If I sent the DM message do this

      if (raw[x].author.id === me) {
        /*  msgBody.insertAdjacentHTML(
          "afterbegin",
          `<img style="width: 200px" src="${raw[x].content}"/><div class="message-time">${timestamp}</div>`
        );

*/

        while (y < common_img_formats.length) {
          console.log(
            `%cSTD_IMG_PARSER: %c LOOPING THROUGH DISPLAYABLE IMAGE FORMATS: %c${y}/${common_img_formats.length}`,
            "color: #c79022",
            "color: black",
            "color: #c7c422"
          );
          if (raw[x].content.includes(common_img_formats[y])) {
            msgBody.insertAdjacentHTML(
              "afterbegin",
              `<div class="message-row you-message" id="${lastMsg_TS}"><div class="message-content"><img style="all: initial; max-width: 450px; padding-bottom: 2px;" src="${raw[x].content}"/><div class="message-time">${timestamp}</div></div></div>`
            );
          }
          y++;
        }
        lastMsg_TS = `${x}-${raw[x].timestamp}`;
        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row you-message" id="${lastMsg_TS}"><div class="message-content"><div class="message-text">${raw[x].content}</div><div class="message-time">${timestamp}</div></div></div>`
        );

        discAttch("you", x, msgBody, raw, timestamp, avatarURL, lastMsg_TS);
        parseTenor(z, x, msgBody, "you", avatarURL, lastMsg_TS, raw, timestamp);
      }

      // If I was not the author of the DM Message do this
      else {
        DMName.innerText = raw[x].author.username;
        DMName__side.innerText = raw[x].author.username;
        DMIcon__side.src = avatarURL;
        lastMsg_TS = `${x}-${raw[x].timestamp}`;

        while (y < common_img_formats.length) {
          console.log(
            `%cSTD_IMG_PARSER: %c LOOPING THROUGH DISPLAYABLE IMAGE FORMATS: %c${y}/${common_img_formats.length}`,
            "color: #c79022",
            "color: black",
            "color: #c7c422"
          );
          if (raw[x].content.includes(common_img_formats[y])) {
            msgBody.insertAdjacentHTML(
              "afterbegin",
              `<div class="message-row other-message" id="${lastMsg_TS}"><div class="message-content"><img style="all: initial; max-width: 450px; padding-bottom: 2px;" src="${raw[x].content}"/><div class="message-time">${timestamp}</div></div></div>`
            );
          }
          y++;
        }

        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row other-message" id="${lastMsg_TS}"><div class="message-content"><img src="${avatarURL}" alt="${raw[x].author.username}" style="width: 32px"><div class="message-text">${raw[x].content}</div><div class="message-time">${timestamp}</div></div></div>`
        );
        discAttch(
          "other",
          x,
          msgBody,
          raw,
          timestamp,
          avatarURL,
          lastMsg_TS
        );
        parseTenor(
          z,
          x,
          msgBody,
          "other",
          avatarURL,
          lastMsg_TS,
          raw,
          timestamp
        );
      }
      lastpost = raw[x].content;
      x--;

      //	console.log(raw[x].author.username);
      //	console.log(raw[x].content);
      // https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png
    }
    msgBody.scrollTo(0, msgBody.scrollHeight);
  }

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function sendMsg(string) {
    fetch(`https://discord.com/api/v9/channels/${chan_id}/messages`, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US",
        authorization: `${token}`,
        "content-type": "application/json",
        "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
      },

      referrer: `https://discord.com/channels/@me/${chan_id}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{\"content\":\"${string}\",\"nonce\":\"${id_generator(
        99999999999999999
      )}\",\"tts\":false}`,
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    await sleep(500);
    getMsgList(1);
    msgBody.scrollTo(0, msgBody.scrollHeight);
    await sleep(500);
    lastpost = string;
  }
  /*
   async function clickHandler() {
      sendBtn.addEventListener("click", function () {
         console.log("clicked send");

         if (
            msgBox.value === null ||
            msgBox.value === undefined ||
            msgBox.value === ""
         ) {
            return;
         }
         sendMsg(msgBox.value);
         msgBox.value = "";
      });
   }
*/
  setInterval(function () {
    getMsgList(1);
  }, 8500); //wait 8.5 seconds - sacrifice time over banning
};

function parseTenor(z, x, msgBody, persona, avatarURL, LTS, raw, timestamp) {
  // Tenor GIFS
  while (z < tenorBase.length) {
    console.log(
      `%cPARSE_TENOR: %c DOMAIN %c${z}/${tenorBase.length}`,
      "color: #51c722",
      "color: black",
      "color: #c7c422"
    );

    if (raw[x].content.includes(tenorBase[z])) {
      console.log(
        "%cPARSE_TENOR: %c MATCH FOUND",
        "color: #51c722",
        "color: black"
      );
      let parseTenorURL = raw[x].content.split(/\s*\-\s*/g);
      let tenorID = parseTenorURL[parseTenorURL.length - 1];
      let elem = document.getElementById(LTS);

      console.log(
        `%cTENOR-ID: %c ${tenorID}`,
        "color: #51c722",
        "color: black"
      );
      /* msgBody.insertAdjacentHTML(
        "afterbegin",
        `<div class="tenor-gif-embed" data-postid="${tenorID}" data-share-method="host" data-aspect-ratio="1.3278" data-width="100%" > </div>`
      );*/

      elem.parentNode.removeChild(elem);
      if (persona === "other") {
        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row ${persona}-message"><div class="message-content"><img src="${avatarURL}" alt="${
            raw[x].author.username
          }" style="width: 32px"></img><iframe style="border: 5px solid ${rHEX()}; padding-bottom: 8px;" src="https://tenor.com/embed/${tenorID}?canonicalurl=null"></iframe><div class="message-time">${timestamp}</div></div></div>`
        );
      } else {
        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row ${persona}-message"><div class="message-content"><iframe style="border: 5px solid ${rHEX()}; padding-bottom: 8px;" src="https://tenor.com/embed/${tenorID}?canonicalurl=null"></iframe><div class="message-time">${timestamp}</div></div></div>`
        );
      }
    }
    z++;
  }
}

function rHEX() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function discAttch(persona, x, msgBody, raw, timestamp, avatarURL, LTS) {
  let elem = document.getElementById(LTS);

  if (persona === "other") {
    try {
      console.log(
        "%cDISC_ATTCH: %c Searching...",
        "color: #9f00f5",
        "color: black"
      );
      if (raw[x].attachments[0].url || raw[x].attachments[0].proxy_url) {
        elem.parentNode.removeChild(elem);
        console.log(
          "%cDISC_ATTCH: %c Attachment Found! Displaying.",
          "color: #9f00f5",
          "color: black"
        );
        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row ${persona}-message"><div class="message-content"><img src="${avatarURL}" alt="${raw[x].author.username}" style="width: 32px"></img><img style="all: initial; max-width: 450px; padding-bottom: 2px;" src="${raw[x].attachments[0].url}"/><div class="message-time">${timestamp}</div></div></div>`
        );
      }
    } catch (e) {
      console.log(
        "%cDISC_ATTCH: %c No image.",
        "color: #9f00f5",
        "color: black"
      );
    }
  } else {
    try {
      console.info(
        "%cDISC_ATTCH: %c Searching...",
        "color: #9f00f5",
        "color: black"
      );
      if (raw[x].attachments[0].url || raw[x].attachments[0].proxy_url) {
        elem.parentNode.removeChild(elem);
        console.log(
          "%cDISC_ATTCH: %c Attachment Found! Displaying.",
          "color: #9f00f5",
          "color: black"
        );
        msgBody.insertAdjacentHTML(
          "afterbegin",
          `<div class="message-row ${persona}-message"><div class="message-content"><img style="all: initial; max-width: 450px; padding-bottom: 2px;" src="${raw[x].attachments[0].url}"/><div class="message-time">${timestamp}</div></div></div>`
        );
      }
    } catch (e) {
      console.log(
        "%cDISC_ATTCH: %c No image.",
        "color: #9f00f5",
        "color: black"
      );
    }
  }
}
