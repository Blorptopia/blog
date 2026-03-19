import { LitElement, type HTMLTemplateResult, html, css, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("bb-nav")
export class NavElement extends LitElement {
	public static styles?: CSSResultGroup = css`
		nav {
			background: #232323;
			padding: 1rem;

			display: flex;
			gap: 1rem;
		}
		a {
			font-size: 1.2rem;
			color: white;
			text-decoration: none;
		}
		a:hover {
			text-decoration: underline;
		}
		.primary-link {
			font-weight: bold;
		}
	`;
	protected render(): HTMLTemplateResult {
		return html`
			<nav>
				<a class="primary-link" href="/">Blorptopia</a>
				<a href="/posts/">Posts</a>
			</nav>
		`;
	}
}
