import Clone from "../Clone/Clone";

const stories = [
  { name: "Didact introduction", url: "http://bit.ly/2pX7HNn" },
  { name: "Rendering DOM elements ", url: "http://bit.ly/2qCOejH" },
  { name: "Element creation and JSX", url: "http://bit.ly/2qGbw8S" },
  { name: "Instances and reconciliation", url: "http://bit.ly/2q4A746" },
  { name: "Components and state", url: "http://bit.ly/2rE16nh" }
];

class App extends Clone.Component {
  render() {
    return (
      Clone.createElement(
        'div',
        {},
        Clone.createElement(
          'h1',
          {}
        ),
        Clone.createElement(
          'ul',
          {},
          this.props.stories.map(story => Clone.createElement(
            Story,
            {
              ...story
            },
          ))
        ))
    );
  }
}

class Story extends Clone.Component {
  constructor(props) {
    super(props);
    this.state = { likes: Math.ceil(Math.random() * 100) };
  }

  like() {
    this.setState({
      likes: this.state.likes + 1
    });
  }

  render() {
    const { name, url } = this.props;
    const { likes } = this.state;
    return Clone.createElement(
      'li',
      {},
      Clone.createElement(
        'button',
        {
          onClick: () => this.like()
        },
        likes
      ),
      Clone.createElement(
        'a',
        {
          href: url,
        },
        name
      )
    );
  }
}

Clone.render(
  Clone.createElement(
    App,
    {
      stories
    },
  ),
  document.getElementById("root")
);
