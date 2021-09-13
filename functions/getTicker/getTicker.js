// getIpInfo.js
const fetch = require("node-fetch");
// const validator = require("validator");

exports.handler = async (event, context) => {
  const eventBody = JSON.parse(event.body);

  // Check for IP Address or domain
  let extension = "";
  if (eventBody.searchTerm) {
    const { searchTerm } = eventBody;
    extension = `&ids=${searchTerm}`;
  }

  try {
    const res = await fetch(`https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_NOMICS_API_KEY}&ids=${extension}`);
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ data }) };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed fetching data" }),
    };
  }
};