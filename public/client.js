function search() {
	var keyword = $('#keyword').val();
	if (keyword) {
		console.log('keyword: ' + keyword);

		console.log('method: ' + $('input:radio[name=storage]').filter(":checked").val());

		if ($('input:radio[name=storage]').filter(":checked").val() != 'mongo') {

			$.ajax('http://localhost:3000/search/' + keyword + '?userId=' + $('input:text[name=userId]').val())
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
				$('#time').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>TIME USED: ' + data['time'] + 'ms </b>');
			})
			.fail(function() {
				alert("error");
			});

		} else {
			$.ajax('http://localhost:3000/search_mongo/' + keyword + '?userId=' + $('input:text[name=userId]').val())
			.done(function(data) {
				var i = 0, len = data['data'].length;
				var result = '';
				result += '<table border=1><tr><th>Brand</th><th>Name</th><th>public or private</th></tr>'
				for (; i<len; i++) {
					if (data['data'][i]['userId']) {
						result +='<tr><td>' + data['data'][i]['brand'] + '</td><td>' + data['data'][i]['name'] + '</td><td>' + data['data'][i]['userId'] + '</td></tr>';
					} else {
						result +='<tr><td>' + data['data'][i]['brand'] + '</td><td>' + data['data'][i]['name'] + '</td><td>public</td></tr>';
					}
				}
				result += '</table>';
				console.log(data);
				$('#content').html(result);
				$('#time').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>TIME USED: ' + data['time'] + 'ms </b');
			});

		}
	}
}
