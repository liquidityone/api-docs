from stomp.adapter.ws import WSStompConnection
from stomp.listener import ConnectionListener
from Cryptodome.Hash import SHA256
from Cryptodome.PublicKey import RSA
from Cryptodome.Signature import pkcs1_15

import base64
import logging
import time


WS_HOST = 'ws.test.liquidityone.io'
API_KEY = 'e85b1dcf-...'
# !!! make sure you store your private key securely !!!
API_SECRET = 'MIIEvgIBAD...'


# signing logic
def sign(key_id: str, secret: str, timestamp: str):
    # import the private key
    prv_key = RSA.import_key(base64.b64decode(secret))

    # create the payload
    payload = f'{key_id}{timestamp}'

    # hash the payload
    h = SHA256.new(payload.encode('utf-8'))

    # sign the hash
    signature = pkcs1_15.new(prv_key).sign(h)

    # encode the signature as base64 and return
    return base64.b64encode(signature).decode('utf-8')


# a dummy stomp.py listener
class DummyListener(ConnectionListener):

    def __init__(self, host: str, key: str, secret: str):
        self._connection = WSStompConnection(
            host_and_ports=[(host, 443)], ws_path="/stomp")
        self._connection.set_listener("DummyListener", self)
        self._connection.set_ssl([(host, 443)])

        timestamp = str(round(time.time() * 1000))
        signature = sign(key, secret, timestamp)
        headers = {
            "x-key": key,
            "x-signature": signature,
            "x-timestamp": timestamp
        }
        self._connection.connect(
            headers=headers, wait=True, with_connect_command=True)

    def subscribe(self, destination: str, id: int):
        self._connection.subscribe(destination=destination, id=id)

    def on_error(self, frame):
        logging.error(
            f"received an error (frame: {frame})")

    def on_message(self, frame):
        logging.info(f"received a message (frame: {frame})")


# logging.basicConfig(level=logging.DEBUG)
listener = DummyListener(WS_HOST, API_KEY, API_SECRET)
listener.subscribe("/topic/BTC_USDT.depth", 1)
time.sleep(3)
