var h = preact.h;

function createClass(obj) {
	function F(){ preact.Component.call(this); }
	var p = F.prototype = Object.create(preact.Component.prototype);
	for (var i in obj) p[i] = obj[i];
	return p.constructor = F;
}

/* Above: setup. Below: app */

var App = createClass({
	componentDidMount: function() {
		this.setState({
			title: 'Song Title',
			artist: 'Artist Name',
			album: 'Album Title'
		});
	},
	render: function(props, state) {
		return (
			h('div', { id:'main', class: 'stack main' },
				h('div', { id: 'now-playing', class: 'now-playing' },
					h('div', { id: 'song-info', class: 'song-info' },
						h('div', { id: 'song-title', class: 'song-title' }, 'title'),
						h('div', { id: 'artist-name', class: 'artist-name' }, 'artist'),
						h('div', { id: 'album-title', class: 'album-title' }, 'album')
					)
				)
			)
		);
	}
});

preact.render(h(App), document.body);