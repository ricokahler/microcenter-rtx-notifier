# microcenter rtx notifier

i want to play games on a computer and this is the only way i'll have a chance

**this polls microcenter for RTX cards and texts me whenever the stock changes**

if you want to use this yourself, you can deploy it with serverless.

you'll need to configure 3 things:

- `ORIGINATION_NUMBER` — an amazon pinpoint origination number. create one in the dashboard first, use a long code
- `PHONE_NUMBER` — your phone number in +15551234567) form
- `STORE_ID` — microcenter store ID. this can be found in the URL after you select a store

After a successful deploy, you'll get a text message whenever an RTX card comes back in stock. Polls every 5 minutes.
