"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_packet_1 = __importDefault(require("dns-packet"));
const net_1 = __importDefault(require("net"));
class DnsClient {
    constructor(host = '8.8.8.8') {
        this.expectedLength = 0;
        this.host = host;
    }
    resolve(name, type) {
        let response = null;
        return new Promise((resolve, reject) => {
            let result = {};
            const buf = dns_packet_1.default.streamEncode({
                type: 'query',
                id: this.getRandomInt(1, 65534),
                flags: dns_packet_1.default.RECURSION_DESIRED,
                questions: [{
                        type,
                        name
                    }]
            });
            const client = new net_1.default.Socket();
            client.connect(53, this.host, () => {
                console.log('Connected');
                client.write(buf);
            });
            client.on('data', (data) => {
                console.log('Received response: %d bytes', data.byteLength);
                if (response == null) {
                    if (data.byteLength > 1) {
                        const plen = data.readUInt16BE(0);
                        this.expectedLength = plen;
                        if (plen < 12) {
                            reject('below DNS minimum packet length');
                        }
                        response = Buffer.from(data);
                    }
                }
                else {
                    response = Buffer.concat([response, data]);
                }
                if (response.byteLength >= this.expectedLength) {
                    result = dns_packet_1.default.streamDecode(response);
                    client.destroy();
                }
            });
            client.on('close', () => {
                console.log('Connection closed');
                resolve(result);
            });
        });
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
exports.DnsClient = DnsClient;
//# sourceMappingURL=dnsclient.js.map