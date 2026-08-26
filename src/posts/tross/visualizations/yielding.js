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
import { Task } from "@lit/task";
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";
let TrossYieldingVisualizationElement = (() => {
    let _classDecorators = [customElement("bb-tross-yielding-visualization")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = LitElement;
    let _animateInterval_decorators;
    let _animateInterval_initializers = [];
    let _animateInterval_extraInitializers = [];
    let _recordsPerTask_decorators;
    let _recordsPerTask_initializers = [];
    let _recordsPerTask_extraInitializers = [];
    let _tasks_decorators;
    let _tasks_initializers = [];
    let _tasks_extraInitializers = [];
    let _highlight_decorators;
    let _highlight_initializers = [];
    let _highlight_extraInitializers = [];
    var TrossYieldingVisualizationElement = _classThis = class extends _classSuper {
        constructor() {
            super();
            // Props
            this.animateInterval = __runInitializers(this, _animateInterval_initializers, void 0);
            this.recordsPerTask = (__runInitializers(this, _animateInterval_extraInitializers), __runInitializers(this, _recordsPerTask_initializers, void 0));
            // State
            this.tasks = (__runInitializers(this, _recordsPerTask_extraInitializers), __runInitializers(this, _tasks_initializers, void 0));
            this.highlight = (__runInitializers(this, _tasks_extraInitializers), __runInitializers(this, _highlight_initializers, void 0));
            // Attributes
            this.readRecordTask = __runInitializers(this, _highlight_extraInitializers);
            this.animateInterval = 500;
            this.recordsPerTask = 5;
            this.tasks = [
                {
                    type: "complete",
                    totalRecords: 3,
                    readRecords: 0
                },
                {
                    type: "pending"
                },
                {
                    type: "complete",
                    totalRecords: 5,
                    readRecords: 0
                }
            ];
            this.readRecordTask = new Task(this, {
                task: (_a, _b) => __awaiter(this, [_a, _b], void 0, function* ([toRead, animateInterval], { signal }) {
                    for (const [taskIndex, task] of this.tasks.entries()) {
                        console.log(`animating to task #${taskIndex}`);
                        this.highlight = {
                            taskIndex
                        };
                        yield new Promise(resolve => setTimeout(resolve, animateInterval));
                        this.highlight = undefined;
                        if (signal.aborted) {
                            return;
                        }
                        if (task.type === "pending") {
                            console.log("ending animation because encountered pending");
                            return;
                        }
                        while (toRead !== 0 && (task.totalRecords - task.readRecords) !== 0) {
                            toRead--;
                            task.readRecords++;
                            this.highlight = {
                                taskIndex,
                                recordIndex: task.readRecords - 1
                            };
                            yield new Promise(resolve => setTimeout(resolve, animateInterval));
                        }
                        // Bad state management - but works good enough for now.
                        this.tasks = [...this.tasks];
                        this.highlight = undefined;
                        if (toRead === 0) {
                            console.log("completed - bailing out");
                            return;
                        }
                    }
                }),
                onError: (error) => {
                    console.error("failed to animate", error);
                }
            });
        }
        render() {
            return html `
            <div class="tasks">
                ${map(this.tasks, (task, index) => this.renderTask(task, index))}
            </div>
            <div id="controls">
                <button @click=${() => {
                this.readRecordTask.run([1, this.animateInterval]);
            }}>Read</button>
                <button @click=${() => {
                this.tasks = [
                    ...this.tasks,
                    {
                        type: "pending"
                    }
                ];
            }}>Add task</button>
            </div>
        `;
        }
        renderTask(task, taskIndex) {
            var _a;
            return html `
            <div
                class="task"
                ?data-highlighted=${((_a = this.highlight) === null || _a === void 0 ? void 0 : _a.taskIndex) === taskIndex && this.highlight.recordIndex === undefined}
            >
                <span>Task #${taskIndex}</span>
                ${task.type === "complete" ? html `
                    <div class="records">
                        ${map(range(task.totalRecords), index => { var _a; return html `
                            <div
                                class="record"
                                ?data-read=${index < task.readRecords}
                                ?data-highlighted=${((_a = this.highlight) === null || _a === void 0 ? void 0 : _a.taskIndex) === taskIndex && this.highlight.recordIndex === index}
                            ></div>
                        `; })}
                    </div>
                ` : html `
                    <span>Pending</span>
                    <button
                        type="button"
                        @click=${() => {
                this.tasks[taskIndex] = {
                    type: "complete",
                    totalRecords: this.recordsPerTask,
                    readRecords: 0
                };
                // State hack, yay!
                this.tasks = [...this.tasks];
            }}
                    >Resolve</button>
                `}
            </div>
        `;
        }
    };
    __setFunctionName(_classThis, "TrossYieldingVisualizationElement");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _animateInterval_decorators = [property({ type: Number })];
        _recordsPerTask_decorators = [property({ type: Number })];
        _tasks_decorators = [state()];
        _highlight_decorators = [state()];
        __esDecorate(null, null, _animateInterval_decorators, { kind: "field", name: "animateInterval", static: false, private: false, access: { has: obj => "animateInterval" in obj, get: obj => obj.animateInterval, set: (obj, value) => { obj.animateInterval = value; } }, metadata: _metadata }, _animateInterval_initializers, _animateInterval_extraInitializers);
        __esDecorate(null, null, _recordsPerTask_decorators, { kind: "field", name: "recordsPerTask", static: false, private: false, access: { has: obj => "recordsPerTask" in obj, get: obj => obj.recordsPerTask, set: (obj, value) => { obj.recordsPerTask = value; } }, metadata: _metadata }, _recordsPerTask_initializers, _recordsPerTask_extraInitializers);
        __esDecorate(null, null, _tasks_decorators, { kind: "field", name: "tasks", static: false, private: false, access: { has: obj => "tasks" in obj, get: obj => obj.tasks, set: (obj, value) => { obj.tasks = value; } }, metadata: _metadata }, _tasks_initializers, _tasks_extraInitializers);
        __esDecorate(null, null, _highlight_decorators, { kind: "field", name: "highlight", static: false, private: false, access: { has: obj => "highlight" in obj, get: obj => obj.highlight, set: (obj, value) => { obj.highlight = value; } }, metadata: _metadata }, _highlight_initializers, _highlight_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TrossYieldingVisualizationElement = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
    })();
    _classThis.styles = css `
        :host {
			border: 0.1rem solid light-dark(black, grey);
            padding: .5rem;

            display: block;
        }
        .tasks {
            display: flex;
            flex-direction: column;
            gap: .5rem;
        }
        .task {
            border: .01rem solid black;
            padding: .5rem;
            display: flex;
            flex-direction: column;
        }
        .task[data-highlighted] {
            border-color: red;
        }
        .records {
            display: flex;
            flex-wrap: wrap;
            gap: .1rem;
        }
        .record {
            --size: 1rem;
            height: var(--size);
            width: var(--size);
            background: grey;
            border: .01rem solid transparent;
        }
        .record[data-read] {
            background: green;
        }
        .record[data-highlighted] {
            border-color: red;
        }
    `;
    (() => {
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TrossYieldingVisualizationElement = _classThis;
})();
export { TrossYieldingVisualizationElement };
