import axios from "axios";
import querystring from "querystring";

type Response = [[string, string, string | "Sent", number]];

async function sendSms({
  token,
  credit,
  sender,
  message,
  number,
  templateid,
}: {
  token: string;
  credit: string;
  sender: string;
  message: string;
  number: string;
  templateid: string;
}): Promise<Response> {
  const baseUrl = "http://pay4sms.in/sendsms/";
  const queryParams = querystring.stringify({
    token,
    credit,
    sender,
    message,
    number,
    templateid,
  });

  const url = `${baseUrl}?${queryParams}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error sending SMS:", error?.message);
    throw error;
  }
}

export default sendSms;
