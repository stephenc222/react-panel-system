import * as maximizePanel from "./maximizePanel"
// @ponicode
describe("maximizePanel.maximizePanel", () => {
    test("0", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("http://www.example.com/route/123?foo=bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("https://api.telegram.org/bot")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("https://croplands.org/app/a/confirm?t=")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("https://accounts.google.com/o/oauth2/revoke?token=%s")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("ponicode.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            maximizePanel.maximizePanel("")
        }
    
        expect(callFunction).not.toThrow()
    })
})
