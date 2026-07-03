async function test() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "hello" }],
      max_tokens: 50,
    }),
  });
  const data = await response.json();
  console.log(data);
}
test();
