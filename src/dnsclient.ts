import dnsPacket from 'dns-packet'
import net from 'net'

export class DnsClient {
  private host: string

  private expectedLength = 0

  constructor(host = '8.8.8.8') {
    this.host = host
  }

  public resolve(name: string, type: string): Promise<any> {
    let response: any = null
    return new Promise((resolve, reject) => {
      let result = {}
      const buf = dnsPacket.streamEncode({
        type: 'query',
        id: this.getRandomInt(1, 65534),
        flags: dnsPacket.RECURSION_DESIRED,
        questions: [{
          type,
          name,
        }],
      })

      const client = new net.Socket()
      client.connect(53, this.host, () => {
        client.write(buf)
      })

      client.on('data', (data: any) => {
        if (response == null) {
          if (data.byteLength > 1) {
            const plen = data.readUInt16BE(0)
            this.expectedLength = plen
            if (plen < 12) {
              reject('below DNS minimum packet length')
            }
            response = Buffer.from(data)
          }
        } else {
          response = Buffer.concat([response, data])
        }

        if (response.byteLength >= this.expectedLength) {
          result = dnsPacket.streamDecode(response)
          client.destroy()
        }
      })

      client.on('close', () => {
        resolve(result)
      })
    })
  }

  private getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
