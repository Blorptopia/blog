import { html, type HTMLTemplateResult, LitElement, type CSSResultGroup, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("bb-tross-poll-iterator-comparison-visualization")
export class TrossPollIteratorComparisonVisualizationElement extends LitElement {
	// State
	@state()
	private createdAt: number;
	@state()
	private fetchedPollingValue?: number;
	@state()
	private fetchedIteratorValue?: number;
	@state()
	private bufferedIteratorValue: number;

	public constructor() {
		super();
		this.createdAt = Date.now();
		this.bufferedIteratorValue = Date.now() - this.createdAt;
	}
	protected render(): HTMLTemplateResult {
		return html`
			<table>
				<tr>
					<th>Polling</th>
					<th>Iterator</th>
				</tr>
				<tr>
					<td>
						<div class="visualizer">
							<span class="fetched-value">Fetched value: ${this.fetchedPollingValue ?? "none yet"}</span>
						</div>
					</td>
					<td>
						<div class="visualizer">
							<span class="fetched-value">Fetched value: ${this.fetchedIteratorValue ?? "none yet"}</span>
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

	static styles?: CSSResultGroup = css`
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
}
