async function test() {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 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`,
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "hello" }],
    }),
  });
  const data = await response.json();
  console.log(data);
}
test();
