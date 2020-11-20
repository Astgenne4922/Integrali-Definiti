const functions = [
	{ F: "x^2", f: () => `sqrt(x - 1/${$("#plotSlider").val() - 1})^4`, title: "x<sup>2</sup>" },
	{ F: "x^3", f: () => `nthRoot(x - 1/${$("#plotSlider").val() - 1}, 3)^9`, title: "x<sup>3</sup>" },
	{ F: "sqrt(x)", f: () => `sqrt(x - 1/${$("#plotSlider").val() - 1})`, title: "<span>&#8730;</span>x<sup></sup>" },
	{ F: "x", f: () => `x - 1/${$("#plotSlider").val() - 1}`, title: "x<sup></sup>" },
];

const f = x => functionPlot.$eval.builtIn(plot.options.data[0], "fn", { x: x });

let IDX = 0;

let plot = functionPlot({
	target: "#plot",
	disableZoom: true,
	width: getSize()[0],
	height: getSize()[1],
	grid: true,
	xAxis: { domain: [0, 1.25] },
	yAxis: { domain: [0, 1.25] },
	data: [
		{
			fn: functions[IDX].F,
			color: "#0000ff",
		},
		{
			fn: functions[IDX].F,
			color: "#ff0000",
			range: [0, 1],
			nSamples: $("#plotSlider").val(),
			closed: true,
		},
		{
			fn: functions[IDX].f(),
			color: "#00ff00",
			range: [0, 1],
			nSamples: $("#plotSlider").val(),
			closed: true,
			skipTip: true,
		},
	],
});
plot.meta.yAxis.tickFormat(d => "" + +d);
plot.meta.xAxis.tickFormat(d => "" + +d);
plot.draw();

$("#title").html("f(x) = " + functions[IDX].title);

$(window).resize(() => {
	[plot.options.width, plot.options.height] = getSize();

	$("#plot").html("");
	plot = plot.build();

	plot.meta.yAxis.tickFormat(d => "" + +d);
	plot.meta.xAxis.tickFormat(d => "" + +d);
	plot.draw();
});

$("#titleContainer .button").click(e => {
	if ($(e.currentTarget).children().hasClass("right")) {
		if (IDX < functions.length - 1) changeFunction(++IDX);
		else changeFunction((IDX = 0));
	} else {
		if (IDX > 0) changeFunction(--IDX);
		else changeFunction((IDX = 3));
	}
});

let timeout, interval;
$("#input .button").on("mousedown", e => {
	sliderButtons(e);
	changeSlider();

	timeout = setTimeout(() => {
		interval = setInterval(() => {
			sliderButtons(e);
			changeSlider();
		}, 50);
	}, 300);
});
$(".button").on("mouseup mouseleave", () => {
	clearTimeout(timeout);
	clearInterval(interval);
});

$("#plotSlider").on("input", () => changeSlider());

$("#sliderLabel").text(`Numero di suddivisioni: ${$("#plotSlider").val() - 1}`);
calculate($("#plotSlider").val() - 1, "#result");

function calculate(n, label) {
	let [s, S] = [0, 0];
	let base = 1 / n;

	for (let i = 0; i < n; i++) {
		s += f(i * base) * base;
		S += f((i + 1) * base) * base;
	}

	$(label).html(
		`<span style="color: #60b030">S<sub>n</sub>: ${s.toFixed(3)}</span><br>
        <span style="color: #ff5060">S<sub>N</sub>: ${S.toFixed(3)}</span><br>
        Precisione: ${isNaN(((s / S) * 100).toFixed(3)) ? 0 : ((s / S) * 100).toFixed(3)}%`
	);
}

function changeSlider() {
	$("#sliderLabel").text(`Numero di suddivisioni: ${$("#plotSlider").val() - 1}`);
	plot.options.data[2].nSamples = $("#plotSlider").val();
	plot.options.data[1].nSamples = $("#plotSlider").val();
	plot.options.data[2].fn = functions[IDX].f();
	plot.draw();
	calculate($("#plotSlider").val() - 1, "#result");
}

function changeFunction(x) {
	plot.options.data[0].fn = functions[x].F;
	plot.options.data[1].fn = functions[x].F;
	plot.options.data[2].fn = functions[x].f();
	$("#title").html("f(x) = " + functions[IDX].title);
	calculate($("#plotSlider").val() - 1, "#result");
	plot.draw();
}

function sliderButtons(e) {
	$("#plotSlider")
		.val((_, c) => ($(e.currentTarget).children().hasClass("right") ? +c + 1 : +c - 1))
		.change();
}

function getSize() {
	let width = 800;
	let height = document.body.getBoundingClientRect().height;
	let ratio = document.body.getBoundingClientRect().width / width;
	width *= ratio;
	if (innerWidth > 1000) {
		width *= 60 / 100;
		height *= 9 / 10;
	} else height *= 2 / 3;

	return [width, height];
}
