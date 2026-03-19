import "syntax-highlight-element";
import Theme from "syntax-highlight-element/themes/prettylights.css?raw";
import { customElement, property } from "lit/decorators.js";
import { css, html, LitElement, unsafeCSS, type CSSResultGroup, type HTMLTemplateResult, type PropertyValues } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

@customElement("bb-syntax-highlighting")
export class SyntaxHighlightingElement extends LitElement {
	public static styles?: CSSResultGroup = [
		unsafeCSS(Theme),
		css`
			:host {
				display: block;
				padding: 1rem;
				background: light-dark(#f6f8fa, #151b23);
				color-scheme: light dark;
				max-width: 100%;
				overflow-y: scroll;
			}
			syntax-highlight {
				tab-size: 8;
			}
		`
	];
	// Props
	@property({type: String})
	public language?: string;

	@property({type: String})
	public contents?: string;

	// Elements
	private highlightRef: Ref<HTMLElement>;

	public constructor() {
		super();
		this.highlightRef = createRef();
	}

	protected render(): HTMLTemplateResult {
		return html`
			<syntax-highlight ${ref(this.highlightRef)} language=${ifDefined(this.language)}></syntax-highlight>
		`;
	}
	public updated(changedProperties: PropertyValues): void {
	    super.updated(changedProperties);

		const highlightElement = this.highlightRef.value;
		if (highlightElement === undefined) {
			return;
		}
		highlightElement.textContent = this.contents?.replaceAll("\\n", "\n") ?? "";
		(highlightElement as any).update();
	}

}
