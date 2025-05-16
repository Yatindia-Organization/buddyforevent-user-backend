import axios from "axios";
import querystring from "querystring";

type Response = {
  status: string;
  statuscode: number;
  statustext: string;
  messageack: {
    guids: [
      {
        guid: string;
        submitdate: string;
        id: string;
      }
    ];
  };
};

async function sendWhatsapp({
  from,
  text,
  to,
  mediadata,
  password,
  userId,
}: {
  from: string;
  to: string;
  text: string;
  mediadata?: string;
  userId: string;
  password: string;
}): Promise<Response> {
  const baseUrl = "https://103.229.250.150/unified/v2/send";

  const payload = {
    apiver: "1.0",
    whatsapp: {
      ver: "2.0",
      dlr: {
        url: "",
      },
      messages: [
        {
          coding: 1,
          id: "22",
          msgtype: 3,
          b_urlinfo: "",
          type: "image~invoice",
          contenttype: "image/png",
          mediadata: "",
          templateinfo: "1570023",
          text: "",
          addresses: [
            {
              seq: "",
              to,
              from,
              tag: "",
            },
          ],
        },
      ],
    },
  };

  if (mediadata) {
    payload.whatsapp.messages[0].mediadata = mediadata;
  }

  try {
    const response = await axios.post(baseUrl, payload, {
      headers: {
        "x-client-id": userId,
        "x-client-password": password,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error sending SMS:", error?.message);
    throw error;
  }
}

export default sendWhatsapp;
