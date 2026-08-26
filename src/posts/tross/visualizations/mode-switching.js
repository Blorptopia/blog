var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { Task, TaskStatus } from "@lit/task";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
let TrossModeSwitchingVisualizationElement = (() => {
    let _classDecorators = [customElement("bb-tross-mode-switching-visualization")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LitElement;
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    let _updateInterval_decorators;
    let _updateInterval_initializers = [];
    let _updateInterval_extraInitializers = [];
    let _parserMode_decorators;
    let _parserMode_initializers = [];
    let _parserMode_extraInitializers = [];
    var TrossModeSwitchingVisualizationElement = _classThis = class extends _classSuper {
        constructor() {
            super();
            // Props
            this.text = __runInitializers(this, _text_initializers, void 0);
            this.updateInterval = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _updateInterval_initializers, void 0));
            // State
            this.parserMode = (__runInitializers(this, _updateInterval_extraInitializers), __runInitializers(this, _parserMode_initializers, "normal"));
            // Elements
            this.textRef = __runInitializers(this, _parserMode_extraInitializers);
            this.text = "";
            this.updateInterval = 100;
            this.textRef = createRef();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.animateTask = new Task(this, {
                args: () => [this.text],
                task: (_a, _b) => __awaiter(this, [_a, _b], void 0, function* ([text], { signal }) {
                    yield this.loopAnimation(text, signal);
                }),
                onError: (error) => {
                    console.error("failed to animate", error);
                },
                autoRun: !reduceMotion
            });
        }
        render() {
            return html `
			<div id="mode-pill">
				<span id="active-mode" data-mode=${this.parserMode}>
					${this.parserMode}
				</span>
				<span>mode</span>
			</div>
			<code ${ref(this.textRef)}>${this.text}</code>
			<button
				id="play-visualization"
				?hidden=${this.animateTask.status !== TaskStatus.INITIAL}
				@click=${() => {
                this.animateTask.run();
            }}
			>
				Play visualization
			</button>
		`;
        }
        loopAnimation(text, signal) {
            return __awaiter(this, void 0, void 0, function* () {
                const highlightId = "parser-cursor";
                let highlight = CSS.highlights.get(highlightId);
                if (highlight === undefined) {
                    highlight = new Highlight();
                    CSS.highlights.set(highlightId, highlight);
                }
                let characterIndex = 0;
                let cursorRange = undefined;
                this.parserMode = "normal";
                while (true) {
                    if (cursorRange !== undefined) {
                        highlight.delete(cursorRange);
                        cursorRange = undefined;
                    }
                    if (signal.aborted) {
                        return;
                    }
                    const characterAtIndex = text[characterIndex];
                    if (characterAtIndex === undefined) {
                        characterIndex = 0;
                        this.parserMode = "normal";
                        yield new Promise(resolve => setTimeout(resolve, this.updateInterval));
                        continue;
                    }
                    const nextCharacter = text[characterIndex + 1];
                    const isEscapedQuote = characterAtIndex === "\"" && nextCharacter === "\"" && this.parserMode === "escaped";
                    if (!isEscapedQuote && characterAtIndex === "\"") {
                        if (this.parserMode === "normal") {
                            this.parserMode = "escaped";
                        }
                        else {
                            this.parserMode = "normal";
                        }
                    }
                    // Update the highlight to select the currely processing character
                    const textElement = this.textRef.value;
                    if (textElement !== undefined) {
                        const textElementTextNode = textElement.childNodes[1];
                        const characterRange = new Range();
                        characterRange.setStart(textElementTextNode, characterIndex);
                        characterRange.setEnd(textElementTextNode, characterIndex + 1);
                        if (isEscapedQuote) {
                            // Process the escape as one character
                            characterRange.setEnd(textElementTextNode, characterIndex + 2);
                            characterIndex++;
                        }
                        cursorRange = characterRange;
                        highlight.add(cursorRange);
                    }
                    characterIndex++;
                    yield new Promise(resolve => setTimeout(resolve, this.updateInterval));
                }
            });
        }
    };
    __setFunctionName(_classThis, "TrossModeSwitchingVisualizationElement");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _text_decorators = [property()];
        _updateInterval_decorators = [property()];
        _parserMode_decorators = [state()];
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, null, _updateInterval_decorators, { kind: "field", name: "updateInterval", static: false, private: false, access: { has: obj => "updateInterval" in obj, get: obj => obj.updateInterval, set: (obj, value) => { obj.updateInterval = value; } }, metadata: _metadata }, _updateInterval_initializers, _updateInterval_extraInitializers);
        __esDecorate(null, null, _parserMode_decorators, { kind: "field", name: "parserMode", static: false, private: false, access: { has: obj => "parserMode" in obj, get: obj => obj.parserMode, set: (obj, value) => { obj.parserMode = value; } }, metadata: _metadata }, _parserMode_initializers, _parserMode_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrossModeSwitchingVisualizationElement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = css `
		:host {
			display: flex;
			flex-direction: column;
			gap: .5rem;

			border: 0.1rem solid light-dark(black, grey);
			padding: 1rem;
		}
		#mode-pill {
			display: flex;
			background: #121212;
			color: white;
		}
		#mode-pill > * {
			display: flex;
			justify-content: center;
			padding: .5rem;
		}
		#mode-pill,#active-mode {
			width: max-content;
		}
		#active-mode[data-mode="normal"] {
			background: green;
		}
		#active-mode[data-mode="escaped"] {
			background: red;
		}
		code {
			background: #262626;
			padding: 1rem;
			color: white;
			white-space: pre;
			max-width: 100%;
			overflow-x: scroll;
		}
		::highlight(parser-cursor) {
			background: red;
		}
	`;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrossModeSwitchingVisualizationElement = _classThis;
})();
export { TrossModeSwitchingVisualizationElement };
