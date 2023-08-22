import { subtle } from "crypto";
import { RxStomp } from "@stomp/rx-stomp"
import { WebSocket } from 'ws'

// polyfill websocket for nodejs
Object.assign(global, { WebSocket })

const WS_URL = 'wss://ws.test.liquidityone.io/stomp'
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


const timestamp = new Date().getTime()
const rxStomp = new RxStomp()
rxStomp.configure({
    brokerURL: WS_URL,
    connectHeaders: {
        'x-key': API_KEY,
        'x-signature': await sign(API_KEY, API_SECRET, timestamp),
        'x-timestamp': timestamp
    },
    // debug: (msg) => console.log(msg)
})
rxStomp.activate()

const subscription = rxStomp
    .watch({ destination: "/topic/BTC_USDT.depth" })
    .subscribe((message) => console.log(message.body))
