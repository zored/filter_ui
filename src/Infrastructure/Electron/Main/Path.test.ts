import {Path} from "./Path"
import assert from "node:assert/strict"
import test from "node:test"

test('retrievers correct path', () => {
    assert.ok(Path.getAbsolute('package.json'))
})
test('throws error on incorrect path', () => {
    assert.throws(() => Path.getAbsolute('no-file'), Error)
})
