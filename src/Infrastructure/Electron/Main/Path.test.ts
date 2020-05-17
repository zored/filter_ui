import {Path} from "./Path"

test('retrievers correct path', () => {
    expect(Path.getAbsolute('package.json')).toBeDefined()
})
test('throws error on incorrect path', () => {
    expect(() => Path.getAbsolute('no-file')).toThrow(Error)
})
