class Plotlynf {

	static params = {
		id: '',
		dragmode: 'zoom',	// "zoom" | "pan" | "orbit" | "turntable"
		width: 500,			// 表示サイズの幅
		height: 500,		// 表示サイズの高さ
		keepaspect: false,	// アスペクト比を維持するか
		texts: [ 'x', 'y', 'z' ], // 軸の名称
		ranges: null,		// ビューの範囲のデフォルト値
	};
	
	static config(args) {
		for (let key in this.params) {
			if(typeof args[key] !== 'undefined') {
				this.params[key] = args[key];
			}
		}
	}

	static plot2d(
		{ 
			func = x => x,		// 関数 f(x) | f(y)
			variable = 'x',		// 変数 'x' | 'y'
			plots = [
				{
					min: -10, 	// 変数をplotする変数の最小値
					max: 10,	// 変数をplotする変数の最大値
					step: 1,	// 変数をplotするピッチ
				},
			],			
			width = 500,		// 表示サイズの幅
			height = 500,		// 表示サイズの高さ
			line = {
				color: 'rgba(49,130,189, 1)',	// 線の色
				width: 1,				// 線の太さ
			},
		} = {}
	) {
		if(!this.params.id) { throw 'id is not defined.' }

		if(!line.color) { line.color = 'rgba(49,130,189, 1)'; }
		if(!line.width) { line.width = 1; }

		let xDatas = [], yDatas = [];

		for(let x = plots[0].min; x <= plots[0].max + plots[0].step * 0.0001; x += plots[0].step) {
			xDatas.push(x);
			yDatas.push(func(x));
		}

		if(variable === 'y') {
			[xDatas, yDatas] = [yDatas, xDatas];
		}
		
		const data = [
			{
			    x: xDatas,
			    y: yDatas,
			    type:'scatter',
			    mode:'lines',
			    showlegend: false,
			    line,
			}
		];

		const layout = {
			xaxis: {
		    	title: this.params.texts[0],
		    	range: this.params.ranges && this.params.ranges.length >= 1 ? 
		    		[ this.params.ranges[0].min, this.params.ranges[0].max ] : null,
			},
			yaxis: {
		    	title: this.params.texts[1],		
		    	range: this.params.ranges && this.params.ranges.length >= 2 ? 
		    		[ this.params.ranges[1].min, this.params.ranges[1].max ] : null,
		    	scaleanchor: this.params.keepaspect ? 'x' : '',
			},
			scene:{
	    		xaxis: { showspikes: false },
	    		yaxis: { showspikes: false },
	    	},
		    margin: {
	    		l: 50,
	    		r: 0,
	    		b: 50,
	    		t: 0,
	    		pad: 5
	  		}, 
	  		title: false,
		    hovermode: false,
		    dragmode: this.params.dragmode,
		    autosize: false, 
		    width: this.params.width, 
		    height: this.params.height, 
		};

		const config = {
			scrollZoom: true,
			displaylogo: false,
		}

		Plotly.plot(this.params.id, data, layout, config);
	}

	static plot3d(
		{ 
			func = (x, y) => x + y,		// 関数 f(x, y) | f(x, z) | f(y, x) | f(y, z) | f(z, x) | f(z, y)
			variable = 'xy',			// 変数 'xy' | 'xz' | 'yx' | 'yz' | 'zx' | 'zy'
			plots = [
				{
					min: -10, 			// 1番目の変数をplotする変数の最小値
					max: 10,			// 1番目の変数をplotする変数の最大値
					step: 1,			// 1番目の変数をplotするピッチ
				},
				{
					min: -10, 			// 2番目の変数をplotする変数の最小値
					max: 10,			// 2番目の変数をplotする変数の最大値
					step: 1,			// 2番目の変数をplotするピッチ
				}
			],
			line = {
				color: 'rgba(49,130,189, 1)',	// 線の色
				width: 1,				// 線の太さ
			},			
		} = {}
	) {

		if(!this.params.id) { throw 'id is not defined.' }

		if(!line.color) { line.color = 'rgba(49,130,189, 1)'; }
		if(!line.width) { line.width = 1; }

		const data = [];

		for(let x = plots[0].min; x <= plots[0].max + plots[0].step * 0.0001; x += plots[0].step) {
			let xDatas = [], yDatas = [], zDatas = [];
			for(let y = plots[1].min; y <= plots[1].max + plots[1].step * 0.0001; y += plots[1].step) {
				xDatas.push(x);
				yDatas.push(y);
				zDatas.push(func(x, y));
			}	
			if(variable === 'xz') {
				[xDatas, zDatas, yDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'yx') {
				[yDatas, xDatas, zDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'yz') {
				[yDatas, zDatas, xDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'zx') {
				[zDatas, xDatas, yDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'zy') {
				[zDatas, yDatas, xDatas] = [xDatas, yDatas, zDatas];
			} 
			data.push({
				x: xDatas,
			    y: yDatas,
			    z: zDatas,
			    type: 'scatter3d',
			    mode: 'lines',
			    showlegend: false,
			    line,
			});
		}

		for(let y = plots[1].min; y <= plots[1].max + plots[1].step * 0.0001; y += plots[1].step) {
			let xDatas = [], yDatas = [], zDatas = [];
			for(let x = plots[0].min; x <= plots[0].max + plots[0].step * 0.0001; x += plots[0].step) {
				xDatas.push(x);
				yDatas.push(y);
				zDatas.push(func(x, y));
			}	
			if(variable === 'xz') {
				[xDatas, zDatas, yDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'yx') {
				[yDatas, xDatas, zDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'yz') {
				[yDatas, zDatas, xDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'zx') {
				[zDatas, xDatas, yDatas] = [xDatas, yDatas, zDatas];
			} else if(variable === 'zy') {
				[zDatas, yDatas, xDatas] = [xDatas, yDatas, zDatas];
			} 
			data.push({
				x: xDatas,
			    y: yDatas,
			    z: zDatas,
			    type: 'scatter3d',
			    mode: 'lines',
			    showlegend: false,
			    line,
			});
		}	

		const layout = {
			aspectratio: 'data',
			xaxis: {
		    	title: this.params.texts[0],	
		    	range: this.params.ranges && this.params.ranges.length >= 1 ? 
		    		[ this.params.ranges[0].min, this.params.ranges[0].max ] : null,
			},
			yaxis: {
		    	title: this.params.texts[1],	
		    	range: this.params.ranges && this.params.ranges.length >= 2 ? 
		    		[ this.params.ranges[1].min, this.params.ranges[1].max ] : null,
			},
			zaxis: {
		    	title: this.params.texts[2],	
		    	range: this.params.ranges && this.params.ranges.length >= 3 ? 
		    	[ this.params.ranges[2].min, this.params.ranges[2].max ] : null,
			},
			scene:{
				aspectmode: this.params.keepaspect ? 'data' : '',
	    		xaxis: { showspikes: false },
	    		yaxis: { showspikes: false },
	    		zaxis: { showspikes: false }
			},
			margin: {
	    		l: 0,
	    		r: 0,
	    		b: 0,
	    		t: 0,
	    		pad: 5
	  		}, 
	  		title: false,
		    hovermode: false,
		    dragmode: this.params.dragmode,
		    autosize: true, 
		    width: this.params.width, 
		    height: this.params.height, 
		};

		const config = {
			scrollZoom: true,
			displaylogo: false,
		}

		Plotly.plot(this.params.id, data, layout, config);
	}
}