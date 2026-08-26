import { Task, TaskStatus } from "@lit/task";
import { css, html, LitElement, type CSSResultGroup, type HTMLTemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";


@customElement("bb-tross-mode-switching-visualization")
export class TrossModeSwitchingVisualizationElement extends LitElement {
	// Props
	@property()
	public text: string;
	@property()
	public updateInterval: number;

	// State
	@state()
	private parserMode: ParserMode = "normal";

	// Elements
	private textRef: Ref<HTMLElement>;

	// Attributes
	private animateTask: Task<[string]>;

	public constructor() {
		super();
		this.text = "";
		this.updateInterval = 100;
		
		this.textRef = createRef();
		
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		this.animateTask = new Task(this, {
			args: () => [this.text] as const,
			task: async ([text], {signal}) => {
				await this.loopAnimation(text, signal);	
			},
			onError: (error) => {
				console.error("failed to animate", error);
			},
			autoRun: !reduceMotion
		});
	}
	protected render(): HTMLTemplateResult {
		return html`
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
	private async loopAnimation(text: string, signal: AbortSignal): Promise<void> {
		const highlightId = "parser-cursor";
		let highlight = CSS.highlights.get(highlightId);
		if (highlight === undefined) {
			highlight = new Highlight();
			CSS.highlights.set(highlightId, highlight);
		}

		let characterIndex: number = 0;
		let cursorRange: AbstractRange | undefined = undefined;
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
				await new Promise(resolve => setTimeout(resolve, this.updateInterval));
				continue;
			}
			const nextCharacter = text[characterIndex + 1];
			const isEscapedQuote = characterAtIndex === "\"" && nextCharacter === "\"" && this.parserMode === "escaped";
			if (!isEscapedQuote && characterAtIndex === "\"") {
				if (this.parserMode === "normal") {
					this.parserMode = "escaped";
				} else {
					this.parserMode = "normal";
				}
			}
			
			// Update the highlight to select the currely processing character
			const textElement = this.textRef.value;
			if (textElement !== undefined) {
				const textElementTextNode = textElement.childNodes[1]!;
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
			await new Promise(resolve => setTimeout(resolve, this.updateInterval));
		}
	}

	static styles?: CSSResultGroup = css`
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
}

type ParserMode = "normal" | "escaped";
