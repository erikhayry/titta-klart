import store from '../utils/store';

class Popup extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        playlist: []
    };

    async componentDidMount() {
        let playlist = await store.get('playlist');
        console.log(playlist)
        if(!playlist){
            await store.set('playlist', [
                "https://www.svtplay.se/video/2520376/pippi-langstrump/pippi-langstrump-sasong-1-avsnitt-1",
                "https://www.youtube.com/watch?v=BQxo3LR_lWY",
                "https://www.oppetarkiv.se/video/10678783/bamse-varldens-starkaste-bjorn-sasong-1-avsnitt-2-av-7",
                "https://www.svtplay.se/video/19323091/greta-gris/greta-gris-sasong-7-zoo"
            ]);
            playlist = await store.get('playlist');
        }
        console.log(playlist);
        this.setState({
            playlist
        })
    }

    render() {
        const { playlist = []} = this.state;
        return (
            <div>
                <h1>Barnvakt</h1>
                <ul>
                    {playlist.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        )
    }
}

export default Popup