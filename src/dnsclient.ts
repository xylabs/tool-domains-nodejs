import { RecordType, RECURSION_DESIRED, streamDecode, streamEncode } from 'dns-packet'
import net from 'net'

export class DnsClient {
  private host: string

  private expectedLength = 0

  constructor(host = '8.8.8.8') {
    this.host = host
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async resolve(name: string, type: RecordType) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let response: any = null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await new Promise<any>((resolve, reject) => {
      let result = {}
      const buf = streamEncode({
        flags: RECURSION_DESIRED,
        id: this.getRandomInt(1, 65534),
        questions: [
          {
            name,
            type,
          },
        ],
        type: 'query',
      })

      const client = new net.Socket()
      client.connect(53, this.host, () => {
        client.write(buf)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          result = streamDecode(response)
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
