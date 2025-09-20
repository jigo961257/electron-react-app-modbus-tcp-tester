import { z } from 'zod'

export const modbusIpcSchema = {
  // Connect to Modbus TCP server
  'modbus-connect': {
    args: z.tuple([
      z.object({
        host: z.string(),
        port: z.number(),
      }),
    ]),
    return: z.boolean(),
  },
  // Disconnect from Modbus TCP server
  'modbus-disconnect': {
    args: z.tuple([]),
    return: z.boolean(),
  },
  // Read holding registers
  'modbus-read-holding-registers': {
    args: z.tuple([
      z.object({
        address: z.number(),
        length: z.number(),
      }),
    ]),
    return: z.array(z.number()),
  },
  // Write single register
  'modbus-write-single-register': {
    args: z.tuple([
      z.object({
        address: z.number(),
        value: z.number(),
      }),
    ]),
    return: z.boolean(),
  },
}