(function() {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form">
			<fieldset>
				<legend>Gauge Properties</legend>
				<table>
					<tr>
						<td>Angle</td>
						<td><input id="aps_angle" type="number" min="-140" max="140"></td>
					</tr>
				</table>
			</fieldset>
		</form>
	`;

	class GaugeAps extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
		}

		_submit(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							angleMax: this.angleMax
						}
					}
			}));
		}

		set angleMax(newAngle) {
			this._shadowRoot.getElementById("aps_angle").value = newAngle;
		}

		get angleMax() {
			return this._shadowRoot.getElementById("aps_angle").value;
		}
	}

customElements.define("com-sap-teched-gauge-solution-exe5-aps", GaugeAps);
})();