import { Task, TaskStatus } from "@lit/task";
import { type HTMLTemplateResult, LitElement, html, type CSSResultGroup, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

@customElement("bb-tross-chunk-splitting-visualization")
export class TrossChunkSplittingVisualizationElement extends LitElement {
	// Props
	@property({type: String})
	public text: string;
	@property({type: Number})
	public idealChunkSize: number;
	@property()
	public updateInterval: number;
	
	// Elements
	private textRef: Ref<HTMLElement>;
	// Attributes
	private animateTask: Task<[string, number]>;

	public constructor() {
		super();
		this.text = "";
		this.idealChunkSize = 10;
		this.updateInterval = 200;

		this.textRef = createRef();

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		this.animateTask = new Task(this, {
			args: () => {
				return [this.text, this.idealChunkSize] as const
			},
			task: async ([text, idealChunkSize], {signal}) => {
				await this.loopAnimation(text, idealChunkSize, signal);	
			},
			onError: (error) => {
				console.error("failed to animate", error);
			},
			autoRun: !reduceMotion
		});
	}
	protected render(): HTMLTemplateResult {
	   	return html`
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

	private async loopAnimation(text: string, idealChunkSize: number, signal: AbortSignal): Promise<void> {
		const highlightIds: string[] = ["chunk-selection-0", "chunk-selection-1"];
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
			const ranges: AbstractRange[] = [];
			
			// Each chunk here
			while (true) {
				let cursorIndex = chunkStartIndex;
				const highlight = highlights[chunkIndex % highlights.length]!;
				const range = new Range();
				highlight.add(range);
				ranges.push(range);
				const textNode = this.getTextNode();
				if (textNode !== undefined) {
					range.setStart(textNode, chunkStartIndex);
				}

				// First skip over to the ideal size
				cursorIndex += idealChunkSize;

				const characterAtIndex = text[cursorIndex]!;
				if (characterAtIndex === "\n" || characterAtIndex === undefined) {
					const textNode = this.getTextNode();
					if (textNode !== undefined) {
						range.setEnd(textNode, text.length);
					}
					chunkIndex++;
					break;
				}
				await new Promise<void>(resolve => setTimeout(resolve, this.updateInterval));
				if (signal.aborted) {
					break;
				}

				// Go character by character until we hit a newline
				while (true) {
					const characterAtIndex = text[cursorIndex]!;
					if (characterAtIndex === "\n" || characterAtIndex === undefined) {
						break;
					}
					const textNode = this.getTextNode();
					if (textNode !== undefined) {
						range.setEnd(textNode, cursorIndex + 1);
					}
					await new Promise<void>(resolve => setTimeout(resolve, this.updateInterval));
					cursorIndex++;
				}

				chunkIndex++;
				chunkStartIndex = cursorIndex;
				await new Promise<void>(resolve => setTimeout(resolve, this.updateInterval));
			}
			await new Promise<void>(resolve => setTimeout(resolve, this.updateInterval));
			for (const range of ranges) {
				for (const highlight of highlights) {
					highlight.delete(range);
				}
			}
			if (signal.aborted) {
				break;
			}
		}
	}
	private getTextNode(): Node | undefined {
		const textElement = this.textRef.value!;
		return textElement.childNodes[1];
	}
	static styles?: CSSResultGroup = css`
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
}
