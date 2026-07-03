import { createVlyIntegrations } from '@vly-ai/integrations';
const vly = createVlyIntegrations({
  deploymentToken: 'sk_6b89569c3ed39e2e541e019b6b01f8df943ebb1d97decd54db46a7b6282dec44',
  debug: true
});
async function test() {
  const res = await vly.ai.completion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: 'hello' }]
  });
  console.log(res);
}
test();
