const key = process.env.STRIPE_SECRET_KEY;
const webhook = process.env.WEBHOOK_SECRET;
console.log(Boolean(key && webhook));
