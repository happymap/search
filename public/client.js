function search() {
	var keyword = $('#keyword').val();
	if (keyword) {
		console.log('keyword: ' + keyword);
		$.ajax('http://localhost:3000/search/' + keyword)
		.done(function(data) {
			var i = 0, len = data['data'].length;
			var result = '';
			result += '<table border=1><tr><th>Brand</th><th>Name</th><th>public or private</th></tr>'
			for (; i<len; i++) {
				if (data['data'][i]['_source']['publicdish']) {
					result +='<tr><td>' + data['data'][i]['_source']['publicdish']['brand'] + '</td><td>' + data['data'][i]['_source']['publicdish']['name'] + '</td><td>public</td></tr>';
				} else {
					result +='<tr><td>' + data['data'][i]['_source']['privatedish']['brand'] + '</td><td>' + data['data'][i]['_source']['privatedish']['name'] + '</td><td>' + data['data'][i]['_source']['privatedish']['userId'] + '</td></tr>';
				}
			}
			result += '</table>';
			console.log(data);
			$('#content').html(result);
			$('#time').html('time used: ' + data['time'] + 'ms');
		})
		.fail(function() {
			alert("error");
		});
	}
}
