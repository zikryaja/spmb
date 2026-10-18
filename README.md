# spmb

Admin and principal dashboard access uses a signed, HTTP-only session cookie.
Set `SESSION_SECRET` in `.env.local` to a randomly generated value of at least
32 characters (for example, generate one with
`node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`).