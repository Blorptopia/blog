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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import { html, LitElement, css } from "lit";
import { customElement, state } from "lit/decorators.js";
let TrossPollIteratorComparisonVisualizationElement = (() => {
    let _classDecorators = [customElement("bb-tross-poll-iterator-comparison-visualization")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LitElement;
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    let _fetchedPollingValue_decorators;
    let _fetchedPollingValue_initializers = [];
    let _fetchedPollingValue_extraInitializers = [];
    let _fetchedIteratorValue_decorators;
    let _fetchedIteratorValue_initializers = [];
    let _fetchedIteratorValue_extraInitializers = [];
    let _bufferedIteratorValue_decorators;
    let _bufferedIteratorValue_initializers = [];
    let _bufferedIteratorValue_extraInitializers = [];
    var TrossPollIteratorComparisonVisualizationElement = _classThis = class extends _classSuper {
        constructor() {
            super();
            // State
            this.createdAt = __runInitializers(this, _createdAt_initializers, void 0);
            this.fetchedPollingValue = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _fetchedPollingValue_initializers, void 0));
            this.fetchedIteratorValue = (__runInitializers(this, _fetchedPollingValue_extraInitializers), __runInitializers(this, _fetchedIteratorValue_initializers, void 0));
            this.bufferedIteratorValue = (__runInitializers(this, _fetchedIteratorValue_extraInitializers), __runInitializers(this, _bufferedIteratorValue_initializers, void 0));
            __runInitializers(this, _bufferedIteratorValue_extraInitializers);
            this.createdAt = Date.now();
            this.bufferedIteratorValue = Date.now() - this.createdAt;
        }
        render() {
            var _a, _b;
            return html `
			<table>
				<tr>
					<th>Polling</th>
					<th>Iterator</th>
				</tr>
				<tr>
					<td>
						<div class="visualizer">
							<span class="fetched-value">Fetched value: ${(_a = this.fetchedPollingValue) !== null && _a !== void 0 ? _a : "none yet"}</span>
						</div>
					</td>
					<td>
						<div class="visualizer">
							<span class="fetched-value">Fetched value: ${(_b = this.fetchedIteratorValue) !== null && _b !== void 0 ? _b : "none yet"}</span>
							<span class="buffered-value">Buffered value: ${this.bufferedIteratorValue}</span>
						</div>
					</td>
				</tr>
			</table>
			<div id="controls">
				<button
					type="button"
					@click=${() => {
                this.fetchedPollingValue = (Date.now() - this.createdAt) / 1000;
                this.fetchedIteratorValue = this.bufferedIteratorValue;
                this.bufferedIteratorValue = this.fetchedPollingValue;
            }}
				>
					Request
				</button>
				<button
					type="button"
					@click=${() => {
                this.createdAt = Date.now();
                this.fetchedPollingValue = undefined;
                this.fetchedIteratorValue = undefined;
                this.bufferedIteratorValue = (Date.now() - this.createdAt) / 1000;
            }}
				>
					Reset	
				</button>
			</div>
		`;
        }
    };
    __setFunctionName(_classThis, "TrossPollIteratorComparisonVisualizationElement");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _createdAt_decorators = [state()];
        _fetchedPollingValue_decorators = [state()];
        _fetchedIteratorValue_decorators = [state()];
        _bufferedIteratorValue_decorators = [state()];
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _fetchedPollingValue_decorators, { kind: "field", name: "fetchedPollingValue", static: false, private: false, access: { has: obj => "fetchedPollingValue" in obj, get: obj => obj.fetchedPollingValue, set: (obj, value) => { obj.fetchedPollingValue = value; } }, metadata: _metadata }, _fetchedPollingValue_initializers, _fetchedPollingValue_extraInitializers);
        __esDecorate(null, null, _fetchedIteratorValue_decorators, { kind: "field", name: "fetchedIteratorValue", static: false, private: false, access: { has: obj => "fetchedIteratorValue" in obj, get: obj => obj.fetchedIteratorValue, set: (obj, value) => { obj.fetchedIteratorValue = value; } }, metadata: _metadata }, _fetchedIteratorValue_initializers, _fetchedIteratorValue_extraInitializers);
        __esDecorate(null, null, _bufferedIteratorValue_decorators, { kind: "field", name: "bufferedIteratorValue", static: false, private: false, access: { has: obj => "bufferedIteratorValue" in obj, get: obj => obj.bufferedIteratorValue, set: (obj, value) => { obj.bufferedIteratorValue = value; } }, metadata: _metadata }, _bufferedIteratorValue_initializers, _bufferedIteratorValue_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrossPollIteratorComparisonVisualizationElement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = css `
        :host {
			border: 0.1rem solid light-dark(black, grey);
            padding: .5rem;

            display: block;
        }
		table {
			border-spacing: 1rem;
		}
		td {
			vertical-align: top;
		}
		.visualizer {
			display: flex;
			flex-direction: column;
		}
	`;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrossPollIteratorComparisonVisualizationElement = _classThis;
})();
export { TrossPollIteratorComparisonVisualizationElement };
