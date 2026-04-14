import { Task } from "@lit/task";
import { css, html, LitElement, type CSSResultGroup, type HTMLTemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { range } from "lit/directives/range.js";

@customElement("bb-tross-yielding-visualization")
export class TrossYieldingVisualizationElement extends LitElement {
    // Props
    @property({type: Number})
    public animateInterval: number;
    @property({type: Number})
    public recordsPerTask: number;
    // State
    @state()
    private tasks: TrossTask[];
    @state()
    private highlight?: Highlight;

    // Attributes
    private readRecordTask: Task<[number, number], void>;

    public constructor() {
        super();
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
            task: async ([toRead, animateInterval], {signal}) => {
                for (const [taskIndex, task] of this.tasks.entries()) {
                    console.log(`animating to task #${taskIndex}`);
                    this.highlight = {
                        taskIndex
                    };
                    await new Promise(resolve => setTimeout(resolve, animateInterval));
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
                        await new Promise(resolve => setTimeout(resolve, animateInterval));
                    }
                    // Bad state management - but works good enough for now.
                    this.tasks = [...this.tasks];
                    this.highlight = undefined;
                    if (toRead === 0) {
                        console.log("completed - bailing out");
                        return;
                    }
                }
            },
            onError: (error) => {
                console.error("failed to animate", error);
            }
        })
    }

    protected render(): HTMLTemplateResult {
        return html`
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
                    ]
                }}>Add task</button>
            </div>
        `;
    }
    private renderTask(task: TrossTask, taskIndex: number): HTMLTemplateResult {
        return html`
            <div
                class="task"
                ?data-highlighted=${this.highlight?.taskIndex === taskIndex && this.highlight.recordIndex === undefined}
            >
                <span>Task #${taskIndex}</span>
                ${task.type === "complete" ? html`
                    <div class="records">
                        ${map(range(task.totalRecords), index => html`
                            <div
                                class="record"
                                ?data-read=${index < task.readRecords}
                                ?data-highlighted=${this.highlight?.taskIndex === taskIndex && this.highlight.recordIndex === index}
                            ></div>
                        `)}
                    </div>
                ` : html`
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
    static styles?: CSSResultGroup = css`
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
}

type TrossTask = {
    type: "pending"
} | {
    type: "complete";
    totalRecords: number;
    readRecords: number;
};

type Highlight = {
    taskIndex: number;
    recordIndex?: number;
};