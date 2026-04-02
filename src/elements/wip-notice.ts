import { css, type CSSResultGroup, html, type HTMLTemplateResult, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("bb-wip-notice")
export class WIPNoticeElement extends LitElement {
	static styles?: CSSResultGroup = css`
		#warning {
			padding: 1rem;
			background: #ffff00;
			border: 0.2rem solid #b7b700;
		}
	`;
	protected render(): HTMLTemplateResult {
		return html`
			<div id="warning">
				<h2>Under construction</h2>
				<p>
					This post is still in the process of being written. Come back later for the full post.
				</p>
			</div>
		`
	}
}
