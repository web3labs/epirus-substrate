import Ajv from "ajv"
import schema from "./ink-v4-schema.json"
import { InkProjectV4 } from "./interfaces"


const ajv = new Ajv({
    messages: true,
    removeAdditional: false
})


ajv.addFormat('uint8', function (data: number | string): boolean {
    return uint(data) && data < Math.pow(2, 8)
})


ajv.addFormat('uint32', function (data: number | string): boolean {
    return uint(data) && data < Math.pow(2, 32)
})


ajv.addFormat('uint64', uint)


function uint(data: number | string): data is number {
    return typeof data == 'number' && Number.isSafeInteger(data) && data >= 0
}


const validator = ajv.compile<InkProjectV4>(schema)


export function getInkProject(abi: unknown): InkProjectV4 {
    if (validator(abi)) {
        if ('version' in abi && abi.version === "4") {
            return abi
        } else {
            throw new Error(`Only V4 Ink metadata is supported`)
        }
    } else {
        let msg = `Invalid Ink metadata`
        if (validator.errors?.length) {
            msg += ':'
            validator.errors.forEach(err => {
                msg += `\n\tmetadata${err.instancePath} ${err.message}`
            })
        }
        throw new Error(msg)
    }
}
