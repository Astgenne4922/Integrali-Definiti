//#region Loading LocalStorage Data

const funcLatex = localStorage.getItem("funcLatex") === "" ? "x^2" : localStorage.getItem("funcLatex") ?? "x^2";

$("#plotSlider")
	.val(JSON.parse(localStorage.getItem("sliderVal")) ?? 2)
	.change()
	.on("input", changeSlider);
$("#sliderLabel").text(`Numero di suddivisioni: ${$("#plotSlider").val()}`);

let [a, b] = [JSON.parse(localStorage.getItem("rangeA")) ?? 0, JSON.parse(localStorage.getItem("rangeB")) ?? 1];
$("#range span:nth-child(1)").text(a);
$("#range span:nth-child(2)").text(b);

let [infsupShow, midShow, trapShow, simpsShow, isInvalidRange] = [
	JSON.parse(localStorage.getItem("infsupShow")) ?? true,
	JSON.parse(localStorage.getItem("midShow")) ?? false,
	JSON.parse(localStorage.getItem("trapShow")) ?? false,
	JSON.parse(localStorage.getItem("simpsShow")) ?? false,
	JSON.parse(localStorage.getItem("isInvalidRange")) ?? false,
];
$("input[type='checkbox']").on("change", changeCheckbox);
$("#infsup").prop("checked", infsupShow);
$("#middle").prop("checked", midShow);
$("#trap").prop("checked", trapShow);
$("#simps").prop("checked", simpsShow);

//#endregion Loading LocalStorage Data

//#region Plot Expressions Loading

const plot = Desmos.GraphingCalculator(document.querySelector("#plot"), {
	keypad: false,
	expressions: false,
	settingsMenu: false,
});

plot.setState({
	expressions: {
		list: [
			{ type: "expression", id: "function", latex: `f(x)=${funcLatex}`, color: Desmos.Colors.BLACK },
			{ type: "expression", id: "subdivisions", latex: `n=${$("#plotSlider").val()}` },
			{ type: "expression", id: "sub_list", latex: "i=[1...n]" },
			//#region Range
			{ id: "range_folder", title: "range_folder", type: "folder" },
			{
				type: "expression",
				id: "slider_A",
				latex: `a=${a}`,
				slider: { hardmax: true, hardmin: true, min: -1000, max: 1000, step: 0.1 },
				folderId: "range_folder",
			},
			{ type: "expression", id: "vertical_A", latex: "x=a", color: Desmos.Colors.GREEN, folderId: "range_folder" },
			{
				type: "expression",
				id: "point_A",
				latex: "(a, 0)",
				color: Desmos.Colors.GREEN,
				label: "a",
				showLabel: true,
				folderId: "range_folder",
			},
			{
				type: "expression",
				id: "slider_B",
				latex: `b=${b}`,
				slider: { hardmax: true, hardmin: true, min: -1000, max: 1000, step: 0.1 },
				folderId: "range_folder",
			},
			{ type: "expression", id: "vertical_B", latex: "x=b", color: Desmos.Colors.GREEN, folderId: "range_folder" },
			{
				type: "expression",
				id: "point_B",
				latex: "(b, 0)",
				color: Desmos.Colors.GREEN,
				label: "b",
				showLabel: true,
				folderId: "range_folder",
			},
			//#endregion Range
			//#region Area
			{ id: "area_folder", title: "area_folder", type: "folder" },
			{
				type: "expression",
				id: "positive_area",
				latex: "0\\le y\\le f\\left(x\\right)\\left\\{\\left(a-x\\right)\\left(b-x\\right)<0\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "area_folder",
			},
			{
				type: "expression",
				id: "negative_area",
				latex: "f\\left(x\\right)\\le y\\le0\\left\\{\\left(a-x\\right)\\left(b-x\\right)<0\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "area_folder",
			},
			//#endregion Area
			//#region Approximations
			{ id: "approx_folder", title: "approx_folder", type: "folder" },
			{
				type: "expression",
				id: "sum(infsup)_list",
				latex:
					"S_{infsup}=\\left[\\sum_{j=1}^{n}f\\left(a+\\left(j-1\\right)\\left(\\frac{b-a}{n}\\right)\\right)\\left(\\frac{b-a}{n}\\right),\\sum_{j=1}^{n}f\\left(a+j\\left(\\frac{b-a}{n}\\right)\\right)\\left(\\frac{b-a}{n}\\right)\\right]",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum(mid)_list",
				latex:
					"S_{mid}=\\sum_{j=1}^{n}\\left(f\\left(\\frac{a+j\\left(\\frac{b-a}{n}\\right)+a+\\left(j-1\\right)\\left(\\frac{b-a}{n}\\right)}{2}\\right)\\right)\\left(\\frac{b-a}{n}\\right)",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum(trap)_list",
				latex:
					"S_{trap}=\\frac{\\left(\\frac{b-a}{n}\\right)}{2}\\left(f\\left(a\\right)+f\\left(b\\right)+2\\sum_{j=1}^{n-1}f\\left(a+j\\left(\\frac{b-a}{n}\\right)\\right)\\right)",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum(simp)_list",
				latex:
					"S_{simp}=\\frac{1}{3}\\left(\\frac{b-a}{2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)}\\right)\\left(f\\left(a\\right)+\\sum_{j=1}^{\\operatorname{ceil}\\left(\\frac{n}{2}\\right)}4f\\left(a+\\left(2j-1\\right)\\left(\\frac{b-a}{2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)}\\right)\\right)+\\sum_{k=1}^{\\operatorname{ceil}\\left(\\frac{n}{2}\\right)-1}2f\\left(a+2k\\left(\\frac{b-a}{2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)}\\right)\\right)+f\\left(b\\right)\\right)",
				folderId: "approx_folder",
			},
			{
				type: "expression",
				id: "sum_list",
				latex:
					"S=\\left[S_{infsup}\\left[1\\right],S_{infsup}\\left[2\\right],S_{mid},S_{trap},S_{simp},\\int_{a}^{b}f\\left(x\\right)dx\\right]",
				folderId: "approx_folder",
			},
			//#endregion Approximations
			{
				type: "expression",
				id: "delta_x",
				latex: "\\Delta_{x}=\\left(i-1\\right)\\frac{\\max\\left(b,a\\right)-\\min\\left(b,a\\right)}{n}",
				hidden: true,
			},
			{
				type: "expression",
				id: "delta_X",
				latex: "\\Delta_{X}=i\\frac{\\max\\left(b,a\\right)-\\min\\left(b,a\\right)}{n}",
				hidden: true,
			},
			//#region Rectangles (Inferior and Superior Sums)
			{ id: "rect_folder (sup and inf)", title: "rect_folder (sup and inf)", type: "folder" },
			{
				type: "expression",
				id: "big_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "big_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "big_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\right)\\right\\}",
				color: Desmos.Colors.RED,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			{
				type: "expression",
				id: "small_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.GREEN,
				folderId: "rect_folder (sup and inf)",
			},
			//#endregion Rectangles (Inferior and Superior Sums)
			//#region Rectangles (Middle Point Sum)
			{ id: "rect_folder (mid)", title: "rect_folder (mid)", type: "folder" },
			{
				type: "expression",
				id: "mid_rect",
				latex:
					"\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			{
				type: "expression",
				id: "mid_rect_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			{
				type: "expression",
				id: "mid_rect_vert2",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{X}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\frac{\\Delta_{x}+\\Delta_{X}}{2}\\right)\\right)\\right\\}",
				color: Desmos.Colors.PURPLE,
				folderId: "rect_folder (mid)",
			},
			//#endregion Rectangles (Middle Point Sum)
			//#region Trapezes
			{ id: "trap_folder", title: "trap_folder", type: "folder" },

			{
				type: "expression",
				id: "T(x)",
				latex:
					"T\\left(x\\right)=f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{X}}{\\Delta_{x}-\\Delta_{X}}\\right)+f\\left(\\min\\left(b,a\\right)+\\Delta_{X}\\right)\\left(\\frac{x-\\min\\left(b,a\\right)-\\Delta_{x}}{\\Delta_{X}-\\Delta_{x}}\\right)",
				hidden: true,
				folderId: "trap_folder",
			},
			{
				type: "expression",
				id: "trap",
				latex:
					"\\min\\left(0,T\\left(x\\right)\\right)\\le y\\le\\max\\left(0,T\\left(x\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{x}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{X}\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			{
				type: "expression",
				id: "trap_vert1",
				latex:
					"x=\\min\\left(b,a\\right)+\\Delta_{x}\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)+\\Delta_{x}\\right)\\right)\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			{
				type: "expression",
				id: "trap_vert2",
				latex:
					"x=\\min\\left(b,a\\right)\\left\\{\\min\\left(0,f\\left(\\min\\left(b,a\\right)\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\min\\left(b,a\\right)\\right)\\right)\\right\\}",
				color: Desmos.Colors.ORANGE,
				folderId: "trap_folder",
			},
			//#endregion Trapezes
			//#region Simpson
			{ id: "simp_folder", title: "simp_folder", type: "folder" },
			{
				type: "expression",
				id: "i_s",
				latex: "i_{s}=\\left[1...2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)\\right]",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "delta_s",
				latex:
					"\\Delta_{s}=\\frac{\\max\\left(b,a\\right)-\\min\\left(b,a\\right)}{2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "delta_s1",
				latex: "\\Delta_{s1}=\\left(\\left[2...2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)\\right]-2\\right)\\Delta_{s}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "delta_s2",
				latex: "\\Delta_{s2}=\\left(\\left[2...2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)\\right]-1\\right)\\Delta_{s}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "delta_s3",
				latex: "\\Delta_{s3}=\\left[2...2\\cdot\\operatorname{ceil}\\left(\\frac{n}{2}\\right)\\right]\\Delta_{s}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "simp_par",
				latex:
					"P\\left(x\\right)=f\\left(\\min\\left(b,a\\right)+\\Delta_{s1}\\right)\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s2}}{\\Delta_{s1}-\\Delta_{s2}}\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s3}}{\\Delta_{s1}-\\Delta_{s3}}+f\\left(\\min\\left(b,a\\right)+\\Delta_{s2}\\right)\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s1}}{\\Delta_{s2}-\\Delta_{s1}}\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s3}}{\\Delta_{s2}-\\Delta_{s3}}+f\\left(\\min\\left(b,a\\right)+\\Delta_{s3}\\right)\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s1}}{\\Delta_{s3}-\\Delta_{s1}}\\cdot\\frac{x-\\min\\left(b,a\\right)-\\Delta_{s2}}{\\Delta_{s3}-\\Delta_{s2}}\\left\\{\\min\\left(b,a\\right)+\\Delta_{s1}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{s3}\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "simp",
				latex:
					"\\min\\left(0,\\ P\\left(x\\right)\\right)\\le y\\le\\max\\left(0,\\ P\\left(x\\right)\\right)\\left\\{\\min\\left(b,a\\right)+\\Delta_{s1}\\le x\\le\\min\\left(b,a\\right)+\\Delta_{s3}\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "simp_vert1",
				latex:
					"x=\\min\\left(a,\\ b\\right)+\\left(i_{s}-1\\right)\\Delta_{s}\\left\\{\\min\\left(0,\\ f\\left(\\min\\left(a,\\ b\\right)+\\left(i_{s}-1\\right)\\Delta_{s}\\right)\\right)\\le y\\le\\max\\left(0,\\ f\\left(\\min\\left(a,\\ b\\right)+\\left(i_{s}-1\\right)\\Delta_{s}\\right)\\right)\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			{
				type: "expression",
				id: "simp_vert2",
				latex:
					"x=\\max\\left(a,b\\right)\\left\\{\\min\\left(0,f\\left(\\max\\left(a,b\\right)\\right)\\right)\\le y\\le\\max\\left(0,f\\left(\\max\\left(a,b\\right)\\right)\\right)\\right\\}",
				color: Desmos.Colors.BLUE,
				folderId: "simp_folder",
			},
			//#endregion Simpson
		],
	},
	graph: {
		viewport: {
			xmin: -2,
			xmax: 2,
			ymin: -1,
			ymax: 2,
		},
	},
	version: 7,
	randomSeed: "",
});
plot.newRandomSeed();

//#endregion Plot Expressions Loading

//#region Helper Expressions

const hAB = plot.HelperExpression({ latex: "[a, b]" });
hAB.observe("listValue", () => {
	localStorage.setItem(
		"rangeA",
		$("#range span:nth-child(1)")
			.text((a = hAB.listValue[0]))
			.text()
	);
	localStorage.setItem(
		"rangeB",
		$("#range span:nth-child(2)")
			.text((b = hAB.listValue[1]))
			.text()
	);
});

const hS = plot.HelperExpression({ latex: "S" });
hS.observe("listValue", () => {
	if (hS.listValue) {
		let [Sinf, Ssup, Smid, Strap, Ssimp, I] = !isNaN(hS.listValue[5])
			? hS.listValue.map(i => i.toFixed(10))
			: [..."000000"].map(_ => "Intervallo non valido");

		if (I == 0) [Sinf, Ssup, Smid, Strap, Ssimp, I] = [0, 0, 0, 0, 0, 0];

		$("#result").html(
			`${span("#60b030", "inf", Sinf, I)}
			${span("#ff5060", "sup", Ssup, I)}
			${span("#6b53a4", "mid", Smid, I)}
			${span("#fa9747", "trap", Strap, I)}
			${span("#6392c1", "simp", Ssimp, I)}
			<span style="color: #6050ff">Valore Reale: ${I}</span><br>`
		);

		localStorage.setItem("isInvalidRange", (isInvalidRange = isNaN(hS.listValue[5])));
		hide_show(isInvalidRange ? isInvalidRange : !infsupShow, "rect_folder (sup and inf)");
		hide_show(isInvalidRange ? isInvalidRange : !midShow, "rect_folder (mid)");
		hide_show(isInvalidRange ? isInvalidRange : !trapShow, "trap_folder");
		hide_show(isInvalidRange ? isInvalidRange : !simpsShow, "simp_folder");
	}
});

function errorP(known, experimental) {
	return Math.abs((Math.abs(known - experimental) / known) * 100).toFixed(5);
}

function span(color, sub, val, real) {
	return `<span style='white-space: pre; color: ${color};'>S<sub>${sub}</sub>:	${val} --> E<sub>%</sub>:${
		!isNaN(errorP(real, val)) ? errorP(real, val) : 0
	}%</span><br>`;
}

//#endregion Helper Expressions

//#region Mathquill Editor Settings

const answerMathField = MathQuill.getInterface(2).MathField(document.querySelector("#latex"), {
	handlers: {
		edit: () => {
			plot.setExpression({ id: "function", latex: `f(x)=${answerMathField.latex()}` });
			localStorage.setItem("funcLatex", answerMathField.latex());
		},
	},
});
answerMathField.latex(funcLatex);

//#endregion Mathquill Editor Settings

//#region Arrow Buttons Code

let timeout, interval;
$("#slider .button")
	.on("mousedown", e => {
		sliderButtons(e);
		changeSlider();

		timeout = setTimeout(() => {
			interval = setInterval(() => {
				sliderButtons(e);
				changeSlider();
			}, 50);
		}, 300);
	})
	.on("mouseup mouseleave", () => {
		clearTimeout(timeout);
		clearInterval(interval);
	});

//#endregion Arrow Buttons Code

//#region Helper functions

function changeSlider() {
	let v = $("#plotSlider").val();
	localStorage.setItem("sliderVal", v);
	plot.setExpression({ id: "subdivisions", latex: `n=${v}` });
	$("#sliderLabel").text(`Numero di suddivisioni: ${v}`);
}

function sliderButtons(e) {
	$("#plotSlider")
		.val((_, c) => ($(e.currentTarget).children().hasClass("right") ? +c + 1 : +c - 1))
		.change();
}

//#endregion Helper functions

//#region Checkboxes functions

function changeCheckbox(e) {
	switch (e.target.id) {
		case "infsup":
			localStorage.setItem("infsupShow", (infsupShow = e.target.checked));
			if (!isInvalidRange) hide_show(!infsupShow, "rect_folder (sup and inf)");
			break;
		case "middle":
			localStorage.setItem("midShow", (midShow = e.target.checked));
			if (!isInvalidRange) hide_show(!midShow, "rect_folder (mid)");
			break;
		case "trap":
			localStorage.setItem("trapShow", (trapShow = e.target.checked));
			if (!isInvalidRange) hide_show(!trapShow, "trap_folder");
			break;
		case "simps":
			localStorage.setItem("simpsShow", (simpsShow = e.target.checked));
			if (!isInvalidRange) hide_show(!simpsShow, "simp_folder");
			break;
		default:
			break;
	}
}

function hide_show(hidden, folder) {
	plot.setExpression({
		id: folder,
		hidden: hidden,
	});
}

//#endregion Checkboxes functions
