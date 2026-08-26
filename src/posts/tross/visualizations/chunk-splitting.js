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
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
let TrossChunkSplittingVisualizationElement = (() => {
    let _classDecorators = [customElement("bb-tross-chunk-splitting-visualization")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LitElement;
    let _text_decorators;
    let _text_initializers = [];
    let _text_extraInitializers = [];
    let _idealChunkSize_decorators;
    let _idealChunkSize_initializers = [];
    let _idealChunkSize_extraInitializers = [];
    let _updateInterval_decorators;
    let _updateInterval_initializers = [];
    let _updateInterval_extraInitializers = [];
    var TrossChunkSplittingVisualizationElement = _classThis = class extends _classSuper {
        constructor() {
            super();
            // Props
            this.text = __runInitializers(this, _text_initializers, void 0);
            this.idealChunkSize = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _idealChunkSize_initializers, void 0));
            this.updateInterval = (__runInitializers(this, _idealChunkSize_extraInitializers), __runInitializers(this, _updateInterval_initializers, void 0));
            // Elements
            this.textRef = __runInitializers(this, _updateInterval_extraInitializers);
            this.text = "";
            this.idealChunkSize = 10;
            this.updateInterval = 500;
            this.textRef = createRef();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.animateTask = new Task(this, {
                args: () => {
                    return [this.text, this.idealChunkSize];
                },
                task: (_a, _b) => __awaiter(this, [_a, _b], void 0, function* ([text, idealChunkSize], { signal }) {
                    yield this.loopAnimation(text, idealChunkSize, signal);
                }),
                onError: (error) => {
                    console.error("failed to animate", error);
                },
                autoRun: !reduceMotion
            });
        }
        render() {
            return html `
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
        loopAnimation(text, idealChunkSize, signal) {
            return __awaiter(this, void 0, void 0, function* () {
                const highlightIds = ["chunk-selection-0", "chunk-selection-1"];
                const highlights = highlightIds.map(id => {
                    let highlight = CSS.highlights.get(id);
                    if (highlight !== undefined) {
                        return highlight;
                    }
                    highlight = new Highlight();
                    CSS.highlights.set(id, highlight);
                    return highlight;
                });
                while (true) {
                    let chunkIndex = 0;
                    let chunkStartIndex = 0;
                    const ranges = [];
                    // Each chunk here
                    while (true) {
                        let cursorIndex = chunkStartIndex;
                        const highlight = highlights[chunkIndex % highlights.length];
                        const range = new Range();
                        highlight.add(range);
                        ranges.push(range);
                        const textNode = this.getTextNode();
                        if (textNode !== undefined) {
                            range.setStart(textNode, chunkStartIndex);
                        }
                        // First skip over to the ideal size
                        cursorIndex += idealChunkSize;
                        const characterAtIndex = text[cursorIndex];
                        if (characterAtIndex === "\n" || characterAtIndex === undefined) {
                            const textNode = this.getTextNode();
                            if (textNode !== undefined) {
                                range.setEnd(textNode, text.length);
                            }
                            chunkIndex++;
                            break;
                        }
                        yield new Promise(resolve => setTimeout(resolve, this.updateInterval));
                        if (signal.aborted) {
                            break;
                        }
                        cursorIndex++;
                        // Go character by character until we hit a newline
                        while (true) {
                            const characterAtIndex = text[cursorIndex];
                            if (characterAtIndex === "\n" || characterAtIndex === undefined) {
                                break;
                            }
                            const textNode = this.getTextNode();
                            if (textNode !== undefined) {
                                range.setEnd(textNode, cursorIndex + 1);
                            }
                            yield new Promise(resolve => setTimeout(resolve, this.updateInterval));
                            cursorIndex++;
                        }
                        chunkIndex++;
                        chunkStartIndex = cursorIndex;
                    }
                    yield new Promise(resolve => setTimeout(resolve, this.updateInterval));
                    for (const range of ranges) {
                        for (const highlight of highlights) {
                            highlight.delete(range);
                        }
                    }
                    if (signal.aborted) {
                        break;
                    }
                }
            });
        }
        getTextNode() {
            const textElement = this.textRef.value;
            if (textElement === undefined) {
                return undefined;
            }
            return textElement.childNodes[1];
        }
    };
    __setFunctionName(_classThis, "TrossChunkSplittingVisualizationElement");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _text_decorators = [property({ type: String })];
        _idealChunkSize_decorators = [property({ type: Number })];
        _updateInterval_decorators = [property()];
        __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: obj => "text" in obj, get: obj => obj.text, set: (obj, value) => { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
        __esDecorate(null, null, _idealChunkSize_decorators, { kind: "field", name: "idealChunkSize", static: false, private: false, access: { has: obj => "idealChunkSize" in obj, get: obj => obj.idealChunkSize, set: (obj, value) => { obj.idealChunkSize = value; } }, metadata: _metadata }, _idealChunkSize_initializers, _idealChunkSize_extraInitializers);
        __esDecorate(null, null, _updateInterval_decorators, { kind: "field", name: "updateInterval", static: false, private: false, access: { has: obj => "updateInterval" in obj, get: obj => obj.updateInterval, set: (obj, value) => { obj.updateInterval = value; } }, metadata: _metadata }, _updateInterval_initializers, _updateInterval_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrossChunkSplittingVisualizationElement = _classThis = _classDescriptor.value;
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
		code {
			background: #262626;
			padding: 1rem;
			color: white;
			white-space: pre;
		}
		::highlight(chunk-selection-0) {
			background: red;
		}
		::highlight(chunk-selection-1) {
			background: blue;
		}
	`;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrossChunkSplittingVisualizationElement = _classThis;
})();
export { TrossChunkSplittingVisualizationElement };
