import { subtle } from "crypto";


const REST_URL = 'https://api.liquidityone.io'
const API_KEY = 'e85b1dcf-...'
// !!! make sure you store your private key securely !!!
const API_SECRET = 'MIIEvgIBAD...'


// signing logic
const sign = async (keyId, secret, timestamp) => {
    // import the private key
    const prvKey = await subtle.importKey(
        'pkcs8',
        Buffer.from(secret, 'base64'),
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    // create the payload
    const payload = keyId + timestamp;

    // sign the payload
    const signature = await subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        prvKey,
        Buffer.from(payload, 'utf8')
    );

    // encode the signature as base64 and return
    return Buffer.from(signature).toString('base64')
}


// get user info
const timestamp = new Date().getTime()
const res = await fetch(REST_URL + "/me", {
    method: 'GET',
    headers: {
        'x-key': API_KEY,
        'x-signature': await sign(API_KEY, API_SECRET, timestamp),
        'x-timestamp': timestamp
    }
})
console.log(await res.json())
