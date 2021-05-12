import { html, useState, useRef, useEffect, useCallback } from './modules.js'
import { debounce, encodePayload, decodePayload } from './utils.js'

const HTML_TEXT = '<div id="app">hello world</div>'
const CSS_TEXT = '#app { color: blue; }'
const SCRIPT_TEXT = 'console.log("hello")'

export default function App(props) {

    const [editorType, setEditorType] = useState('HTML')
    const [htmlText, setHtmlText] = useState(HTML_TEXT)
    const [cssText, setCssText] = useState(CSS_TEXT)
    const [scriptText, setScriptText] = useState(SCRIPT_TEXT)
    const [payload, setPayload] = useState('')
    const inputRef = useRef()

    const setPayloadDebounce = useCallback(debounce(setPayload, 500), [])

    function reloadInputText(type, text) {
        if (!text) {
            text = { htmlText, cssText, scriptText }
        }
        switch (type) {
            case 'HTML':
                inputRef.current.innerText = text.htmlText
                break
            case 'CSS':
                inputRef.current.innerText = text.cssText
                break
            case 'JavaScript':
                inputRef.current.innerText = text.scriptText
                break
        }
    }

    useEffect(() => {
        const payload = new URLSearchParams(location.search).get('p')
        const text = decodePayload(payload)
        if (text) {
            setHtmlText(text.htmlText)
            setCssText(text.cssText)
            setScriptText(text.scriptText)
            reloadInputText(editorType, text)
        } else {
            reloadInputText(editorType)
        }
    }, [])

    useEffect(() => {
        const payload = encodePayload({
            htmlText,
            cssText,
            scriptText,
        })
        setPayloadDebounce(payload)
        window.history.pushState('', '', '?p=' + payload);
    }, [htmlText, cssText, scriptText])

    function handleSelectEditorType(ev) {
        setEditorType(ev.target.value)
        reloadInputText(ev.target.value)
    }

    function handleInputText(ev) {
        const text = ev.target.innerText
        switch (editorType) {
            case 'HTML':
                setHtmlText(text)
                break
            case 'CSS':
                setCssText(text)
                break
            case 'JavaScript':
                setScriptText(text)
                break
        }
    }

    function handleReset() {
        setHtmlText(HTML_TEXT)
        setCssText(CSS_TEXT)
        setScriptText(SCRIPT_TEXT)
        reloadInputText(editorType, {
            htmlText: HTML_TEXT,
            cssText: CSS_TEXT,
            scriptText: SCRIPT_TEXT,
        })
    }

    return html`
        <div class="flex p-1 gap-1 h-screen flex-col md:flex-row">
            <div class="flex-auto md:w-1/2 border p-1">
                <div>
                    <label class=${'border py-0.5 px-2 cursor-pointer' + (editorType === 'HTML' ? ' bg-blue-400 text-white' : '')}>
                        HTML
                        <input onInput=${handleSelectEditorType} class="hidden" type="radio"
                               checked=${editorType === 'HTML'} name="editorType" value="HTML" />
                    </label>
                    <label class=${'border py-0.5 px-2 ml-1 cursor-pointer' + (editorType === 'CSS' ? ' bg-blue-400 text-white' : '')}>
                        CSS
                        <input onInput=${handleSelectEditorType} class="hidden" type="radio"
                               checked=${editorType === 'CSS'} name="editorType" value="CSS" />
                    </label>
                    <label class=${'border py-0.5 px-2 ml-1 cursor-pointer' + (editorType === 'JavaScript' ? ' bg-blue-400 text-white' : '')}>
                        JavaScript
                        <input onInput=${handleSelectEditorType} class="hidden" type="radio"
                               checked=${editorType === 'JavaScript'} name="editorType" value="JavaScript" />
                    </label>
                    <span onCLick=${handleReset} class="cursor-pointer bg-red-400 text-white border py-0.5 px-2 ml-2">RESET</span>
                </div>
                <!--suppress HtmlUnknownAttribute -->
                <div ref=${inputRef} contentEditable="true" onInput=${handleInputText}
                     class="border mt-1 outline-none whitespace-nowrap overflow-auto"
                     style="height: calc(100% - 1.75rem)">
                </div>
            </div>
            <div class="flex-auto md:w-1/2 border">
                <iframe id="preview" class="w-full h-full" src=${'./preview.html?p=' + payload}></iframe>
            </div>
        </div>
    `
}
