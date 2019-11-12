(function()  {
    let d3Script = document.createElement('script');
    d3Script.src = 'https://d3js.org/d3.v5.min.js';
    d3Script.async = false;
    document.head.appendChild(d3Script);

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
      <style>
      </style>
    `;

    d3Script.onload = () => 

    customElements.define('com-sap-teched-gauge-solution-exe5', class Gauge extends HTMLElement {


        disconnectedCallback () {
            // your cleanup code goes here
            try{
                document.head.removeChild(d3Script);
            }
            catch{}
        }

        connectedCallback () {
            const bcRect = this.getBoundingClientRect();
            this._widgetHeight = bcRect.height;
            this._widgetWidth = bcRect.width;
            this.redraw();
        }
    
        constructor() {
            super();
            //Constants
            if (!window._d3){
                window._d3 = d3;
            }
            
            this._shadowRoot = this.attachShadow({mode: 'open'});
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            this.style.height = "100%";  //Beta Workaround
            this._svgContainer;
    
            this._outerRad = 0.0;
            this._endAngleDeg = 0.0;
            this._endAngleDegMax = 145.0;
            this._startAngleDeg = -145.0;
            
            //Guide Lines
            this._ringColorCode = 'black';
            this._guideOpacity = 0.75;
            this._ringThickness = 5;
            this._bracketThickness = 5;

            //Adding event handler for click events
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
        };

        onCustomWidgetResize(width, height) {
            const bcRect = this.getBoundingClientRect();
            this._widgetHeight = bcRect.height;
            this._widgetWidth = bcRect.width;
            this.redraw();
        }

        //Getters and Setters
        get angleMax() {
            return this._endAngleDeg;
        }
        set angleMax(value) {
            //Empty the shadow dom
            if (this._svgContainer){
                this._svgContainer._groups[0][0].innerHTML = "";
            }

            this._endAngleDeg = value;
            this.redraw();
        };

        redraw() {
            if (this._widgetHeight < this._widgetWidth){
                this._widgetWidth = this._widgetHeight;
            }

            if (!this._svgContainer){
                this._svgContainer = window._d3.select(this._shadowRoot)
                .append("svg:svg")
                .attr("id", "gauge")
                .attr("width", this._widgetWidth)
                .attr("height", this._widgetWidth);
            } else{
                window._d3.select(this._shadowRoot).selectAll("*").remove();
                this._svgContainer = window._d3.select(this._shadowRoot)
                .append("svg:svg")
                .attr("id", "gauge")
                .attr("width", this._widgetWidth)
                .attr("height", this._widgetWidth);
            }
            
            var pi = Math.PI;		
            this._outerRad = (this._widgetWidth)/2;

            var arcDef = window._d3.arc()
                .innerRadius(0)
                .outerRadius(this._outerRad);

            var guageArc = this._svgContainer.append("path")
                .datum({endAngle: this._endAngleDeg * (pi/180), startAngle: this._startAngleDeg * (pi/180)})
                .style("fill", this._displayedColor)
                .attr("width", this._widgetWidth).attr("height", this._widgetWidth) // Added height and width so arc is visible
                .attr("transform", "translate(" + this._outerRad + "," + this._outerRad + ")")
                .attr("d", arcDef)
                .attr( "fill-opacity", this._gaugeOpacity );
            

            ///////////////////////////////////////////	
            //Lets build a border ring around the gauge
            ///////////////////////////////////////////
            var visRing = window._d3.select(this._shadowRoot).append("svg:svg").attr("width", "100%").attr("height", "100%");
                
            var ringOuterRad = this._outerRad + ( -1 * this._ringThickness);  //Outer ring starts at the outer radius of the inner arc
    
            var ringArcDefinition = window._d3.arc()
                .innerRadius(this._outerRad)
                .outerRadius(ringOuterRad)
                .startAngle(this._startAngleDeg * (pi/180)) //converting from degs to radians
                .endAngle(this._endAngleDegMax * (pi/180)) //converting from degs to radians
    
            var ringArc = this._svgContainer
                .append("path")
                .attr("d", ringArcDefinition)
                .attr("fill", this._ringColorCode)
                .attr("transform", "translate(" + this._outerRad + "," + this._outerRad + ")");


            ///////////////////////////////////////////
            //Lets build a the start and end lines
            ///////////////////////////////////////////
            var visStartBracket = window._d3.select(this._shadowRoot).append("svg:svg").attr("width", "100%").attr("height", "100%");
            var lineData = [this.endPoints(this._outerRad, this._startAngleDeg), {x:this._outerRad, y:this._outerRad}, this.endPoints (this._outerRad, this._endAngleDegMax)];
            var lineFunction = window._d3.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; });
                                        
            var borderLines = this._svgContainer
                .attr("width", this._widgetWidth).attr("height", this._widgetWidth) // Added height and width so line is visible
                .append("path")
                .attr("d", lineFunction(lineData))
                .attr("stroke", this._ringColorCode)
                .attr("stroke-width", this._bracketThickness)
                .attr("fill", "none");	
	
        };


        //Helper function	
        endPoints (lineLength, lineAngle){
            var pi = Math.PI;
            var endX = this._outerRad + (lineLength * Math.sin(lineAngle * (pi/180)));
            var endY = this._outerRad - (lineLength * Math.cos(lineAngle * (pi/180)));
            return {x:endX, y:endY}
        };
    
    
    });
        
})();